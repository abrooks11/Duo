import { PrismaClient, Prisma } from '@prisma/client';
import { createChildLogger } from '../../shared/logger.js';

const prisma = new PrismaClient();
const log = createChildLogger('tebra-services');

const appointmentServices = {
  createAppointment: async (appointment: Record<string, unknown>) => {
    await prisma.appointment.create({
      data: appointment as Prisma.AppointmentCreateInput,
    });
  },

  updateAppointment: async (
    fileAppointment: Record<string, unknown>,
    dbAppointment: Record<string, unknown>
  ) => {
    // convert the dates to Date objects
    const dbModifiedDate = new Date(dbAppointment.LastModifiedDate as string);
    const fileModifiedDate = new Date(fileAppointment.LastModifiedDate as string);
    // check if the fileModifiedDate is more recent than the dbModifiedDate
    if (dbModifiedDate < fileModifiedDate) {
      log.debug(`Updating appointment ${dbAppointment.id} with file ID ${fileAppointment.ID}`);
      await prisma.appointment.update({
        where: {
          id: dbAppointment.id as number,
        },
        data: fileAppointment as Prisma.AppointmentUpdateInput,
      });
    }
    return;
  },
};

export default appointmentServices;
