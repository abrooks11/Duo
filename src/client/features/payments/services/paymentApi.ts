const BASE = '/api/payments';

export type ReconciliationStatus =
  | 'matched'
  | 'missingEob'
  | 'pendingPayment'
  | 'pendingDeposit'
  | 'pendingProcessing'
  | 'deposited'
  | 'processed';

export type PaymentType = 'Check' | 'EFT' | 'CC';

export interface ReconciliationRow {
  status: ReconciliationStatus;
  // Deposit side (null for pending/confirmed-no-deposit rows)
  depositDate: string | null;
  bankDescription: string | null;
  depositRef: string | null;
  depositId: string | null;
  // EOB side (null for missingEob rows)
  eobRef: string | null;
  eobDate: string | null;
  eobId: number | null;
  // Shared
  payerName: string;
  type: PaymentType | null;
  amount: number;
  amountDelta: number | null;
}

export interface ReconciliationStats {
  totalDeposits:      { count: number; amount: number };
  matched:            { count: number; amount: number };
  pendingPayment:     { count: number; amount: number };
  pendingDeposit:     { count: number; amount: number };
  pendingProcessing:  { count: number; amount: number };
  deposited:          { count: number; amount: number };
  processed:          { count: number; amount: number };
  missingEob:         { count: number; amount: number };
}

export interface ReconciliationResponse {
  stats: ReconciliationStats;
  rows: ReconciliationRow[];
}

export const getReconciliation = async (): Promise<ReconciliationResponse> => {
  const res = await fetch(`${BASE}/reconciliation`);
  const json = await res.json();
  return json.data;
};

export const runMatch = async (): Promise<void> => {
  await fetch(`${BASE}/match`, { method: 'POST' });
};

export const confirmDeposit = async (eobId: number): Promise<void> => {
  await fetch(`${BASE}/confirm`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ eobId }),
  });
};
