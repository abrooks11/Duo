import type { Request, Response, NextFunction } from 'express';

export type AppointmentController = {
  getAppointments: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  updateNote: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  updateCopay: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  deleteAll: (req: Request, res: Response, next: NextFunction) => Promise<void>;
};

export type FileAppointment = {
  lastModifiedDate: string;
  confirmationStatus: string;
  appointmentReason?: string | null;
  patientCaseName?: string | null;
  startDate: string;
};