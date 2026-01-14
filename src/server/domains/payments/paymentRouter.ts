import express, {Router, Request} from 'express';
import type { PaymentResponse } from './paymentTypes.ts';

import paymentController from './paymentController.ts';

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
paymentRouter.get('/eobs', getEobs, (req: Request, res: PaymentResponse): void => {
 res.status(200).json({ eobs: res.eobs });
});

/** Fetch all un-matched deposits from database */
paymentRouter.get(
  '/deposits',
  getBankDeposits,
  (req: Request, res: PaymentResponse): void => {
   res.status(200).json({ deposits: res.deposits });
  }
);

/** Fetch all matched eobs from database */
paymentRouter.get(
  '/matched',
  getMatchedEobs,
  (req: Request, res: PaymentResponse): void => {
   res.status(200).json({ matchedEobs: res.matchedEobs });
  }
);

/** Run matching algorithm*/
paymentRouter.post(
  '/match',
  matchEobs,
  (req: Request, res: PaymentResponse): void => {
   res.status(200).json({ 
     message: 'Matching complete',
     result: res.locals.matchResult 
   });
  }
);

/** Get EOBs that need deposits (EFT only) */
paymentRouter.get(
  '/eobs/needing-deposits',
  getEobsNeedingDeposits,
  (req: Request, res: PaymentResponse): void => {
    res.status(200).json({ eobs: res.eobs });
  }
);

/** Get credit card EOBs */
paymentRouter.get(
  '/eobs/credit-card',
  getCreditCardEobs,
  (req: Request, res: PaymentResponse): void => {
    res.status(200).json({ eobs: res.eobs });
  }
);

/** Get EOBs by payment method */
paymentRouter.get(
  '/eobs/method/:paymentMethod',
  getEobsByPaymentMethod,
  (req: Request, res: PaymentResponse): void => {
    res.status(200).json({ eobs: res.eobs });
  }
);

/** Get payment completeness validation */
paymentRouter.get(
  '/validation/completeness',
  validatePaymentCompleteness,
  (req: Request, res: PaymentResponse): void => {
    res.status(200).json({ validation: res.locals.validationResults });
  }
);

/** Debug EOB payment methods */
paymentRouter.get(
  '/debug/payment-methods',
  debugEobPaymentMethods,
  (req: Request, res: PaymentResponse): void => {
    res.status(200).json({
      message: 'Payment method debug info retrieved',
      debug: res.locals.debugResults
    });
  }
);

/** Fix EOB payment methods */
paymentRouter.post(
  '/fix/payment-methods',
  fixEobPaymentMethods,
  (req: Request, res: PaymentResponse): void => {
    res.status(200).json({
      message: 'Payment methods fixed successfully',
      results: res.locals.fixResults
    });
  }
);

/** Toggle single EOB processed status */
paymentRouter.patch(
  '/eobs/:eobId/processed',
  toggleEobProcessed,
  (req: Request, res: PaymentResponse): void => {
    res.status(200).json({
      message: 'EOB processed status updated',
      result: res.locals.toggleResult
    });
  }
);

/** Bulk toggle EOB processed status */
paymentRouter.patch(
  '/eobs/bulk/processed',
  bulkToggleProcessed,
  (req: Request, res: PaymentResponse): void => {
    res.status(200).json({
      message: 'EOBs processed status updated',
      result: res.locals.bulkToggleResult
    });
  }
);

/** Clear specific tables with safety checks */
paymentRouter.post(
  '/clear',
  clearTables,
  (req: Request, res: PaymentResponse): void => {
    res.status(200).json({
      message: 'Tables cleared successfully',
      results: res.locals.clearResults
    });
  }
);

/** Legacy delete endpoint */
paymentRouter.delete('/', deleteAll, (req: Request, res: PaymentResponse): void => {
  res.status(200).json({
    message: 'Records deleted successfully',
    results: res.locals.clearResults
  });
});

export default paymentRouter;
