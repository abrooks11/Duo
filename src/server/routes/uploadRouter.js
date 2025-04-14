// ! fileUpload in server.js for browser
// ! multer in uploadRouter for postman

// import express
import express from "express";
import multer from "multer";
const upload = multer();

import excelServices from "../services/excelServices.js";
// create a router
const uploadRouter = express.Router();

uploadRouter.post(
  "/:dataType/:sheetName",
  upload.single("file"),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return next({
          log: 'Error in uploadRouter: No file received',
          status: 400,
          message: { err: 'Please upload a file' }
        });
      }
      console.log("UPLOAD ROUTER req.params", req.params);
      const { dataType, sheetName } = req.params;
      // console.log("UPLOAD ROUTER req.file", req.file);
      // const { file } = req.file; // for browser
      await excelServices.readFile(req.file.buffer, dataType, sheetName);
      // console.log('UPLOAD ROUTER result', result);
      return res
        .status(200)
        .json({ message: "File was uploaded successfully" });
    } catch (error) {
      console.error("UPLOAD ROUTER error", error);
      // pass the error to the global error handler
      next({
        status: 501,
        message: { err: "Error uploading file" },
        log: `Error in uploadRouter: ${error}`,
      });
    }
  }
);

export default uploadRouter;
