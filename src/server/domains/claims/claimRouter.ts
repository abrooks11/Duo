import express from 'express';
import { sendSuccess, asyncHandler } from '../../shared/errorHandlers.js';

const claimRouter = express.Router();

claimRouter.get('/', asyncHandler(async (_req, res) => {
  const claims = {};
  //   const claims = await prisma.claim.findMany({
  //     take: 100,
  //     orderBy: {
  //       startDate: 'desc'
  //     }
  //   });
  return sendSuccess(res, claims);
}));

export default claimRouter;
