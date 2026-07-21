import fs from 'fs';
import path from 'path';
import prisma from '../../prisma.ts';
import { fetchAppointments, fetchInsuranceEobs, fetchPatientBalances, fetchPatients, parseSoapDateTime } from './tebraApi.ts';
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
      if (existing && existing.lastModifiedDate > incomingModified) {
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

/**
 * Sync patients from the Tebra API into the local database.
 *
 * - Filters by LastModifiedDate range
 * - Upserts each patient by Tebra ID
 * - On CREATE: sets createdDate from Tebra
 * - On UPDATE: overwrites all synced fields (no custom local fields on Patient)
 */
export async function syncPatients(fromDate: string, toDate: string): Promise<SyncResult> {
  const result: SyncResult = { synced: 0, skipped: 0, errors: [] };

  const patients = await fetchPatients(fromDate, toDate);
  log.info(`Fetched ${patients.length} patients (${fromDate} → ${toDate})`);

  for (const p of patients) {
    try {
      const patientId = Number(p.ID);
      if (!patientId) {
        result.skipped++;
        result.errors.push(`Skipped: missing ID (raw: ${JSON.stringify(p)})`);
        continue;
      }

      const incomingModified = parseSoapDateTime(p.LastModifiedDate);
      const existing = await prisma.patient.findUnique({ where: { id: patientId } });
      if (existing && existing.lastModifiedDate >= incomingModified) {
        result.skipped++;
        continue;
      }

      const data = {
        lastModifiedDate: incomingModified,
        patientFullName: String(p.PatientFullName ?? ''),
        dob: p.DOB ? parseSoapDateTime(p.DOB) : null,
        mobilePhone: p.MobilePhone ? String(p.MobilePhone) : null,
        alertMessage: p.AlertMessage ? String(p.AlertMessage) : null,
        lastAppointmentDate: p.LastAppointmentDate ? parseSoapDateTime(p.LastAppointmentDate) : null,
        lastEncounterDate: p.LastEncounterDate ? parseSoapDateTime(p.LastEncounterDate) : null,
        lastStatementDate: p.LastStatementDate ? parseSoapDateTime(p.LastStatementDate) : null,
        insuranceBalance: p.InsuranceBalance != null ? Number(p.InsuranceBalance) : null,
        patientBalance: p.PatientBalance != null ? Number(p.PatientBalance) : null,
        totalBalance: p.TotalBalance != null ? Number(p.TotalBalance) : null,
        primaryInsurancePolicyCompanyId: p.PrimaryInsurancePolicyCompanyID ? Number(p.PrimaryInsurancePolicyCompanyID) : null,
        primaryInsurancePolicyCompanyName: p.PrimaryInsurancePolicyCompanyName ? String(p.PrimaryInsurancePolicyCompanyName) : null,
        primaryInsurancePolicyPlanId: p.PrimaryInsurancePolicyPlanID ? Number(p.PrimaryInsurancePolicyPlanID) : null,
        primaryInsurancePolicyPlanName: p.PrimaryInsurancePolicyPlanName ? String(p.PrimaryInsurancePolicyPlanName) : null,
        primaryInsurancePolicyPlanAddressLine1: p.PrimaryInsurancePolicyPlanAddressLine1 ? String(p.PrimaryInsurancePolicyPlanAddressLine1) : null,
        primaryInsurancePolicyPlanCity: p.PrimaryInsurancePolicyPlanCity ? String(p.PrimaryInsurancePolicyPlanCity) : null,
        primaryInsurancePolicyPlanState: p.PrimaryInsurancePolicyPlanState ? String(p.PrimaryInsurancePolicyPlanState) : null,
        primaryInsurancePolicyPlanZipCode: p.PrimaryInsurancePolicyPlanZipCode ? String(p.PrimaryInsurancePolicyPlanZipCode) : null,
        primaryInsurancePolicyNumber: p.PrimaryInsurancePolicyNumber ? String(p.PrimaryInsurancePolicyNumber) : null,
        secondaryInsurancePolicyCompanyId: p.SecondaryInsurancePolicyCompanyID ? Number(p.SecondaryInsurancePolicyCompanyID) : null,
        secondaryInsurancePolicyCompanyName: p.SecondaryInsurancePolicyCompanyName ? String(p.SecondaryInsurancePolicyCompanyName) : null,
        secondaryInsurancePolicyPlanId: p.SecondaryInsurancePolicyPlanID ? Number(p.SecondaryInsurancePolicyPlanID) : null,
        secondaryInsurancePolicyPlanName: p.SecondaryInsurancePolicyPlanName ? String(p.SecondaryInsurancePolicyPlanName) : null,
        secondaryInsurancePolicyPlanAddressLine1: p.SecondaryInsurancePolicyPlanAddressLine1 ? String(p.SecondaryInsurancePolicyPlanAddressLine1) : null,
        secondaryInsurancePolicyPlanCity: p.SecondaryInsurancePolicyPlanCity ? String(p.SecondaryInsurancePolicyPlanCity) : null,
        secondaryInsurancePolicyPlanState: p.SecondaryInsurancePolicyPlanState ? String(p.SecondaryInsurancePolicyPlanState) : null,
        secondaryInsurancePolicyPlanZipCode: p.SecondaryInsurancePolicyPlanZipCode ? String(p.SecondaryInsurancePolicyPlanZipCode) : null,
        secondaryInsurancePolicyNumber: p.SecondaryInsurancePolicyNumber ? String(p.SecondaryInsurancePolicyNumber) : null,
      };

      await prisma.patient.upsert({
        where: { id: patientId },
        update: data,
        create: { id: patientId, createdDate: parseSoapDateTime(p.CreatedDate), ...data },
      });
      log.info(
        { patientId, name: p.PatientFullName, policyNumber: p.PrimaryInsurancePolicyNumber ?? null },
        'Patient upserted',
      );
      result.synced++;
    } catch (err) {
      result.skipped++;
      const msg = `Error on patient ${p.ID}: ${err}`;
      result.errors.push(msg);
      log.error({ patientId: p.ID, err }, 'Patient upsert failed');
    }
  }

  log.info(`Patient sync complete: ${result.synced} synced, ${result.skipped} skipped`);
  return result;
}

/**
 * Sync patient balance fields from Tebra for all patients with a non-zero balance.
 *
 * - Fetches all patients with InsuranceBalance, PatientBalance, or TotalBalance > 0
 * - Only updates the three balance fields — never creates new patient records
 * - Skips patients not present in the local DB
 */
export async function syncPatientBalances(): Promise<SyncResult> {
  const result: SyncResult = { synced: 0, skipped: 0, errors: [] };

  // Tebra caps results at 10,000 per request. Chunk by creation year to cover all patients.
  const currentYear = new Date().getFullYear();
  const allPatients: any[] = [];
  for (let year = 2012; year <= currentYear; year++) {
    const chunk = await fetchPatientBalances(`${year}-01-01`, `${year}-12-31`);
    log.info(`Year ${year}: ${chunk.length} patients with non-zero balances`);
    allPatients.push(...chunk);
    if (year < currentYear) await new Promise((r) => setTimeout(r, 1100));
  }
  const patients = allPatients;
  log.info(`Fetched ${patients.length} patients with non-zero balances (across all years)`);

  for (const p of patients) {
    try {
      const patientId = Number(p.ID);
      if (!patientId) {
        result.skipped++;
        continue;
      }

      const updated = await prisma.patient.updateMany({
        where: { id: patientId },
        data: {
          insuranceBalance: p.InsuranceBalance != null ? Number(p.InsuranceBalance) : null,
          patientBalance: p.PatientBalance != null ? Number(p.PatientBalance) : null,
          totalBalance: p.TotalBalance != null ? Number(p.TotalBalance) : null,
        },
      });

      if (updated.count === 0) {
        result.skipped++;
        result.errors.push(`Skipped patient ${patientId}: not in local DB`);
      } else {
        result.synced++;
      }
    } catch (err) {
      result.skipped++;
      result.errors.push(`Error on patient ${p.ID}: ${err}`);
    }
  }

  log.info(`Balance sync complete: ${result.synced} synced, ${result.skipped} skipped`);

  // Write patients with non-zero balances to a txt log file.
  const syncedPatients = patients.filter((p) => {
    const patientId = Number(p.ID);
    return (
      patientId &&
      (Number(p.InsuranceBalance) > 0 ||
        Number(p.PatientBalance) > 0 ||
        Number(p.TotalBalance) > 0)
    );
  });

  if (syncedPatients.length > 0) {
    console.log('SYNCHED PATIENTS', syncedPatients[0])
    const logsDir = path.resolve(process.cwd(), 'logs');
    if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const logFile = path.join(logsDir, `patient-balances-${timestamp}.txt`);

    const lines = [
      `Patient Balance Sync — ${new Date().toISOString()}`,
      `Total with non-zero balances: ${syncedPatients.length}`,
      '',
      // 'ID          | Patient Name           | Last Name            | Ins Balance | Pat Balance | Total Balance',
      'ID          | Patient Name           | Patient Balance | Insurance Balance | Total Balance',
      '-'.repeat(105),
      // ...syncedPatients.filter(p=>p.TotalBalance === 0).map((p) => {
      ...syncedPatients.map((p) => {
        const id = String(p.ID).padEnd(11);
        const name = String(p.PatientFullName ?? '').padEnd(21);
        const ins = String(p.InsuranceBalance ?? 0).padStart(11);
        const pat = String(p.PatientBalance ?? 0).padStart(11);
        const total = String(p.TotalBalance ?? 0).padStart(13);
        return `${id} | ${name} | ${pat} | ${ins} | ${total}`;
      }),
    ];

    fs.writeFileSync(logFile, lines.join('\n'), 'utf-8');
    log.info(`Balance log written to ${logFile}`);
  }

  return result;
}
