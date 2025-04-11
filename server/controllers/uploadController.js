// CONTROLLER FUNCTION TO HANDLE UPLOADING FILES
import excelServices from "../services/excelServices";




const uploadController = {
  uploadFile: async (req, res, next) => {
    // CHECK REQUEST.FILES FOR UPLOADED FILES THEN PROCESS DATA FOR DATABASE
    try {
      
      
        // console.log("Incoming files: ", req.files);
      //  console.log("params: ", req.params); 
      const { dataType, sheetName } = req.params; // using params because DropZone.body not found
      const file = req.files.file;
      const fileData = await excelServices.readFile(file, sheetName);


      // if no files, send error
      if (!req.files) {
        res.status(400).send({
          success: false,
          message: "There was no file found in request",
          payload: {},
        });
      } else {
        // get the file from the request
        const file = req.files.file;
        const { dataType, sheetName } = req.params;
        // console.log("File: ", file);
        // use helper function to process the request file to get the data
        const fileData = await processExcelFile(file, sheetName);
        // transform the fileData to the prisma format
        // fileData = fileData.map(transformExcelRow);
        // console.log("FILE DATA: ", fileData);
        // iterate over the fileData and create a new appointment or update an existing appointment
      }
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  },
};

export default uploadController;
