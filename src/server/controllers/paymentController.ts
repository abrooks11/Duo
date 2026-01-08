import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import type {
  Eob,
  Deposit,
  PaymentResponse,
} from '../types/payment.types';

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
      // Exclude processed credit card EOBs from unmatched EOBs
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
      // Include EOBs that are either matched with deposits OR are processed credit card payments
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
        // Only match EOBs with payment method "4" (EFT)

        const unmatchedEobs = await tx.eob.findMany({
          where: {
            depositId: null,
            // Handle both simple codes and descriptive payment methods
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
              // Validate amount match (within 1 cent tolerance)
              if (Math.abs(deposit.amount - eob.amount) < 0.01) {
                matches.push({ eobId: eob.id, depositId: deposit.id });
              } else {
                warnings.push(`Amount mismatch: EOB ${eob.id} ($${eob.amount}) vs Deposit ${deposit.id} ($${deposit.amount})`);
              }
            }
          }
        }

        // Batch update all matches
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

      console.log(`Matching complete: ${result.matched}/${result.total} matched`);
      if (result.warnings.length > 0) {
        console.warn('Matching warnings:', result.warnings);
      }

      res.locals.matchResult = result;
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

  // Get EOBs that need deposits (payment method 4)
  getEobsNeedingDeposits: async (req, res, next) => {
    try {
      const eobs = await prisma.eob.findMany({
        where: {
          paymentMethod: "4",
          depositId: null,
        },
      });
      res.eobs = eobs;
      return next();
    } catch (error) {
      return next({
        status: 500,
        message: { err: 'Failed to fetch EOBs needing deposits' },
        log: `PaymentController.getEobsNeedingDeposits: ${error}`,
      });
    }
  },

  // Get credit card EOBs (should not have deposits)
  getCreditCardEobs: async (req, res, next) => {
    try {
      const eobs = await prisma.eob.findMany({
        where: {
          paymentMethod: "3",
        },
      });
      res.eobs = eobs;
      return next();
    } catch (error) {
      return next({
        status: 500,
        message: { err: 'Failed to fetch credit card EOBs' },
        log: `PaymentController.getCreditCardEobs: ${error}`,
      });
    }
  },

  // Get EOBs by specific payment method
  getEobsByPaymentMethod: async (req, res, next) => {
    try {
      const { paymentMethod } = req.params;
      
      // Validate payment method
      if (!['1', '3', '4'].includes(paymentMethod)) {
        return next({
          status: 400,
          message: { err: 'Invalid payment method. Must be 1, 3, or 4' },
          log: `PaymentController.getEobsByPaymentMethod: Invalid payment method ${paymentMethod}`,
        });
      }

      const eobs = await prisma.eob.findMany({
        where: {
          paymentMethod: paymentMethod,
          depositId: null, // Only unmatched EOBs
        },
      });
      
      res.eobs = eobs;
      return next();
    } catch (error) {
      return next({
        status: 500,
        message: { err: 'Failed to fetch EOBs by payment method' },
        log: `PaymentController.getEobsByPaymentMethod: ${error}`,
      });
    }
  },

  // Phase 2: Monitor for missing payments
  validatePaymentCompleteness: async (req, res, next) => {
    try {
      const results = {
        eftEobsWithoutDeposits: 0,
        creditCardEobsCount: 0,
        checkEobsCount: 0,
        totalUnmatchedEobs: 0,
        matchedEobsCount: 0,
      };

      // Count EFT EOBs without deposits
      results.eftEobsWithoutDeposits = await prisma.eob.count({
        where: {
          paymentMethod: "4",
          depositId: null,
        },
      });

      // Count credit card EOBs (informational)
      results.creditCardEobsCount = await prisma.eob.count({
        where: { paymentMethod: "3" },
      });

      // Count check EOBs (informational)
      results.checkEobsCount = await prisma.eob.count({
        where: { paymentMethod: "1" },
      });

      // Total unmatched EOBs
      results.totalUnmatchedEobs = await prisma.eob.count({
        where: { depositId: null },
      });

      // Matched EOBs count
      results.matchedEobsCount = await prisma.eob.count({
        where: { depositId: { not: null } },
      });

      res.locals.validationResults = results;
      return next();
    } catch (error) {
      return next({
        status: 500,
        message: { err: 'Failed to validate payment completeness' },
        log: `PaymentController.validatePaymentCompleteness: ${error}`,
      });
    }
  },

  clearTables: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { tables, confirmCode } = req.body;
      
      // Safety check - require confirmation code
      if (confirmCode !== 'CLEAR_TABLES_CONFIRMED') {
        return next({
          status: 400,
          message: { err: 'Invalid confirmation code. Use "CLEAR_TABLES_CONFIRMED" to proceed.' },
          log: `PaymentController.clearTables: Invalid confirmation code`,
        });
      }

      // Validate tables parameter
      const validTables = ['eob', 'deposit', 'payment'];
      const tablesToClear = tables || ['eob', 'deposit'];
      
      const invalidTables = tablesToClear.filter((table: string) => !validTables.includes(table));
      if (invalidTables.length > 0) {
        return next({
          status: 400,
          message: { err: `Invalid tables: ${invalidTables.join(', ')}. Valid options: ${validTables.join(', ')}` },
          log: `PaymentController.clearTables: Invalid tables specified`,
        });
      }

      const results: any = {};

      // Clear tables in correct order (respect foreign key constraints)
      if (tablesToClear.includes('eob')) {
        const deletedEobs = await prisma.eob.deleteMany({});
        results.eobsDeleted = deletedEobs.count;
        console.log(`Deleted ${deletedEobs.count} EOB records`);
      }

      if (tablesToClear.includes('deposit')) {
        const deletedDeposits = await prisma.deposit.deleteMany({});
        results.depositsDeleted = deletedDeposits.count;
        console.log(`Deleted ${deletedDeposits.count} Deposit records`);
      }

      if (tablesToClear.includes('payment')) {
        // Check if Payment model exists in current schema
        try {
          const deletedPayments = await prisma.payment.deleteMany({});
          results.paymentsDeleted = deletedPayments.count;
          console.log(`Deleted ${deletedPayments.count} Payment records`);
        } catch (error) {
          console.log('Payment table not found in schema, skipping...');
          results.paymentsDeleted = 'N/A - Table not in schema';
        }
      }

      res.locals.clearResults = results;
      return next();
    } catch (error) {
      console.error('Error in clearTables:', error);
      return next({
        status: 500,
        message: { err: 'Failed to clear tables' },
        log: `PaymentController.clearTables: ${error}`,
      });
    }
  },

  // Debug endpoint to check EOB payment methods
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
      return next({
        status: 500,
        message: { err: 'Failed to debug EOB payment methods' },
        log: `PaymentController.debugEobPaymentMethods: ${error}`,
      });
    }
  },

  // Fix EOB payment methods - set default based on business rules
  fixEobPaymentMethods: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { defaultMethod = "4", confirmCode } = req.body;
      
      if (confirmCode !== 'FIX_PAYMENT_METHODS_CONFIRMED') {
        return next({
          status: 400,
          message: { err: 'Invalid confirmation code. Use "FIX_PAYMENT_METHODS_CONFIRMED" to proceed.' },
          log: `PaymentController.fixEobPaymentMethods: Invalid confirmation code`,
        });
      }

      // Find EOBs with null/undefined/invalid payment methods
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

      console.log(`Found ${problematicEobs.length} EOBs with invalid payment methods`);

      // Update them to default method (usually "4" for EFT)
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
      return next({
        status: 500,
        message: { err: 'Failed to fix EOB payment methods' },
        log: `PaymentController.fixEobPaymentMethods: ${error}`,
      });
    }
  },

  // Toggle EOB processed status (for credit cards)
  toggleEobProcessed: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { eobId } = req.params;
      const { isProcessed } = req.body;

      if (!eobId) {
        return next({
          status: 400,
          message: { err: 'EOB ID is required' },
          log: `PaymentController.toggleEobProcessed: Missing EOB ID`,
        });
      }

      // Find the EOB first
      const existingEob = await prisma.eob.findUnique({
        where: { id: parseInt(eobId) }
      });

      if (!existingEob) {
        return next({
          status: 404,
          message: { err: 'EOB not found' },
          log: `PaymentController.toggleEobProcessed: EOB ${eobId} not found`,
        });
      }

      // Toggle or set the processed status
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
      console.error('Error in toggleEobProcessed:', error);
      return next({
        status: 500,
        message: { err: 'Failed to toggle EOB processed status' },
        log: `PaymentController.toggleEobProcessed: ${error}`,
      });
    }
  },

  // Bulk toggle for multiple EOBs
  bulkToggleProcessed: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { eobIds, isProcessed } = req.body;

      if (!eobIds || !Array.isArray(eobIds)) {
        return next({
          status: 400,
          message: { err: 'EOB IDs array is required' },
          log: `PaymentController.bulkToggleProcessed: Invalid eobIds`,
        });
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
      console.error('Error in bulkToggleProcessed:', error);
      return next({
        status: 500,
        message: { err: 'Failed to bulk toggle EOB processed status' },
        log: `PaymentController.bulkToggleProcessed: ${error}`,
      });
    }
  },

  deleteAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Legacy endpoint - redirect to clearTables
      req.body = { 
        tables: ['eob', 'deposit'], 
        confirmCode: 'CLEAR_TABLES_CONFIRMED' 
      };
      return paymentController.clearTables(req, res, next);
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
