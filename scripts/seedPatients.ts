/**
 * One-time seed script: pulls all patients from Tebra (2013 → today) and upserts into the local DB.
 *
 * Usage:
 *   npx tsx scripts/seedPatients.ts
 *
 * To test against a small range first, set environment variables:
 *   START_YEAR=2025 END_YEAR=2025 npx tsx scripts/seedPatients.ts
 */

import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { XMLParser } from 'fast-xml-parser';

const prisma = new PrismaClient();
const parser = new XMLParser({ ignoreAttributes: false, removeNSPrefix: true });

const API_URL = process.env.TEBRA_API_URL!;
const START_YEAR = Number(process.env.START_YEAR ?? 2013);
const END_YEAR = Number(process.env.END_YEAR ?? 2026);
const DELAY_MS = 2000;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseSoapDateTime(str: unknown): Date {
  return new Date(String(str));
}

/** Build year batches: [{ from: "2013-01-01", to: "2013-12-31" }, ...] */
function buildYearRanges(): { from: string; to: string }[] {
  const currentYear = new Date().getFullYear();
  const today = new Date().toISOString().split('T')[0];
  const ranges: { from: string; to: string }[] = [];
  for (let year = START_YEAR; year <= END_YEAR; year++) {
    const from = `${year}-01-01`;
    const to = year >= currentYear ? today : `${year}-12-31`;
    ranges.push({ from, to });
  }
  return ranges;
}

function toOptionalDate(val: unknown): Date | null {
  if (!val) return null;
  const str = String(val);
  if (str === '0001-01-01T00:00:00' || str === '1/1/0001 12:00:00 AM') return null;
  try {
    const d = new Date(str);
    if (isNaN(d.getTime())) return null;
    return d;
  } catch {
    return null;
  }
}

function toOptionalInt(val: unknown): number | null {
  const n = Number(val);
  return isNaN(n) || n === 0 ? null : n;
}

function toOptionalStr(val: unknown): string | null {
  if (val === null || val === undefined || val === '' || val === 0 || val === false) return null;
  const s = String(val);
  if (s === '0' || s === 'false' || s === '') return null;
  return s;
}

function buildSoapEnvelope(fromDate: string, toDate: string): string {
  return `<?xml version="1.0" encoding="utf-8"?>
<soapenv:Envelope
  xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
  xmlns:sch="http://www.kareo.com/api/schemas/">
  <soapenv:Header/>
  <soapenv:Body>
    <sch:GetPatients>
      <sch:request>
        <sch:RequestHeader>
          <sch:ClientVersion></sch:ClientVersion>
          <sch:CustomerKey>${process.env.TEBRA_CUSTOMER_KEY}</sch:CustomerKey>
          <sch:Password>${process.env.TEBRA_PASSWORD}</sch:Password>
          <sch:User>${process.env.TEBRA_USER_ID}</sch:User>
        </sch:RequestHeader>
        <sch:Fields>
          <sch:AlertMessage>true</sch:AlertMessage>
          <sch:CreatedDate>true</sch:CreatedDate>
          <sch:DOB>true</sch:DOB>
          <sch:ID>true</sch:ID>
          <sch:InsuranceBalance>true</sch:InsuranceBalance>
          <sch:LastAppointmentDate>true</sch:LastAppointmentDate>
          <sch:LastEncounterDate>true</sch:LastEncounterDate>
          <sch:LastModifiedDate>true</sch:LastModifiedDate>
          <sch:LastStatementDate>true</sch:LastStatementDate>
          <sch:MobilePhone>true</sch:MobilePhone>
          <sch:PatientBalance>true</sch:PatientBalance>
          <sch:PatientFullName>true</sch:PatientFullName>
          <sch:PrimaryInsurancePolicyCompanyID>true</sch:PrimaryInsurancePolicyCompanyID>
          <sch:PrimaryInsurancePolicyCompanyName>true</sch:PrimaryInsurancePolicyCompanyName>
          <sch:PrimaryInsurancePolicyNumber>true</sch:PrimaryInsurancePolicyNumber>
          <sch:PrimaryInsurancePolicyPlanAddressLine1>true</sch:PrimaryInsurancePolicyPlanAddressLine1>
          <sch:PrimaryInsurancePolicyPlanCity>true</sch:PrimaryInsurancePolicyPlanCity>
          <sch:PrimaryInsurancePolicyPlanID>true</sch:PrimaryInsurancePolicyPlanID>
          <sch:PrimaryInsurancePolicyPlanName>true</sch:PrimaryInsurancePolicyPlanName>
          <sch:PrimaryInsurancePolicyPlanState>true</sch:PrimaryInsurancePolicyPlanState>
          <sch:PrimaryInsurancePolicyPlanZipCode>true</sch:PrimaryInsurancePolicyPlanZipCode>
          <sch:SecondaryInsurancePolicyCompanyID>true</sch:SecondaryInsurancePolicyCompanyID>
          <sch:SecondaryInsurancePolicyCompanyName>true</sch:SecondaryInsurancePolicyCompanyName>
          <sch:SecondaryInsurancePolicyNumber>true</sch:SecondaryInsurancePolicyNumber>
          <sch:SecondaryInsurancePolicyPlanAddressLine1>true</sch:SecondaryInsurancePolicyPlanAddressLine1>
          <sch:SecondaryInsurancePolicyPlanCity>true</sch:SecondaryInsurancePolicyPlanCity>
          <sch:SecondaryInsurancePolicyPlanID>true</sch:SecondaryInsurancePolicyPlanID>
          <sch:SecondaryInsurancePolicyPlanName>true</sch:SecondaryInsurancePolicyPlanName>
          <sch:SecondaryInsurancePolicyPlanState>true</sch:SecondaryInsurancePolicyPlanState>
          <sch:SecondaryInsurancePolicyPlanZipCode>true</sch:SecondaryInsurancePolicyPlanZipCode>
          <sch:TotalBalance>true</sch:TotalBalance>
        </sch:Fields>
        <sch:Filter>
          <sch:FromCreatedDate>${fromDate}</sch:FromCreatedDate>
          <sch:ToCreatedDate>${toDate}</sch:ToCreatedDate>
          <sch:PracticeName>${process.env.TEBRA_PRACTICE_NAME}</sch:PracticeName>
        </sch:Filter>
      </sch:request>
    </sch:GetPatients>
  </soapenv:Body>
</soapenv:Envelope>`;
}

async function fetchPatientsBySoap(fromDate: string, toDate: string): Promise<any[]> {
  const envelope = buildSoapEnvelope(fromDate, toDate);

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/xml; charset=utf-8',
      SOAPAction: 'http://www.kareo.com/api/schemas/KareoServices/GetPatients',
    },
    body: envelope,
  });

  const rawXml = await response.text();
  const parsed = parser.parse(rawXml);
  const result = parsed?.Envelope?.Body?.GetPatientsResponse?.GetPatientsResult;

  if (!result) throw new Error('Could not locate GetPatientsResult in response');
  if (result.ErrorResponse?.IsError === true || result.ErrorResponse?.IsError === 'true') {
    throw new Error(`Tebra API error: ${result.ErrorResponse.ErrorMessage}`);
  }

  const patients = result?.Patients?.PatientData;
  if (!patients) return [];
  return Array.isArray(patients) ? patients : [patients];
}

async function upsertPatient(p: any): Promise<'upserted' | 'skipped'> {
  const id = Number(p.ID);
  if (!id) return 'skipped';

  const name = String(p.PatientFullName ?? '');
  if (/duplicate/i.test(name)) return 'skipped';

  const data = {
    lastModifiedDate: parseSoapDateTime(p.LastModifiedDate),
    patientFullName: String(p.PatientFullName ?? ''),
    dob: toOptionalDate(p.DOB),
    mobilePhone: toOptionalStr(p.MobilePhone),
    primaryInsurancePolicyCompanyId: toOptionalInt(p.PrimaryInsurancePolicyCompanyID),
    primaryInsurancePolicyCompanyName: toOptionalStr(p.PrimaryInsurancePolicyCompanyName),
    primaryInsurancePolicyPlanId: toOptionalInt(p.PrimaryInsurancePolicyPlanID),
    primaryInsurancePolicyPlanName: toOptionalStr(p.PrimaryInsurancePolicyPlanName),
    primaryInsurancePolicyPlanAddressLine1: toOptionalStr(p.PrimaryInsurancePolicyPlanAddressLine1),
    primaryInsurancePolicyPlanCity: toOptionalStr(p.PrimaryInsurancePolicyPlanCity),
    primaryInsurancePolicyPlanState: toOptionalStr(p.PrimaryInsurancePolicyPlanState),
    primaryInsurancePolicyPlanZipCode: toOptionalStr(p.PrimaryInsurancePolicyPlanZipCode),
    primaryInsurancePolicyNumber: toOptionalStr(p.PrimaryInsurancePolicyNumber),
    secondaryInsurancePolicyCompanyId: toOptionalInt(p.SecondaryInsurancePolicyCompanyID),
    secondaryInsurancePolicyCompanyName: toOptionalStr(p.SecondaryInsurancePolicyCompanyName),
    secondaryInsurancePolicyPlanId: toOptionalInt(p.SecondaryInsurancePolicyPlanID),
    secondaryInsurancePolicyPlanName: toOptionalStr(p.SecondaryInsurancePolicyPlanName),
    secondaryInsurancePolicyPlanAddressLine1: toOptionalStr(
      p.SecondaryInsurancePolicyPlanAddressLine1,
    ),
    secondaryInsurancePolicyPlanCity: toOptionalStr(p.SecondaryInsurancePolicyPlanCity),
    secondaryInsurancePolicyPlanState: toOptionalStr(p.SecondaryInsurancePolicyPlanState),
    secondaryInsurancePolicyPlanZipCode: toOptionalStr(p.SecondaryInsurancePolicyPlanZipCode),
    secondaryInsurancePolicyNumber: toOptionalStr(p.SecondaryInsurancePolicyNumber),
    alertMessage: toOptionalStr(p.AlertMessage),
    insuranceBalance: p.InsuranceBalance != null ? Number(p.InsuranceBalance) : null,
    patientBalance: p.PatientBalance != null ? Number(p.PatientBalance) : null,
    totalBalance: p.TotalBalance != null ? Number(p.TotalBalance) : null,
    lastAppointmentDate: toOptionalDate(p.LastAppointmentDate),
    lastEncounterDate: toOptionalDate(p.LastEncounterDate),
    lastStatementDate: toOptionalDate(p.LastStatementDate),
  };

  await prisma.patient.upsert({
    where: { id },
    update: data,
    create: {
      id,
      createdDate: toOptionalDate(p.CreatedDate) ?? new Date(),
      ...data,
    },
  });

  return 'upserted';
}

async function main() {
  const ranges = buildYearRanges();
  let totalUpserted = 0;
  let totalSkipped = 0;
  let totalFetched = 0;

  console.log(`Seeding patients from ${START_YEAR} → ${END_YEAR} in ${ranges.length} batches...\n`);

  for (const { from, to } of ranges) {
    process.stdout.write(`[${from} → ${to}] fetching... `);
    let patients: any[];

    try {
      patients = await fetchPatientsBySoap(from, to);
    } catch (err) {
      console.error(`ERROR: ${err}`);
      console.error('If the endpoint is unreachable, update TEBRA_API_URL in .env and retry.');
      break;
    }

    console.log(`${patients.length} patients`);
    totalFetched += patients.length;

    // Log first patient from each batch to debug field availability
    if (patients.length > 0) {
      const sample = patients[0];
      // console.log(`  Sample keys: ${Object.keys(sample).join(', ')}`);
      console.log(
        `  DOB=${sample.DOB}, MobilePhone=${sample.MobilePhone}, PrimaryIns=${sample.PrimaryInsurancePolicyCompanyName}`,
      );
    }

    let batchUpserted = 0;
    let batchSkipped = 0;

    for (const p of patients) {
      const outcome = await upsertPatient(p);
      if (outcome === 'upserted') batchUpserted++;
      else batchSkipped++;
    }

    totalUpserted += batchUpserted;
    totalSkipped += batchSkipped;
    console.log(`  → upserted: ${batchUpserted}, skipped: ${batchSkipped}`);

    if (from !== ranges[ranges.length - 1].from) {
      await sleep(DELAY_MS);
    }
  }

  console.log(
    `\nDone. Total fetched: ${totalFetched}, upserted: ${totalUpserted}, skipped: ${totalSkipped}`,
  );

  await prisma.$disconnect();
}

main().catch(async (err) => {
  console.error(err);
  await prisma.$disconnect();
  process.exit(1);
});
