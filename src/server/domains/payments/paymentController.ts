import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import type { Eob, Deposit } from './paymentTypes.ts';
import { AppError, handleControllerError } from '../../shared/errorHandlers.js';
import { createChildLogger } from '../../shared/logger.js';

const prisma = new PrismaClient();
const log = createChildLogger('payments');

const paymentController = {
  getEobs: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const eobs: Eob[] = await prisma.eob.findMany({
        where: {
          depositId: null,
          NOT: {
            AND: [
              {
                OR: [
                  { paymentMethod: "3" },
                  { paymentMethod: "3 - Credit Card" },
                  { paymentMethod: { startsWith: "3" } }
                ]
              },
              { isProcessed: true }
            ]
          }
        },
      });

      res.locals.eobs = eobs;
      return next();
    } catch (error) {
      handleControllerError(error, 'getEobs', next, 'Failed to fetch unmatched EOBs');
    }
  },

  getBankDeposits: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const deposits: Deposit[] = await prisma.deposit.findMany({
        where: {
          eob: null,
        },
      });

      res.locals.deposits = deposits;
      return next();
    } catch (error) {
      handleControllerError(error, 'getBankDeposits', next, 'Failed to fetch unmatched bank deposits');
    }
  },

  getMatchedEobs: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const matchedEobs: Eob[] = await prisma.eob.findMany({
        where: {
          OR: [
            { depositId: { not: null } },
            {
              AND: [
                {
                  OR: [
                    { paymentMethod: "3" },
                    { paymentMethod: "3 - Credit Card" },
                    { paymentMethod: { startsWith: "3" } }
                  ]
                },
                { isProcessed: true }
              ]
            }
          ]
        },
      });

      res.locals.matchedEobs = matchedEobs;
      return next();
    } catch (error) {
      handleControllerError(error, 'getMatchedEobs', next, 'Failed to fetch matched EOBs');
    }
  },

  matchEobs: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await prisma.$transaction(async (tx) => {
        const unmatchedEobs = await tx.eob.findMany({
          where: {
            depositId: null,
            OR: [
              { paymentMethod: '4' },
              { paymentMethod: { startsWith: '4' } },
              { paymentMethod: { contains: 'Electronic' } },
              { paymentMethod: { contains: 'Transfer' } },
              { paymentMethod: { contains: 'EFT' } }
            ]
          },
        });

        const matches = [];
        const warnings = [];

        for (const eob of unmatchedEobs) {
          if (eob.reference) {
            const deposit = await tx.deposit.findUnique({
              where: {
                reference: eob.reference,
              },
            });

            if (deposit) {
              if (Math.abs(deposit.amount - eob.amount) < 0.01) {
                matches.push({ eobId: eob.id, depositId: deposit.id });
              } else {
                warnings.push(`Amount mismatch: EOB ${eob.id} ($${eob.amount}) vs Deposit ${deposit.id} ($${deposit.amount})`);
              }
            }
          }
        }

        await Promise.all(
          matches.map(async (match) => {
            await tx.eob.update({
              where: { id: match.eobId },
              data: {
                depositId: match.depositId,
                isMatched: true,
              },
            });
          })
        );

        return {
          total: unmatchedEobs.length,
          matched: matches.length,
          warnings
        };
      });

      log.info(`Matching complete: ${result.matched}/${result.total} matched`);
      if (result.warnings.length > 0) {
        log.warn({ warnings: result.warnings }, 'Matching warnings');
      }

      res.locals.matchResult = result;
      return next();
    } catch (error) {
      handleControllerError(error, 'matchEobs', next, 'Failed to match EOBs');
    }
  },

  getEobsNeedingDeposits: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const eobs = await prisma.eob.findMany({
        where: {
          paymentMethod: "4",
          depositId: null,
        },
      });
      res.locals.eobs = eobs;
      return next();
    } catch (error) {
      handleControllerError(error, 'getEobsNeedingDeposits', next, 'Failed to fetch EOBs needing deposits');
    }
  },

  getCreditCardEobs: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const eobs = await prisma.eob.findMany({
        where: {
          paymentMethod: "3",
        },
      });
      res.locals.eobs = eobs;
      return next();
    } catch (error) {
      handleControllerError(error, 'getCreditCardEobs', next, 'Failed to fetch credit card EOBs');
    }
  },

  getEobsByPaymentMethod: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { paymentMethod } = req.params;

      if (!['1', '3', '4'].includes(paymentMethod)) {
        return next(new AppError('Invalid payment method. Must be 1, 3, or 4', 400, `Invalid payment method ${paymentMethod}`));
      }

      const eobs = await prisma.eob.findMany({
        where: {
          paymentMethod: paymentMethod,
          depositId: null,
        },
      });

      res.locals.eobs = eobs;
      return next();
    } catch (error) {
      handleControllerError(error, 'getEobsByPaymentMethod', next, 'Failed to fetch EOBs by payment method');
    }
  },

  validatePaymentCompleteness: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const results = {
        eftEobsWithoutDeposits: 0,
        creditCardEobsCount: 0,
        checkEobsCount: 0,
        totalUnmatchedEobs: 0,
        matchedEobsCount: 0,
      };

      results.eftEobsWithoutDeposits = await prisma.eob.count({
        where: {
          paymentMethod: "4",
          depositId: null,
        },
      });

      results.creditCardEobsCount = await prisma.eob.count({
        where: { paymentMethod: "3" },
      });

      results.checkEobsCount = await prisma.eob.count({
        where: { paymentMethod: "1" },
      });

      results.totalUnmatchedEobs = await prisma.eob.count({
        where: { depositId: null },
      });

      results.matchedEobsCount = await prisma.eob.count({
        where: { depositId: { not: null } },
      });

      res.locals.validationResults = results;
      return next();
    } catch (error) {
      handleControllerError(error, 'validatePaymentCompleteness', next, 'Failed to validate payment completeness');
    }
  },

  clearTables: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { tables, confirmCode } = req.body;

      if (confirmCode !== 'CLEAR_TABLES_CONFIRMED') {
        return next(new AppError('Invalid confirmation code. Use "CLEAR_TABLES_CONFIRMED" to proceed.', 400, 'Invalid confirmation code'));
      }

      const validTables = ['eob', 'deposit', 'payment'];
      const tablesToClear = tables || ['eob', 'deposit'];

      const invalidTables = tablesToClear.filter((table: string) => !validTables.includes(table));
      if (invalidTables.length > 0) {
        return next(new AppError(`Invalid tables: ${invalidTables.join(', ')}. Valid options: ${validTables.join(', ')}`, 400, 'Invalid tables specified'));
      }

      const results: any = {};

      if (tablesToClear.includes('eob')) {
        const deletedEobs = await prisma.eob.deleteMany({});
        results.eobsDeleted = deletedEobs.count;
        log.info(`Deleted ${deletedEobs.count} EOB records`);
      }

      if (tablesToClear.includes('deposit')) {
        const deletedDeposits = await prisma.deposit.deleteMany({});
        results.depositsDeleted = deletedDeposits.count;
        log.info(`Deleted ${deletedDeposits.count} Deposit records`);
      }

      if (tablesToClear.includes('payment')) {
        try {
          const deletedPayments = await prisma.payment.deleteMany({});
          results.paymentsDeleted = deletedPayments.count;
          log.info(`Deleted ${deletedPayments.count} Payment records`);
        } catch (error) {
          log.debug('Payment table not found in schema, skipping...');
          results.paymentsDeleted = 'N/A - Table not in schema';
        }
      }

      res.locals.clearResults = results;
      return next();
    } catch (error) {
      handleControllerError(error, 'clearTables', next, 'Failed to clear tables');
    }
  },

  debugEobPaymentMethods: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const paymentMethodCounts = await prisma.$queryRaw`
        SELECT
          "paymentMethod",
          COUNT(*) as count
        FROM "Eob"
        GROUP BY "paymentMethod"
        ORDER BY count DESC
      `;

      const sampleEobs = await prisma.eob.findMany({
        take: 5,
        select: {
          id: true,
          paymentMethod: true,
          payerName: true,
          amount: true
        }
      });

      res.locals.debugResults = {
        paymentMethodCounts,
        sampleEobs,
        totalEobs: await prisma.eob.count()
      };
      return next();
    } catch (error) {
      handleControllerError(error, 'debugEobPaymentMethods', next, 'Failed to debug EOB payment methods');
    }
  },

  fixEobPaymentMethods: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { defaultMethod = "4", confirmCode } = req.body;

      if (confirmCode !== 'FIX_PAYMENT_METHODS_CONFIRMED') {
        return next(new AppError('Invalid confirmation code. Use "FIX_PAYMENT_METHODS_CONFIRMED" to proceed.', 400, 'Invalid confirmation code'));
      }

      const problematicEobs = await prisma.eob.findMany({
        where: {
          OR: [
            { paymentMethod: null },
            { paymentMethod: "" },
            { paymentMethod: undefined },
            { NOT: { paymentMethod: { in: ["1", "3", "4"] } } }
          ]
        }
      });

      log.info(`Found ${problematicEobs.length} EOBs with invalid payment methods`);

      const updateResult = await prisma.eob.updateMany({
        where: {
          OR: [
            { paymentMethod: null },
            { paymentMethod: "" },
            { paymentMethod: undefined },
            { NOT: { paymentMethod: { in: ["1", "3", "4"] } } }
          ]
        },
        data: {
          paymentMethod: defaultMethod
        }
      });

      res.locals.fixResults = {
        problematicEobsFound: problematicEobs.length,
        eobsUpdated: updateResult.count,
        defaultMethodUsed: defaultMethod
      };

      return next();
    } catch (error) {
      handleControllerError(error, 'fixEobPaymentMethods', next, 'Failed to fix EOB payment methods');
    }
  },

  toggleEobProcessed: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { eobId } = req.params;
      const { isProcessed } = req.body;

      if (!eobId) {
        return next(new AppError('EOB ID is required', 400, 'Missing EOB ID'));
      }

      const existingEob = await prisma.eob.findUnique({
        where: { id: parseInt(eobId) }
      });

      if (!existingEob) {
        return next(new AppError('EOB not found', 404, `EOB ${eobId} not found`));
      }

      const newProcessedStatus = isProcessed !== undefined ? isProcessed : !existingEob.isProcessed;

      const updatedEob = await prisma.eob.update({
        where: { id: parseInt(eobId) },
        data: { isProcessed: newProcessedStatus }
      });

      res.locals.toggleResult = {
        eobId: updatedEob.id,
        previousStatus: existingEob.isProcessed,
        newStatus: updatedEob.isProcessed,
        paymentMethod: updatedEob.paymentMethod,
        amount: updatedEob.amount
      };

      return next();
    } catch (error) {
      handleControllerError(error, 'toggleEobProcessed', next, 'Failed to toggle EOB processed status');
    }
  },

  bulkToggleProcessed: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { eobIds, isProcessed } = req.body;

      if (!eobIds || !Array.isArray(eobIds)) {
        return next(new AppError('EOB IDs array is required', 400, 'Invalid eobIds'));
      }

      const updateResult = await prisma.eob.updateMany({
        where: {
          id: { in: eobIds.map((id: string) => parseInt(id)) }
        },
        data: { isProcessed }
      });

      res.locals.bulkToggleResult = {
        eobIds,
        updatedCount: updateResult.count,
        newStatus: isProcessed
      };

      return next();
    } catch (error) {
      handleControllerError(error, 'bulkToggleProcessed', next, 'Failed to bulk toggle EOB processed status');
    }
  },

  deleteAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = {
        tables: ['eob', 'deposit'],
        confirmCode: 'CLEAR_TABLES_CONFIRMED'
      };
      return paymentController.clearTables(req, res, next);
    } catch (error) {
      handleControllerError(error, 'deleteAll', next, 'Failed to delete Eob/Deposit records');
    }
  },
};

export default paymentController;
