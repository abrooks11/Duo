// import xlsx to read excel files and parse data
import xlsx from 'xlsx';
import fieldMap from './fieldMap.js';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const excelServices = {
  readFile: async (file, resourceType, sheetName) => {
    try {
      // READ THE UPLOADED EXCEL FILE
      // const workbook = xlsx.read(file.data, { type: "buffer" }); // for browser
      const workbook = xlsx.read(file, { type: 'buffer' }); // for postman

      // FIND THE INDEX OF THE REQUESTED SHEET NAME
      const targetIndex = workbook.SheetNames.indexOf(sheetName);

      // READ THE SHEET AT THE TARGET INDEX AND STORE AS OBJECT[]
      let result = xlsx.utils.sheet_to_json(
        workbook.Sheets[workbook.SheetNames[targetIndex]],
        {
          defval: null, // or null, if you prefer
          // Use header: 0 to return an array of objects and range: 1 to start from the second row (so that the first row is the header)
          // header: 0,    // Uses first row as keys for all rows
          // range: 1      // Starts reading from second row (skips header row)
        }
      );

      // TRANSFORM THE RESULT ARRAY OF OBJECTS TO THE PRISMA FORMAT
      // console.log("RESULT PRE TRANSFORM: ", result[0]);
      result = result.map((row) => transformKeys(row));
      // console.log("RESULT POST TRANSFORM: ", result[0]);

      // USE UPSERT TO UPDATE OR CREATE PATIENT RECORD
      console.log('DATA TYPE', resourceType);
      if (resourceType === 'patient') {
        console.log('UPSERTING PATIENTS. . . ');
        for (const patientObj of result) {
          const { id, ...patientData } = patientObj;
          const upsertPatient = await prisma.patient.upsert({
            where: {
              id: id,
              lastModifiedDate: { lt: patientObj.lastModifiedDate },
            },
            create: patientData,
            update: patientData,
          });
        }
      } else if (resourceType === 'appointment') {
        console.log('UPSERTING APPOINTMENTS. . . ');
        for (const appointmentObj of result) {
          // seperate key fields from rest of appointment data
          const { id, type, patientId, patientFullName, ...appointmentData } =
            appointmentObj;
          // validate row data
          if (
            typeof id === 'number' &&
            type === 'Patient' &&
            appointmentData.appointmentReason !== 'OTHER'
          ) {
            console.log(typeof id);
            console.log(type);
            // check that matching patient exists
            const patient = await prisma.patient.findUnique({
              where: { id: patientId },
            });

            if (!patient) {
              console.log(
                `Skipping appointment - Patient ID ${patientId} not found`
              );
              continue;
            }

            try {
              const upsertAppointment = await prisma.appointment.upsert({
                where: {
                  id: id,
                  lastModifiedDate: { lt: appointmentObj.lastModifiedDate },
                },
                create: { ...appointmentData, patientId: patientId },
                update: { ...appointmentData, patientId: patientId },
              });
            } catch (error) {
              next({
                status: 501,
                message: { err: 'Error updating appointment' },
                log: `Error in excelservices: ${error}`,
              });
            }
          }
        }
      }

      // console.log('EXCEL SERVICES readFile', file);
      // console.log("File Name: ", file.name);
      // console.log('EXCEL SERVICES workbook', workbook);
      // console.log("Workbook Sheet Names: ", workbook.SheetNames);
      // console.log("Target Index: ", targetIndex);
      return;
    } catch (error) {
      next({
        status: 500,
        message: { err: 'Error reading excel file' }, // message to client
        log: `Error in excelServices: ${error}`, // log to server
      });
    }
  },
};

const transformKeys = (row) => {
  try {
    return Object.entries(row).reduce((acc, [key, value]) => {
      const prismaKey = fieldMap[key];
      if (prismaKey) {
        // if key contains 'Date' then convert to date to ISO string? (.toISOString())
        // if key is dob then convert to date to ISO string? (.toISOString())
        if (prismaKey.includes('Date') || prismaKey === 'dob') {
          if (value) {
            // Handle Excel date format
            if (typeof value === 'number') {
              // Convert Excel serial number to JavaScript date
              const excelDate = new Date((value - 25569) * 86400 * 1000);
              acc[prismaKey] = excelDate.toISOString();
            } else {
              // Handle string date format
              acc[prismaKey] = new Date(value).toISOString();
            }
          }
          // } else if (prismaKey === "dob") {
          //   // Handle various string date formats
          //   console.log({value})
          //   const [month, day, year] = value.split("/");
          //   if (month && day && year) {
          //     // Handle M/D/YYYY format
          //     const date = new Date(year, month - 1, day);
          //     acc[prismaKey] = date.toISOString();
          //   } else {
          //     // Fallback for other string formats
          //     acc[prismaKey] = new Date(value).toISOString();
          //   }
        } else if (prismaKey.includes('PolicyNumber')) {
          acc[prismaKey] = value ? String(value) : null;
        } else if (
          ['insuranceBalance', 'patientBalance', 'totalBalance'].includes(
            prismaKey
          )
        ) {
          acc[prismaKey] = value ? parseFloat(value) : null;
        } else if (prismaKey.includes('ZipCode')) {
          acc[prismaKey] =
            value && typeof value === 'string' ? value.slice(0, 5) : null;
        } else {
          acc[prismaKey] = value;
        }
      }
      return acc;
    }, {});
  } catch (error) {
    next({
      status: 500,
      message: { err: 'Error transforming keys' },
      log: `Error in excelServices: ${error}`, // log to server
    });
  }
};

export default excelServices;
