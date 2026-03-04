import express, { Router, Request, Response } from 'express';
import paymentController from './paymentController.ts';
import { sendSuccess } from '../../shared/errorHandlers.js';

const paymentRouter: Router = express.Router();

const { getReconciliation, matchEobs, confirmDeposit, clearTables } = paymentController;

/** Reconciliation dashboard data: auto-syncs EOBs from Tebra, then returns matched/missingEob/pendingPayment rows + stats */
paymentRouter.get('/reconciliation', getReconciliation, (req: Request, res: Response): void => {
  sendSuccess(res, res.locals.reconciliation);
});

/** Run matching algorithm: match EOBs to deposits by reference */
paymentRouter.post('/match', matchEobs, (req: Request, res: Response): void => {
  sendSuccess(res, res.locals.matchResult, 'Matching complete');
});

/** Manually confirm a Check or CC EOB as deposited/processed */
paymentRouter.post('/confirm', confirmDeposit, (req: Request, res: Response): void => {
  sendSuccess(res, res.locals.confirmResult, 'Deposit confirmed');
});

/** Clear EOB/Deposit tables with safety confirmation code */
paymentRouter.post('/clear', clearTables, (req: Request, res: Response): void => {
  sendSuccess(res, res.locals.clearResults, 'Tables cleared successfully');
});

export default paymentRouter;
