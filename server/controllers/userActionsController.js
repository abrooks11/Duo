// import prisma client to interact with the database
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();


// // define helper function to process excel file; returns an array of objects
// const processExcelFile = async (file, sheetName) => {
//   try {
//     // read the uploaded Excel file
//   const workbook = xlsx.read(file.data, { type: "buffer" });

//   // find the index of the requestedsheet name
//   const targetIndex = workbook.SheetNames.indexOf(sheetName);

//   // read the sheet at the target index
//   let result = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[targetIndex]], {
//     defval: null,     // or null, if you prefer
//     // Use header: 0 to return an array of objects and range: 1 to start from the second row (so that the first row is the header)
//     // header: 0,    // Uses first row as keys for all rows
//     // range: 1      // Starts reading from second row (skips header row)
//   });

//   console.log("RESULT PRE TRANSFORM: ", result[0]);
//   // transform the result to the prisma format
//   result = result.map(row => transformExcelRow(row))
//   console.log("RESULT POST TRANSFORM: ", result[0]);


//   // console.log("File Name: ", file.name);
//   // console.log("Workbook Sheet Names: ", workbook.SheetNames);
//   // console.log("Target Index: ", targetIndex);
//   // console.log("Result: ", result);
//   return result;

//   } catch (error) {
//     console.error("Transform error:", error);
//     throw error;
//   }
  
// };



const userActionsController = {
  uploadFile: async (req, res, next) => {
    // CHECK DB FOR MATCHING APPOINTMENT
    // IF NO MATCHING APPOINTMENT, CREATE A NEW ONE
    // IF MATCHING APPOINTMENT, CHECK IF THE ROW IN THE FILE IS MORE RECENT THAN THE DATABASE RECORD AND UPDATE IF FILE DATE IS MORE RECENT
    try {



  switch (dataType) {
    case "appointment":
      fileData = fileData.filter((row) => row.Type === "Patient");
        fileData.forEach(async (fileAppointment) => {
          const dbAppointment = await prisma.appointment.findUnique({
            where: {
              ID: fileAppointment.ID,
            },
          });

          !dbAppointment
            ? createAppointment(fileAppointment)
            : updateAppointment(fileAppointment, dbAppointment);
        });
      break;
    case "patient":
      fileData.forEach(async (filePatient) => {
        const dbPatient = await prisma.patient.findUnique({
          where: {
            id: filePatient.id,
          },

        });

        !dbPatient
          ? createPatient(filePatient)
          : updatePatient(filePatient, dbPatient);

      });
      break;
    default:
      console.log("Invalid data type");
      break;
  }




        // // disconnect from the database
        // await prisma.$disconnect();
  
      
      next();
    } catch (error) {
      next(error);
    }
  },
};

export default userActionsController;
