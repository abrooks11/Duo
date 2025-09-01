import express, {Router, Request} from 'express';
import type { PaymentResponse } from '../../shared/types/payment.types';

import paymentController from '../controllers/paymentController';

const paymentRouter: Router = express.Router();

const { getEobs, getBankDeposits, getMatchedEobs, matchEobs, deleteAll } =
  paymentController;

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
   res.status(200).json({ message: 'Records matched' });
  }
);

paymentRouter.delete('/', deleteAll, (req: Request, res: PaymentResponse): void => {
  // TODO: need better delete logic
 res.status(200).json({ message: 'Records deleted' });
});

export default paymentRouter;
