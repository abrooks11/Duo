import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const appointmentController = {
  getAppointments: async (req, res, next) => {
    try {
      // get appointments from the database
      const appointments = await prisma.appointment.findMany({
        relationLoadStrategy: 'join', 
        take: 100,
        orderBy: {
          startDate: "desc",
        },
        include: {
            patient: {
              select: {
                patientFullName: true,
                primaryInsurancePolicyNumber: true,
                alertMessage: true, 
                patientBalance: true,
              }
            },
          }
      });
      console.log(appointments);
      
      res.locals.appointments = appointments;
      return next()
    } catch (error) {
      console.error(error);
      return next(error)
    }
  },
};

export default appointmentController;
