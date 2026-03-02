import { z } from 'zod';
import { Prisma } from '@prisma/client';
import { syncAppointments } from '../tebra-api/tebraSync.js';
import { handleControllerError, sendSuccess, sendError } from '../../shared/errorHandlers.js';
import { createChildLogger } from '../../shared/logger.js';
import prisma from '../../prisma.js';
const log = createChildLogger('appointments');

function formatDateForTebra(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function getDefaultDateRange(): { firstDayOfMonth: Date; lastDayOfNextMonth: Date; fromDate: string; toDate: string } {
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
  const lastDayOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 2, 0, 23, 59, 59);
  return {
    firstDayOfMonth,
    lastDayOfNextMonth,
    fromDate: formatDateForTebra(firstDayOfMonth),
    toDate: formatDateForTebra(lastDayOfNextMonth),
  };
}

const appointmentController = {
  getAppointments: async (req, res, next) => {
    try {
      const { firstDayOfMonth, lastDayOfNextMonth, fromDate, toDate } = getDefaultDateRange();

      try {
        await syncAppointments(fromDate, toDate);
      } catch (syncErr) {
        log.warn({ error: syncErr }, 'Tebra sync failed, returning cached data');
      }

      const appointments = await prisma.appointment.findMany({
        relationLoadStrategy: 'join',
        where: {
          startDate: {
            gte: firstDayOfMonth,
            lte: lastDayOfNextMonth,
          },
        },
        orderBy: {
          startDate: 'asc',
        },
        include: {
          patient: {
            select: {
              patientFullName: true,
              dob: true,
              primaryInsurancePolicyNumber: true,
              alertMessage: true,
              patientBalance: true,
            },
          },
        },
      });
      log.debug(`Total appointments: ${appointments.length}`);

      const flattenedAppointments = appointments.map(({ patient, ...rest }) => ({
        ...rest,
        ...(patient ?? {}),
      }));
      res.locals.appointments = flattenedAppointments;

      return next();
    } catch (error) {
      handleControllerError(error, 'getAppointments', next, 'Error fetching appointments');
    }
  },

  updateNote: async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      const { notes } = req.body;

      const appointment = await prisma.appointment.findUnique({ where: { id } });
      if (!appointment) {
        return sendError(res, 'Appointment not found', 404);
      }

      await prisma.appointment.update({
        where: { id },
        data: { notes: notes ?? null },
      });

      return sendSuccess(res, null, 'Note updated');
    } catch (error) {
      handleControllerError(error, 'updateNote', next, 'Error updating appointment note');
    }
  },

  updateCopay: async (req, res, next) => {
    try {
      const UpdateCopaySchema = z.object({
        id: z.number().int().positive(),
        copay: z.number().nonnegative(),
      });
      const parsed = UpdateCopaySchema.safeParse(req.body);
      if (!parsed.success) {
        return sendError(res, 'Invalid input', 400);
      }
      const { id, copay } = parsed.data;
      log.debug({ id, copay }, 'Updating copay');

      await prisma.appointment.update({
        where: { id },
        data: { patientCopay: copay },
      });

      next();
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return sendError(res, 'Appointment not found', 404);
      }
      handleControllerError(error, 'updateCopay', next, 'Error updating copay');
    }
  },

  deleteAll: async (req, res, next) => {
    try {
      await prisma.appointment.deleteMany({});
      return sendSuccess(res, null, 'Records deleted');
    } catch (error) {
      handleControllerError(error, 'deleteAll', next, 'Error deleting appointments');
    }
  },
};

export default appointmentController;
