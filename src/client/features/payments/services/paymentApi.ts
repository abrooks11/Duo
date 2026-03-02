const BASE = '/api/payments';

export type ReconciliationStatus = 'matched' | 'missingEob' | 'pendingPayment';

export type PaymentType = 'Check' | 'EFT' | 'CC';

export interface ReconciliationRow {
  status: ReconciliationStatus;
  // Deposit side (null for pendingPayment rows)
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
  totalDeposits: { count: number; amount: number };
  matched: { count: number; amount: number };
  pendingPayment: { count: number; amount: number };
  missingEob: { count: number; amount: number };
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
