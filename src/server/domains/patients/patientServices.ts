import prisma, { Prisma } from '../../prisma.js';

const patientServices = {
  createPatient: async (patient: Prisma.PatientCreateInput) => {
    await prisma.patient.create({
      data: patient,
    });
  },

  updatePatient: async (
    filePatient: Record<string, unknown>,
    dbPatient: Record<string, unknown>
  ) => {
    // convert the dates to Date objects
    const dbModifiedDate = new Date(dbPatient.LastModifiedDate as string);
    const fileModifiedDate = new Date(filePatient.LastModifiedDate as string);
    // check if the fileModifiedDate is more recent than the dbModifiedDate
    if (dbModifiedDate < fileModifiedDate) {
      console.log(
        'Updating patient: ',
        dbPatient.id,
        ' with file ID: ',
        filePatient.ID
      );
      await prisma.patient.update({
        where: {
          id: dbPatient.id as number,
        },
        data: filePatient as Prisma.PatientUpdateInput,
      });
    }

    return;
  },

  upsertPatients: async (_patients: Record<string, unknown>[]) => {
    // No-op stub — upsert logic is handled directly in uploadRouter
    return;
  },
};

export default patientServices;
