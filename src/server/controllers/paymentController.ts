import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import type {
  Eob,
  Deposit,
  PaymentResponse,
} from '../../shared/types/payment.types';

const prisma = new PrismaClient();



interface PaymentController {
  getEobs: (
    req: Request,
    res: PaymentResponse,
    next: NextFunction
  ) => Promise<void>;

  getBankDeposits: (
    req: Request,
    res: PaymentResponse,
    next: NextFunction
  ) => Promise<void>;

  getMatchedEobs: (
    req: Request,
    res: PaymentResponse,
    next: NextFunction
  ) => Promise<void>;

  matchEobs: (
    req: Request,
    res: PaymentResponse,
    next: NextFunction
  ) => Promise<void>;

  deleteAll: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}

const paymentController: PaymentController = {
  getEobs: async (req, res, next) => {
    try {
      // fetch data from database and store in res
      // invoke next
      const eobs: Eob[] = await prisma.eob.findMany({
        where: { depositId: null },
      });

      res.eobs = eobs;

      return next();
    } catch (error) {
      console.error('Error in getEobs:', error);
      return next({
        status: 500,
        message: { err: 'Failed to fetch unmatched EOBs' },
        log: `PaymentController.getEobs: ${error}`,
      });
    }
  },

  getBankDeposits: async (req, res, next) => {
    try {
      const deposits: Deposit[] = await prisma.deposit.findMany({
        where: {
          eob: null,
        },
      });

      res.deposits = deposits;

      return next();
    } catch (error) {
      console.error('Error in getBankDeposits:', error);
      return next({
        status: 500,
        message: { err: 'Failed to fetch unmatched bank deposits' },
        log: `PaymentController.getBankDeposits: ${error}`,
      });
    }
  },

  getMatchedEobs: async (req, res, next) => {
    try {
      const matchedEobs: Eob[] = await prisma.eob.findMany({
        where: {
          depositId: { not: null },
        },
      });

      res.matchedEobs = matchedEobs;
      return next();
    } catch (error) {
      console.error('Error in getMatchedEobs:', error);
      return next({
        status: 500,
        message: { err: 'Failed to fetch matched  EOBs' },
        log: `PaymentController.getMatchedEobs: ${error}`,
      });
    }
  },

  matchEobs: async (req, res, next) => {
    try {
      const result = await prisma.$transaction(async (tx) => {
        const unmatchedEobs = await tx.eob.findMany({
          where: {
            depositId: null,
          },
        });

        const matches = [];

        for (const eob of unmatchedEobs) {
          if (eob.reference) {
            const deposit = await tx.deposit.findUnique({
              where: {
                id: eob.reference,
              },
            });

            if (deposit) {
              matches.push({ eobId: eob.id, depositId: deposit.id });
            }
          }
        }

        // Batch update all matches
        await Promise.all(
          matches.map((match) =>
            tx.eob.update({
              where: { id: match.eobId },
              data: { depositId: match.depositId },
            })
          )
        );
        return { total: unmatchedEobs.length, matched: matches.length };
      });
      console.log(
        `Matching complete: ${result.matched}/${result.total} matched`
      );

      return next();
    } catch (error) {
      console.error('Error in matchEobs:', error);
      return next({
        status: 500,
        message: { err: 'Failed to match EOBs' },
        log: `PaymentController.matchEobs: ${error}`,
      });
    }
  },

  deleteAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      return next();
    } catch (error) {
      console.error('Error in deleteAll:', error);
      return next({
        status: 500,
        message: { err: 'Failed to delete Eob/Deposit records' },
        log: `PaymentController.deleteAll: ${error}`,
      });
    }
  },
};

export default paymentController;
