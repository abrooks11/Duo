export interface ExcelRow {
  [key: string]: unknown;
  id?: number;
  lastModifiedDate?: string | Date;
  startDate?: string | Date;
  createdDate?: string | Date;
  patientId?: number;
  patientFullName?: string;
  type?: string;
  appointmentReason?: string;
  notes?: unknown;
  description?: string;
  credit?: number | null;
  date?: string | Date;
  payerType?: string;
  payerName?: string;
  paymentMethod?: string;
  reference?: unknown;
  amount?: number | string;
}
