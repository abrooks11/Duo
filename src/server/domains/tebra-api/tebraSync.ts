import prisma from '../../prisma.ts';
import { fetchAppointments, fetchInsuranceEobs, parseSoapDateTime } from './tebraApi.ts';
import { createChildLogger } from '../../shared/logger.js';

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

/**
 * Sync insurance EOBs from the Tebra API into the local Eob table.
 *
 * - Upserts each EOB by Tebra payment ID
 * - On UPDATE: only updates if incoming LastModifiedDate is newer than existing
 * - On CREATE: inserts with isMatched=false, isProcessed=false defaults
 */
export async function syncEobs(fromDate: string, toDate: string): Promise<SyncResult> {
  const result: SyncResult = { synced: 0, skipped: 0, errors: [] };

  console.log(`[DEBUG syncEobs] Calling fetchInsuranceEobs(${fromDate}, ${toDate})`);
  const eobs = await fetchInsuranceEobs(fromDate, toDate);
  console.log(`[DEBUG syncEobs] Got ${eobs.length} EOBs back from fetchInsuranceEobs`);
  log.info(`Fetched ${eobs.length} insurance EOBs (${fromDate} → ${toDate})`);

  for (const eob of eobs) {
    try {
      const eobId = Number(eob.ID);
      if (!eobId) {
        result.skipped++;
        result.errors.push(`Skipped: missing ID (eob raw: ${JSON.stringify(eob)})`);
        continue;
      }

      if (Number(eob.Amount) <= 0) {
        result.skipped++;
        continue;
      }

      const incomingModified = parseSoapDateTime(eob.LastModifiedDate);

      // Check if record already exists and is up-to-date
      const existing = await prisma.eob.findUnique({ where: { id: eobId } });
      if (existing && existing.lastModifiedDate >= incomingModified) {
        result.skipped++;
        continue;
      }

      const data = {
        createdDate: parseSoapDateTime(eob.CreatedDate),
        lastModifiedDate: incomingModified,
        reference: eob.ReferenceNumber ? String(eob.ReferenceNumber) : null,
        payerName: String(eob.PayerName ?? ''),
        payerType: eob.PayerType ? String(eob.PayerType) : 'insurance',
        paymentMethod: String(eob.PaymentMethod ?? ''),
        amount: Number(eob.Amount),
      };

      await prisma.eob.upsert({
        where: { id: eobId },
        update: data,
        create: {
          id: eobId,
          ...data,
          isMatched: false,
          isProcessed: false,
        },
      });

      result.synced++;
    } catch (err) {
      result.skipped++;
      result.errors.push(`Error on EOB ${eob.ID}: ${err}`);
    }
  }

  log.info(`EOB sync complete: ${result.synced} synced, ${result.skipped} skipped`);
  return result;
}
