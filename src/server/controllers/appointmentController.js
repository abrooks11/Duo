import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const appointmentController = {
  getAppointments: async (req, res, next) => {
    try {
      // get appointments from the database
      const appointments = await prisma.appointment.findMany({
        relationLoadStrategy: 'join',
        take: 100,
        orderBy: {
          startDate: 'desc',
        },
        include: {
          patient: {
            select: {
              patientFullName: true,
              primaryInsurancePolicyNumber: true,
              alertMessage: true,
              patientBalance: true,
            },
          },
        },
      });

      res.locals.appointments = appointments;
      return next();
    } catch (error) {
      next({
        status: 500,
        message: { err: 'Error fetching appointments' }, // message to client
        log: `Error in appointmentController: ${error}`, // log to server
      });
    }
  },
};

export default appointmentController;
