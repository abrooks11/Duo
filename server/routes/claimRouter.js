import express from "express";
const claimRouter = express.Router();

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

claimRouter.get("/", async (req, res) => {
  // get appointments from the database
  const claims = {}
//   const claims = await prisma.claim.findMany({
//     take: 100,
//     orderBy: {
//       startDate: 'desc'
//     }
//   });
  return res.status(200).json(claims);
});

export default claimRouter;
