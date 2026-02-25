import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const appointmentController = {
  getAppointments: async (req, res, next) => {
    try {
      // Get the current date
      const now = new Date();

      // Calculate first day of current month (set to beginning of day)
      const firstDayOfMonth = new Date(
        now.getFullYear(),
        now.getMonth(),
        1,
        0,
        0,
        0
      );

      // Calculate last day of next month (set to end of day)
      const lastDayOfNextMonth = new Date(
        now.getFullYear(),
        now.getMonth() + 2,
        0,
        23,
        59,
        59
      );

      // Get appointments from the database with date filtering
      const appointments = await prisma.appointment.findMany({
        relationLoadStrategy: 'join',
        // take: 100,
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
      console.log('Total appointments', appointments.length);
      // console.log(appointments[0]);

      if (appointments) {
        const flattenedAppointments = appointments.map(
          ({ patient, ...rest }) => {
            return { ...rest, ...patient };
          }
        );
        console.log('Flattened Appointment', flattenedAppointments[0])
        res.locals.appointments = flattenedAppointments;
      }

      return next();
    } catch (error) {
      next({
        status: 500,
        message: { err: 'Error fetching appointments' }, // message to client
        log: `Error in appointmentController: ${error}`, // log to server
      });
    }
  },

  updateNote: async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      const { notes } = req.body;

      const appointment = await prisma.appointment.findUnique({ where: { id } });
      if (!appointment) {
        return res.status(404).json({ err: 'Appointment not found' });
      }

      await prisma.appointment.update({
        where: { id },
        data: { notes: notes ?? null },
      });

      return res.status(200).json({ message: 'Note updated' });
    } catch (error) {
      next({
        status: 500,
        message: { err: 'Error updating appointment note' },
        log: `Error in updateNote: ${error}`,
      });
    }
  },

  updateCopay: async (req, res, next) => {
    // deconstruct appointment id and copay from req.body
    // query db for appointment using appointment id
    // update matching db appointment with copay
    // invoke next
    try {
      const { id, copay } = req.body;
      console.log({ id, copay });

      const currentAppointment = await prisma.appointment.findUnique({
        where: {
          id: Number(id),
        },
      });

      if (!currentAppointment) {
        return res.status(404).json({
          error: 'Appointment not found',
        });
      }

      console.log(currentAppointment);
      if (currentAppointment) {
        await prisma.appointment.update({
          where: { id: id },
          data: {
            patientCopay: Number(copay),
          },
        });
      }

      next();
    } catch (error) {}
  },
};

export default appointmentController;
