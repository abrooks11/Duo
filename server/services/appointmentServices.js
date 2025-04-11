// import prisma client
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const appointmentServices = {
  createAppointment: async (appointment) => {
    await prisma.appointment.create({
      data: appointment,
    });
  },

updateAppointment : async (fileAppointment, dbAppointment) => {
    // convert the dates to Date objects
    const dbModifiedDate = new Date(dbAppointment.LastModifiedDate);
    const fileModifiedDate = new Date(fileAppointment.LastModifiedDate);
    // check if the fileModifiedDate is more recent than the dbModifiedDate
    if (dbModifiedDate < fileModifiedDate) {
      console.log("Updating appointment: ", dbAppointment.id, " with file ID: ", fileAppointment.ID);
      // fileAppointment.id = dbAppointment.id
      await prisma.appointment.update({
        where: {
          id: dbAppointment.id,
        },
        data: fileAppointment,
      });
    }
    return;
  }

};

export default appointmentServices;
