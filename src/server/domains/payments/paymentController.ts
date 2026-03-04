import { Request, Response, NextFunction } from 'express';
import prisma from '../../prisma.ts';
import type { PaymentType, ReconciliationStatus } from './paymentTypes.ts';
import { AppError, handleControllerError } from '../../shared/errorHandlers.js';
import { createChildLogger } from '../../shared/logger.js';
import { syncEobs } from '../tebra-api/tebraSync.ts';

const log = createChildLogger('payments');

/** Map raw paymentMethod codes to display types */
const mapPaymentType = (pm: string): PaymentType | null => {
  if (pm === '1' || pm.startsWith('1')) return 'Check';
  if (pm === '3' || pm.startsWith('3')) return 'CC';
  if (pm === '4' || pm.startsWith('4')) return 'EFT';
  return null;
};

/** Default date range: first and last day of current month (YYYY-MM-DD) */
function defaultDateRange(): { from: string; to: string } {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const lastDay = new Date(y, now.getMonth() + 1, 0).getDate();
  return { from: '2026-01-15', to: `${y}-${m}-${String(lastDay).padStart(2, '0')}` };
}

const paymentController = {
  getReconciliation: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Auto-sync EOBs from Tebra before querying
      const { from: defaultFrom, to: defaultTo } = defaultDateRange();
      const fromDate = (req.query.from as string) || defaultFrom;
      const toDate = (req.query.to as string) || defaultTo;

      console.log(`[DEBUG getReconciliation] Date range: ${fromDate} to ${toDate}`);
      try {
        const syncResult = await syncEobs(fromDate, toDate);
        console.log(`[DEBUG getReconciliation] Sync result:`, syncResult);
        log.info(`EOB auto-sync: ${syncResult.synced} synced, ${syncResult.skipped} skipped`);
      } catch (syncErr) {
        console.log(`[DEBUG getReconciliation] Sync error:`, syncErr);
        log.warn({ err: syncErr }, 'EOB auto-sync failed, proceeding with local data');
      }

      const [matchedDeposits, missingEobDeposits, pendingEobs, confirmedEobs] = await Promise.all([
        prisma.deposit.findMany({
          where: { eob: { isNot: null } },
          include: { eob: true },
        }),
        prisma.deposit.findMany({
          where: { eob: null },
        }),
        // Unconfirmed EOBs with no deposit (Check, CC, EFT not yet acted on)
        prisma.eob.findMany({
          where: { depositId: null, isProcessed: false },
        }),
        // Manually confirmed EOBs (Check → deposited, CC → processed)
        prisma.eob.findMany({
          where: { depositId: null, isProcessed: true },
        }),
      ]);

      const pendingStatusFor = (pm: string): ReconciliationStatus => {
        const type = mapPaymentType(pm);
        if (type === 'Check') return 'pendingDeposit';
        if (type === 'CC') return 'pendingProcessing';
        return 'pendingPayment';
      };

      const confirmedStatusFor = (pm: string): ReconciliationStatus => {
        const type = mapPaymentType(pm);
        if (type === 'Check') return 'deposited';
        return 'processed'; // CC (and anything else confirmed)
      };

      const rows = [
        ...matchedDeposits.map((deposit) => {
          const eob = deposit.eob!;
          const delta = Number(deposit.amount) - Number(eob.amount);
          return {
            status: 'matched' as const,
            depositDate: (deposit.postDate ?? deposit.createdDate).toISOString(),
            bankDescription: deposit.description ?? null,
            depositRef: deposit.reference,
            depositId: deposit.id,
            eobRef: eob.reference,
            eobDate: eob.createdDate.toISOString(),
            eobId: eob.id,
            payerName: deposit.payerName,
            type: mapPaymentType(eob.paymentMethod),
            amount: Number(deposit.amount),
            amountDelta: Math.abs(delta) < 0.01 ? 0 : parseFloat(Math.abs(delta).toFixed(2)),
          };
        }),
        ...missingEobDeposits.map((deposit) => ({
          status: 'missingEob' as const,
          depositDate: (deposit.postDate ?? deposit.createdDate).toISOString(),
          bankDescription: deposit.description ?? null,
          depositRef: deposit.reference,
          depositId: deposit.id,
          eobRef: null,
          eobDate: null,
          eobId: null,
          payerName: deposit.payerName,
          type: null as null,
          amount: Number(deposit.amount),
          amountDelta: null,
        })),
        ...pendingEobs.map((eob) => ({
          status: pendingStatusFor(eob.paymentMethod),
          depositDate: null,
          bankDescription: null,
          depositRef: null,
          depositId: null,
          eobRef: eob.reference,
          eobDate: eob.createdDate.toISOString(),
          eobId: eob.id,
          payerName: eob.payerName,
          type: mapPaymentType(eob.paymentMethod),
          amount: Number(eob.amount),
          amountDelta: null,
        })),
        ...confirmedEobs.map((eob) => ({
          status: confirmedStatusFor(eob.paymentMethod),
          depositDate: null,
          bankDescription: null,
          depositRef: null,
          depositId: null,
          eobRef: eob.reference,
          eobDate: eob.createdDate.toISOString(),
          eobId: eob.id,
          payerName: eob.payerName,
          type: mapPaymentType(eob.paymentMethod),
          amount: Number(eob.amount),
          amountDelta: null,
        })),
      ];

      const sum = (items: any[], getAmt: (x: any) => number) =>
        items.reduce((acc, x) => ({ count: acc.count + 1, amount: acc.amount + getAmt(x) }), { count: 0, amount: 0 });

      const depositedEobs = confirmedEobs.filter((e) => mapPaymentType(e.paymentMethod) === 'Check');
      const processedEobs = confirmedEobs.filter((e) => mapPaymentType(e.paymentMethod) !== 'Check');
      const checkPending   = pendingEobs.filter((e) => mapPaymentType(e.paymentMethod) === 'Check');
      const ccPending      = pendingEobs.filter((e) => mapPaymentType(e.paymentMethod) === 'CC');
      const eftPending     = pendingEobs.filter((e) => mapPaymentType(e.paymentMethod) !== 'Check' && mapPaymentType(e.paymentMethod) !== 'CC');

      const stats = {
        totalDeposits: {
          count: matchedDeposits.length + missingEobDeposits.length,
          amount: [...matchedDeposits, ...missingEobDeposits].reduce((acc, d) => acc + Number(d.amount), 0),
        },
        matched:           sum(matchedDeposits, (d) => Number(d.amount)),
        missingEob:        sum(missingEobDeposits, (d) => Number(d.amount)),
        pendingPayment:    sum(eftPending, (e) => Number(e.amount)),
        pendingDeposit:    sum(checkPending, (e) => Number(e.amount)),
        pendingProcessing: sum(ccPending, (e) => Number(e.amount)),
        deposited:         sum(depositedEobs, (e) => Number(e.amount)),
        processed:         sum(processedEobs, (e) => Number(e.amount)),
      };

      res.locals.reconciliation = { stats, rows };
      return next();
    } catch (error) {
      handleControllerError(error, 'getReconciliation', next, 'Failed to fetch reconciliation data');
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
              where: { reference: eob.reference },
            });

            if (deposit) {
              if (Math.abs(Number(deposit.amount) - Number(eob.amount)) < 0.01) {
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

  confirmDeposit: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const eobId = parseInt(req.body.eobId, 10);
      if (isNaN(eobId)) {
        return next(new AppError('eobId must be a valid integer', 400, 'Invalid eobId'));
      }
      await prisma.eob.update({
        where: { id: eobId },
        data: { isProcessed: true },
      });
      res.locals.confirmResult = { eobId };
      return next();
    } catch (error) {
      handleControllerError(error, 'confirmDeposit', next, 'Failed to confirm deposit');
    }
  },

  clearTables: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { tables, confirmCode } = req.body;

      if (confirmCode !== 'CLEAR_TABLES_CONFIRMED') {
        return next(new AppError('Invalid confirmation code. Use "CLEAR_TABLES_CONFIRMED" to proceed.', 400, 'Invalid confirmation code'));
      }

      const validTables = ['eob', 'deposit'];
      const tablesToClear = tables || ['eob', 'deposit'];

      const invalidTables = tablesToClear.filter((table: string) => !validTables.includes(table));
      if (invalidTables.length > 0) {
        return next(new AppError(`Invalid tables: ${invalidTables.join(', ')}. Valid options: ${validTables.join(', ')}`, 400, 'Invalid tables specified'));
      }

      const results: Record<string, number> = {};

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

      res.locals.clearResults = results;
      return next();
    } catch (error) {
      handleControllerError(error, 'clearTables', next, 'Failed to clear tables');
    }
  },
};

export default paymentController;
