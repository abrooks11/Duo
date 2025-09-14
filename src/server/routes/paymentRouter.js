import express from 'express';
import paymentController from '../controllers/paymentController.js';

const paymentRouter = express.Router();

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
  validatePaymentCompleteness
} = paymentController;

/** Fetch all un-matched eobs from database */
paymentRouter.get('/eobs', getEobs, (req, res) => {
 res.status(200).json({ eobs: res.eobs });
});

/** Fetch all un-matched deposits from database */
paymentRouter.get(
  '/deposits',
  getBankDeposits,
  (req, res) => {
   res.status(200).json({ deposits: res.deposits });
  }
);

/** Fetch all matched eobs from database */
paymentRouter.get(
  '/matched',
  getMatchedEobs,
  (req, res) => {
   res.status(200).json({ matchedEobs: res.matchedEobs });
  }
);

/** Run matching algorithm*/
paymentRouter.post(
  '/match',
  matchEobs,
  (req, res) => {
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
  (req, res) => {
    res.status(200).json({ eobs: res.eobs });
  }
);

/** Get credit card EOBs */
paymentRouter.get(
  '/eobs/credit-card',
  getCreditCardEobs,
  (req, res) => {
    res.status(200).json({ eobs: res.eobs });
  }
);

/** Get EOBs by payment method */
paymentRouter.get(
  '/eobs/method/:paymentMethod',
  getEobsByPaymentMethod,
  (req, res) => {
    res.status(200).json({ eobs: res.eobs });
  }
);

/** Get payment completeness validation */
paymentRouter.get(
  '/validation/completeness',
  validatePaymentCompleteness,
  (req, res) => {
    res.status(200).json({ validation: res.locals.validationResults });
  }
);

/** Clear specific tables with safety checks */
paymentRouter.post(
  '/clear',
  clearTables,
  (req, res) => {
    res.status(200).json({
      message: 'Tables cleared successfully',
      results: res.locals.clearResults
    });
  }
);

/** Legacy delete endpoint */
paymentRouter.delete('/', deleteAll, (req, res) => {
  res.status(200).json({
    message: 'Records deleted successfully',
    results: res.locals.clearResults
  });
});

export default paymentRouter;