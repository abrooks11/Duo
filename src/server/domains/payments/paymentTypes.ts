// Reconciliation dashboard types

export type ReconciliationStatus = 'matched' | 'missingEob' | 'pendingPayment';

export type PaymentType = 'Check' | 'EFT' | 'CC';

export interface ReconciliationRow {
  status: ReconciliationStatus;
  // Deposit side (null for pendingPayment rows)
  depositDate: string | null;     // ISO date string from deposit.createdDate
  bankDescription: string | null; // deposit.description or deposit.payerName
  depositRef: string | null;      // deposit.reference
  depositId: string | null;
  // EOB side (null for missingEob rows)
  eobRef: string | null;          // eob.reference
  eobDate: string | null;         // ISO date string from eob.createdDate
  eobId: number | null;
  // Shared
  payerName: string;
  type: PaymentType | null;       // from eob.paymentMethod; null when no EOB
  amount: number;                 // deposit.amount if available, else eob.amount
  amountDelta: number | null;     // abs(deposit.amount - eob.amount), null if one side missing
}

export interface ReconciliationStats {
  totalDeposits:  { count: number; amount: number };
  matched:        { count: number; amount: number };
  pendingPayment: { count: number; amount: number };
  missingEob:     { count: number; amount: number };
}

export interface ReconciliationResponse {
  stats: ReconciliationStats;
  rows: ReconciliationRow[];
}

// Internal DB types (used by controller)
export interface Eob {
  id: number;
  createdDate: Date;
  lastModifiedDate: Date;
  reference: string | null;
  payerType: string;
  payerName: string;
  paymentMethod: string;
  amount: number;
  depositId: string | null;
  isMatched?: boolean;
  isProcessed?: boolean;
}

export interface Deposit {
  id: string;
  createdDate: Date;
  postDate: Date | null;
  description: string | null;
  reference: string;
  payerName: string;
  amount: number;
}
