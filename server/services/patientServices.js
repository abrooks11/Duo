import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const patientServices = {
  createPatient: async (patient) => {
    await prisma.patient.create({
      data: patient,
    });
  },

   updatePatient: async (filePatient, dbPatient) => {
    // convert the dates to Date objects
    const dbModifiedDate = new Date(dbPatient.LastModifiedDate);
    const fileModifiedDate = new Date(filePatient.LastModifiedDate);
    // check if the fileModifiedDate is more recent than the dbModifiedDate
    if (dbModifiedDate < fileModifiedDate) {
  
      console.log("Updating patient: ", dbPatient.id, " with file ID: ", filePatient.ID);
      // filePatient.id = dbPatient.id
      await prisma.patient.update({
  
        where: {
          id: dbPatient.id,
        },
        data: filePatient,
      });
    }
  
    return;
  }, 
  upsertPatients: async(patients) => {
    await prisma.patient.$transaction({
      where: {
        id: filePatient.id,
      },
    });
  }
};

export default patientServices;

