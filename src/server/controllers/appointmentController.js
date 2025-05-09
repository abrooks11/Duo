import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const appointmentController = {
  getAppointments: async (req, res, next) => {
    try {
 // Get the current date
 const now = new Date();
      
 // Calculate first day of current month (set to beginning of day)
 const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
 
 // Calculate last day of current month (set to end of day)
 const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
 
 // Get appointments from the database with date filtering
      const appointments = await prisma.appointment.findMany({
        relationLoadStrategy: 'join',
        // take: 100,
        where: {
          startDate: {
            gte: firstDayOfMonth,
            lte: lastDayOfMonth,
          },
        },
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
