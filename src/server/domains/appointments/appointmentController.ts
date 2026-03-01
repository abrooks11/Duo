import { PrismaClient } from '@prisma/client';
import { syncAppointments } from '../tebra-api/tebraSync.ts';
import { handleControllerError, sendSuccess, sendError } from '../../shared/errorHandlers.js';
import { createChildLogger } from '../../shared/logger.js';

const prisma = new PrismaClient();
const log = createChildLogger('appointments');

const appointmentController = {
  getAppointments: async (req, res, next) => {
    try {
      const now = new Date();

      const firstDayOfMonth = new Date(
        now.getFullYear(),
        now.getMonth(),
        1,
        0,
        0,
        0
      );

      const lastDayOfNextMonth = new Date(
        now.getFullYear(),
        now.getMonth() + 2,
        0,
        23,
        59,
        59
      );

      const fromDate = `${firstDayOfMonth.getFullYear()}-${String(firstDayOfMonth.getMonth() + 1).padStart(2, '0')}-${String(firstDayOfMonth.getDate()).padStart(2, '0')}`;
      const toDate = `${lastDayOfNextMonth.getFullYear()}-${String(lastDayOfNextMonth.getMonth() + 1).padStart(2, '0')}-${String(lastDayOfNextMonth.getDate()).padStart(2, '0')}`;

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

      if (appointments) {
        const flattenedAppointments = appointments.map(
          ({ patient, ...rest }) => {
            return { ...rest, ...patient };
          }
        );
        res.locals.appointments = flattenedAppointments;
      }

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
      const { id, copay } = req.body;
      log.debug({ id, copay }, 'Updating copay');

      const currentAppointment = await prisma.appointment.findUnique({
        where: {
          id: Number(id),
        },
      });

      if (!currentAppointment) {
        return sendError(res, 'Appointment not found', 404);
      }

      await prisma.appointment.update({
        where: { id: id },
        data: {
          patientCopay: Number(copay),
        },
      });

      next();
    } catch (error) {
      handleControllerError(error, 'updateCopay', next, 'Error updating copay');
    }
  },
};

export default appointmentController;
