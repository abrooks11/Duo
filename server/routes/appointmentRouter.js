import express from "express";
const appointmentRouter = express.Router();

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

appointmentRouter.get("/", async (req, res) => {
  // get appointments from the database
  const appointments = await prisma.appointment.findMany({
    take: 100,
    orderBy: {
      startDate: 'desc'
    }
  });
  return res.status(200).json(appointments);
});

export default appointmentRouter;
