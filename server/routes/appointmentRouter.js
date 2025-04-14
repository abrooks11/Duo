import express from "express";
import appointmentController from "../controllers/appointmentController.js";

const appointmentRouter = express.Router();

const {getAppointments} = appointmentController

appointmentRouter.get("/", getAppointments, (req, res) => {
  const appointments = res.locals.appointments
  return res.status(200).json(appointments);
});

export default appointmentRouter;
