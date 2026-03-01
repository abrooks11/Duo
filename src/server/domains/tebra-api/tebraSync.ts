import { PrismaClient } from '@prisma/client';
import { fetchAppointments, parseSoapDateTime } from './tebraApi.ts';
import { createChildLogger } from '../../shared/logger.js';

const prisma = new PrismaClient();
const log = createChildLogger('tebra-sync');

export interface SyncResult {
  synced: number;
  skipped: number;
  errors: string[];
}

/**
 * Sync appointments from the Tebra API into the local database.
 *
 * - Upserts each appointment by Tebra ID
 * - On UPDATE: only touches structured fields (dates, status, reason, caseName)
 * - On UPDATE: never overwrites notes, insEligibility, or patientCopay
 * - On CREATE: seeds notes from Tebra's Notes field (can be edited locally afterward)
 * - Skips appointments whose patient doesn't exist in the local DB
 */
export async function syncAppointments(fromDate: string, toDate: string): Promise<SyncResult> {
  const result: SyncResult = { synced: 0, skipped: 0, errors: [] };

  const appointments = await fetchAppointments(fromDate, toDate);
  log.info(`Fetched ${appointments.length} appointments (${fromDate} → ${toDate})`);

  for (const appt of appointments) {
    try {
      const patientId = Number(appt.PatientID);
      const appointmentId = Number(appt.ID);

      if (!patientId || !appointmentId) {
        result.skipped++;
        result.errors.push(`Skipped: missing ID or PatientID (appt raw: ${JSON.stringify(appt)})`);
        continue;
      }

      // Verify the patient exists locally before upserting the appointment
      const patientExists = await prisma.patient.findUnique({ where: { id: patientId } });
      if (!patientExists) {
        result.skipped++;
        result.errors.push(`Skipped appt ${appointmentId}: patient ${patientId} not in local DB`);
        continue;
      }

      await prisma.appointment.upsert({
        where: { id: appointmentId },
        update: {
          // Sync structured fields only — never touch notes, insEligibility, patientCopay
          lastModifiedDate: parseSoapDateTime(appt.LastModifiedDate),
          confirmationStatus: String(appt.ConfirmationStatus ?? ''),
          appointmentReason: appt.AppointmentReason1 ? String(appt.AppointmentReason1) : null,
          patientCaseName: appt.PatientCaseName ? String(appt.PatientCaseName) : null,
          startDate: parseSoapDateTime(appt.StartDate),
        },
        create: {
          id: appointmentId,
          createdDate: parseSoapDateTime(appt.CreatedDate),
          lastModifiedDate: parseSoapDateTime(appt.LastModifiedDate),
          confirmationStatus: String(appt.ConfirmationStatus ?? ''),
          appointmentReason: appt.AppointmentReason1 ? String(appt.AppointmentReason1) : null,
          patientCaseName: appt.PatientCaseName ? String(appt.PatientCaseName) : null,
          startDate: parseSoapDateTime(appt.StartDate),
          patientId,
          notes: appt.Notes ? String(appt.Notes) : null,
        },
      });

      result.synced++;
    } catch (err) {
      result.skipped++;
      result.errors.push(`Error on appt ${appt.ID}: ${err}`);
    }
  }

  log.info(`Sync complete: ${result.synced} synced, ${result.skipped} skipped`);
  return result;
}
