// import express
import express from "express";
// create a router
const apiRouter = express.Router();

// import custom routes
import uploadRouter from "./uploadRouter.js";
import appointmentRouter from "./appointmentRouter.js";
import claimRouter from "./claimRouter.js";
import patientRouter from "./patientRouter.js";

// apiRouter.post("/upload/:dataType/:sheetName", userActionsController.uploadFile, (req, res) => {
//   res.status(200).send("File was uploaded successfully");
// });

apiRouter.use("/upload", uploadRouter);

// use custom routes
apiRouter.use("/appointments", appointmentRouter);
apiRouter.use("/claims", claimRouter);
apiRouter.use("/patients", patientRouter);

// apiRouter.use("/claims", (req, res) => {
//   res.send("Serving claims");
// });

// apiRouter.use("/patients", patientRouter, (req, res) => {
//   res.send("Serving patients");
// });

export default apiRouter;
