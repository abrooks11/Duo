import {Response} from 'express';

// Shared types for EOB and Payment functionality
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
  reference: string;
  payerName: string;
  amount: number;
}

export interface PaymentResponse extends Response {
  eobs?: Eob[];
  deposits?: Deposit[];
  matchedEobs?: Eob[];
}

// API Response types
export interface PaymentApiResponse {
  eobs: Eob[];
}

export interface DepositApiResponse {
  deposits: Deposit[];
}

export interface MatchingResultResponse {
  message: string;
  totalEobs: number;
  matchesFound: number;
}

// API Error types
export interface ApiError {
  status: number;
  message: { err: string };
  log?: string;
}