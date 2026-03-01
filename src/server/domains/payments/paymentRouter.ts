import express, { Router, Request, Response } from 'express';
import paymentController from './paymentController.ts';
import { sendSuccess } from '../../shared/errorHandlers.js';

const paymentRouter: Router = express.Router();

const {
  getEobs,
  getBankDeposits,
  getMatchedEobs,
  matchEobs,
  deleteAll,
  clearTables,
  getEobsNeedingDeposits,
  getCreditCardEobs,
  getEobsByPaymentMethod,
  validatePaymentCompleteness,
  debugEobPaymentMethods,
  fixEobPaymentMethods,
  toggleEobProcessed,
  bulkToggleProcessed
} = paymentController;

/** Fetch all un-matched eobs from database */
paymentRouter.get('/eobs', getEobs, (req: Request, res: Response): void => {
  sendSuccess(res, res.locals.eobs);
});

/** Fetch all un-matched deposits from database */
paymentRouter.get('/deposits', getBankDeposits, (req: Request, res: Response): void => {
  sendSuccess(res, res.locals.deposits);
});

/** Fetch all matched eobs from database */
paymentRouter.get('/matched', getMatchedEobs, (req: Request, res: Response): void => {
  sendSuccess(res, res.locals.matchedEobs);
});

/** Run matching algorithm */
paymentRouter.post('/match', matchEobs, (req: Request, res: Response): void => {
  sendSuccess(res, res.locals.matchResult, 'Matching complete');
});

/** Get EOBs that need deposits (EFT only) */
paymentRouter.get('/eobs/needing-deposits', getEobsNeedingDeposits, (req: Request, res: Response): void => {
  sendSuccess(res, res.locals.eobs);
});

/** Get credit card EOBs */
paymentRouter.get('/eobs/credit-card', getCreditCardEobs, (req: Request, res: Response): void => {
  sendSuccess(res, res.locals.eobs);
});

/** Get EOBs by payment method */
paymentRouter.get('/eobs/method/:paymentMethod', getEobsByPaymentMethod, (req: Request, res: Response): void => {
  sendSuccess(res, res.locals.eobs);
});

/** Get payment completeness validation */
paymentRouter.get('/validation/completeness', validatePaymentCompleteness, (req: Request, res: Response): void => {
  sendSuccess(res, res.locals.validationResults);
});

/** Debug EOB payment methods */
paymentRouter.get('/debug/payment-methods', debugEobPaymentMethods, (req: Request, res: Response): void => {
  sendSuccess(res, res.locals.debugResults, 'Payment method debug info retrieved');
});

/** Fix EOB payment methods */
paymentRouter.post('/fix/payment-methods', fixEobPaymentMethods, (req: Request, res: Response): void => {
  sendSuccess(res, res.locals.fixResults, 'Payment methods fixed successfully');
});

/** Toggle single EOB processed status */
paymentRouter.patch('/eobs/:eobId/processed', toggleEobProcessed, (req: Request, res: Response): void => {
  sendSuccess(res, res.locals.toggleResult, 'EOB processed status updated');
});

/** Bulk toggle EOB processed status */
paymentRouter.patch('/eobs/bulk/processed', bulkToggleProcessed, (req: Request, res: Response): void => {
  sendSuccess(res, res.locals.bulkToggleResult, 'EOBs processed status updated');
});

/** Clear specific tables with safety checks */
paymentRouter.post('/clear', clearTables, (req: Request, res: Response): void => {
  sendSuccess(res, res.locals.clearResults, 'Tables cleared successfully');
});

/** Legacy delete endpoint */
paymentRouter.delete('/', deleteAll, (req: Request, res: Response): void => {
  sendSuccess(res, res.locals.clearResults, 'Records deleted successfully');
});

export default paymentRouter;
