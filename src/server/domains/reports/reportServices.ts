import OpenAI from 'openai';
import { GeneratedQuery, CreateReportInput, UpdateReportInput, CreateFolderInput, UpdateFolderInput } from './reportTypes.ts';
import { validateSelectOnly, ensureLimitClause } from './sqlValidator.ts';
import prisma, { Prisma } from '../../prisma.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Schema context for AI prompt
const SCHEMA_CONTEXT = `
You are a SQL query generator for a PostgreSQL healthcare database.

Available tables and their columns:

1. "Patient" table:
   - id (Int, primary key)
   - patientFullName (String)
   - dob (DateTime)
   - mobilePhone (String, nullable)
   - primaryInsurancePolicyCompanyName (String, nullable)
   - primaryInsurancePolicyPlanName (String, nullable)
   - secondaryInsurancePolicyCompanyName (String, nullable)
   - alertMessage (String, nullable)
   - lastAppointmentDate (DateTime, nullable)
   - lastEncounterDate (DateTime, nullable)
   - insuranceBalance (Float, nullable)
   - patientBalance (Float, nullable)
   - totalBalance (Float, nullable)
   - createdDate (DateTime)
   - lastModifiedDate (DateTime)

2. "Appointment" table:
   - id (Int, primary key)
   - patientId (Int, foreign key to Patient)
   - appointmentReason (String, nullable)
   - confirmationStatus (String)
   - patientCaseName (String, nullable)
   - startDate (DateTime)
   - notes (String, nullable)
   - insEligibility (String, nullable)
   - patientCopay (Int, nullable)
   - createdDate (DateTime)
   - lastModifiedDate (DateTime)

3. "Charge" table:
   - id (Int, primary key)
   - patientId (Int)
   - patientName (String)
   - patientDateOfBirth (DateTime)
   - serviceStartDate (DateTime)
   - procedureCode (String)
   - procedureName (String)
   - unitCharge (Float)
   - primaryInsuranceCompanyName (String)
   - status (String)
   - createdDate (DateTime)
   - lastModifiedDate (DateTime)

4. "Deposit" table:
   - id (String, primary key)
   - postDate (DateTime, nullable)
   - description (String, nullable)
   - reference (String, unique)
   - payerName (String)
   - amount (Float)
   - createdDate (DateTime)

5. "Eob" (Explanation of Benefits) table:
   - id (Int, primary key)
   - reference (String, nullable, unique)
   - payerType (String, default "insurance")
   - payerName (String)
   - paymentMethod (String)
   - amount (Float)
   - depositId (String, nullable, foreign key to Deposit)
   - isMatched (Boolean)
   - isProcessed (Boolean)
   - createdDate (DateTime)
   - lastModifiedDate (DateTime)

RULES:
1. Generate ONLY SELECT queries - never INSERT, UPDATE, DELETE, or any other statement
2. Always use double quotes for table names (e.g., "Patient", "Appointment")
3. Use CURRENT_DATE for relative date calculations
4. Return a JSON object with: { "sql": "your query here", "suggestedName": "short descriptive name" }
5. Keep suggestedName under 50 characters
6. Do NOT include a LIMIT clause - it will be added automatically
7. For joins between Patient and Appointment, use: "Patient"."id" = "Appointment"."patientId"
8. For categorical string fields (appointmentReason, confirmationStatus, Charge.status, etc.): prefer exact matches using the known values provided below. Fall back to ILIKE '%term%' only when no known value closely matches.
`;

const DEFAULT_FOLDERS = [
  { name: 'Patients', sortOrder: 0 },
  { name: 'Appointments', sortOrder: 1 },
  { name: 'Claims', sortOrder: 2 },
  { name: 'Payments', sortOrder: 3 },
  { name: 'Uncategorized', sortOrder: 4 },
];

// ============ FOLDER OPERATIONS ============

export async function getAllFolders() {
  return prisma.reportFolder.findMany({
    orderBy: { sortOrder: 'asc' },
    include: {
      reports: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });
}

export async function createFolder(input: CreateFolderInput) {
  // Get max sortOrder
  const maxSort = await prisma.reportFolder.aggregate({
    _max: { sortOrder: true },
  });
  const nextSort = (maxSort._max.sortOrder ?? -1) + 1;

  return prisma.reportFolder.create({
    data: {
      name: input.name,
      isDefault: false,
      sortOrder: nextSort,
    },
  });
}

export async function updateFolder(id: string, input: UpdateFolderInput) {
  return prisma.reportFolder.update({
    where: { id },
    data: input,
  });
}

export async function deleteFolder(id: string) {
  // Find the Uncategorized folder
  let uncategorized = await prisma.reportFolder.findFirst({
    where: { name: 'Uncategorized', isDefault: true },
  });

  // If no Uncategorized folder exists, create one
  if (!uncategorized) {
    uncategorized = await prisma.reportFolder.create({
      data: { name: 'Uncategorized', isDefault: true, sortOrder: 999 },
    });
  }

  // Move all reports from this folder to Uncategorized
  await prisma.report.updateMany({
    where: { folderId: id },
    data: { folderId: uncategorized.id },
  });

  // Delete the folder
  return prisma.reportFolder.delete({
    where: { id },
  });
}

export async function seedDefaultFolders() {
  const existingFolders = await prisma.reportFolder.count();
  if (existingFolders > 0) {
    return; // Already seeded
  }

  await prisma.reportFolder.createMany({
    data: DEFAULT_FOLDERS.map((f) => ({
      ...f,
      isDefault: true,
    })),
  });
}

// ============ REPORT OPERATIONS ============

export async function getAllReports() {
  return prisma.report.findMany({
    orderBy: { createdAt: 'desc' },
    include: { folder: true },
  });
}

export async function getReportById(id: string) {
  return prisma.report.findUnique({
    where: { id },
    include: { folder: true },
  });
}

async function fetchDistinctFieldValues(): Promise<string> {
  const [
    apptStatuses,
    apptReasons,
    chargeStatuses,
    eobPayerTypes,
    eobPaymentMethods,
    eobPayerNames,
    depositPayerNames,
    insuranceCompanies,
  ] = await Promise.all([
    prisma.$queryRaw<{ v: string }[]>`SELECT DISTINCT "confirmationStatus" AS v FROM "Appointment" WHERE "confirmationStatus" IS NOT NULL ORDER BY v`,
    prisma.$queryRaw<{ v: string }[]>`SELECT DISTINCT "appointmentReason" AS v FROM "Appointment" WHERE "appointmentReason" IS NOT NULL ORDER BY v`,
    prisma.$queryRaw<{ v: string }[]>`SELECT DISTINCT "status" AS v FROM "Charge" WHERE "status" IS NOT NULL ORDER BY v`,
    prisma.$queryRaw<{ v: string }[]>`SELECT DISTINCT "payerType" AS v FROM "Eob" WHERE "payerType" IS NOT NULL ORDER BY v`,
    prisma.$queryRaw<{ v: string }[]>`SELECT DISTINCT "paymentMethod" AS v FROM "Eob" WHERE "paymentMethod" IS NOT NULL ORDER BY v`,
    prisma.$queryRaw<{ v: string }[]>`SELECT DISTINCT "payerName" AS v FROM "Eob" WHERE "payerName" IS NOT NULL ORDER BY v`,
    prisma.$queryRaw<{ v: string }[]>`SELECT DISTINCT "payerName" AS v FROM "Deposit" WHERE "payerName" IS NOT NULL ORDER BY v`,
    prisma.$queryRaw<{ v: string }[]>`SELECT DISTINCT "primaryInsurancePolicyCompanyName" AS v FROM "Patient" WHERE "primaryInsurancePolicyCompanyName" IS NOT NULL ORDER BY v`,
  ]);

  const fmt = (rows: { v: string }[]) => rows.map((r) => `'${r.v}'`).join(', ') || '(none)';

  return `
Known field values (use these exact strings for equality comparisons):

Appointment.confirmationStatus: ${fmt(apptStatuses)}
Appointment.appointmentReason: ${fmt(apptReasons)}
Charge.status: ${fmt(chargeStatuses)}
Eob.payerType: ${fmt(eobPayerTypes)}
Eob.paymentMethod: ${fmt(eobPaymentMethods)}
Eob.payerName: ${fmt(eobPayerNames)}
Deposit.payerName: ${fmt(depositPayerNames)}
Patient.primaryInsurancePolicyCompanyName: ${fmt(insuranceCompanies)}

When filtering any of these fields, pick the closest matching known value. If the user's wording loosely matches (e.g. "checked out" → 'Checked Out', "pellet insertion" → the appointmentReason value containing "Pellet"), use the exact known value. If nothing closely matches, use ILIKE '%term%'.
`;
}

export async function generateQueryFromDescription(description: string): Promise<GeneratedQuery> {
  const model = process.env.OPENAI_MODEL || 'gpt-4.1-mini';

  let fieldValuesContext = '';
  try {
    fieldValuesContext = await fetchDistinctFieldValues();
  } catch (err) {
    console.warn('[reports] fetchDistinctFieldValues failed, proceeding without value hints:', err);
  }

  const completion = await openai.chat.completions.create({
    model,
    messages: [
      {
        role: 'system',
        content: SCHEMA_CONTEXT + fieldValuesContext,
      },
      {
        role: 'user',
        content: description,
      },
    ],
    response_format: { type: 'json_object' },
  });

  const content = completion.choices[0].message.content;
  if (!content) {
    throw new Error('No response from AI');
  }

  const parsed = JSON.parse(content) as GeneratedQuery;

  // Validate the generated SQL
  const validation = validateSelectOnly(parsed.sql);
  if (!validation.valid) {
    throw new Error(`Invalid query generated: ${validation.error}`);
  }

  // Ensure LIMIT clause
  parsed.sql = ensureLimitClause(parsed.sql, 500);

  return parsed;
}

export async function executeReportQuery(sql: string): Promise<any[]> {
  // Double-check validation before execution
  const validation = validateSelectOnly(sql);
  if (!validation.valid) {
    throw new Error(`Query validation failed: ${validation.error}`);
  }

  // Ensure limit
  const safeSql = ensureLimitClause(sql, 500);

  // Execute raw query
  const results = await prisma.$queryRawUnsafe(safeSql);
  return results as any[];
}

export async function createReport(input: CreateReportInput) {
  // Generate SQL from description
  const generated = await generateQueryFromDescription(input.description);

  // Execute query to get initial data
  const data = await executeReportQuery(generated.sql);

  // Use provided name or AI-suggested name
  const reportName = input.name || generated.suggestedName;

  // If no folderId provided, find Uncategorized folder
  let folderId = input.folderId;
  if (!folderId) {
    const uncategorized = await prisma.reportFolder.findFirst({
      where: { name: 'Uncategorized' },
    });
    folderId = uncategorized?.id;
  }

  return prisma.report.create({
    data: {
      name: reportName,
      description: input.description,
      sqlQuery: generated.sql,
      cachedData: data as Prisma.InputJsonValue,
      cachedAt: new Date(),
      folderId,
    },
    include: { folder: true },
  });
}

export async function updateReport(id: string, input: UpdateReportInput) {
  const report = await prisma.report.findUnique({ where: { id } });
  if (!report) {
    throw new Error('Report not found');
  }

  // If description changed, regenerate query
  let sqlQuery = report.sqlQuery;
  let cachedData: Prisma.InputJsonValue = report.cachedData as Prisma.InputJsonValue;
  let cachedAt = report.cachedAt;

  if (input.description && input.description !== report.description) {
    const generated = await generateQueryFromDescription(input.description);
    sqlQuery = generated.sql;
    cachedData = (await executeReportQuery(sqlQuery)) as Prisma.InputJsonValue;
    cachedAt = new Date();
  }

  return prisma.report.update({
    where: { id },
    data: {
      name: input.name ?? report.name,
      description: input.description ?? report.description,
      folderId: input.folderId ?? report.folderId,
      sqlQuery,
      cachedData,
      cachedAt,
    },
    include: { folder: true },
  });
}

export async function deleteReport(id: string) {
  return prisma.report.delete({
    where: { id },
  });
}

export async function runReport(id: string) {
  const report = await prisma.report.findUnique({ where: { id } });
  if (!report) {
    throw new Error('Report not found');
  }

  // Re-execute query
  const data = await executeReportQuery(report.sqlQuery);

  // Update cache
  return prisma.report.update({
    where: { id },
    data: {
      cachedData: data as Prisma.InputJsonValue,
      cachedAt: new Date(),
    },
    include: { folder: true },
  });
}

export async function duplicateReport(id: string) {
  const report = await prisma.report.findUnique({ where: { id } });
  if (!report) {
    throw new Error('Report not found');
  }

  return prisma.report.create({
    data: {
      name: `${report.name} (Copy)`,
      description: report.description,
      sqlQuery: report.sqlQuery,
      cachedData: report.cachedData as Prisma.InputJsonValue,
      cachedAt: report.cachedAt,
      folderId: report.folderId,
    },
    include: { folder: true },
  });
}

// ============ TEMPLATES ============

export const REPORT_TEMPLATES = [
  {
    id: 'annual-recall',
    label: 'Annual Recall',
    description: 'Patients seen in 2025 who do not have a 2026 appointment scheduled',
  },
  {
    id: 'no-future-appointment',
    label: 'No Future Appointment',
    description: 'Patients with appointments in the past 12 months but no future appointments',
  },
  {
    id: 'inactive-patients',
    label: 'Inactive Patients',
    description: 'Patients who have not been seen in the last 90 days',
  },
  {
    id: 'new-patients-this-month',
    label: 'New Patients This Month',
    description: 'Patients whose first appointment was within the current month',
  },
];

export function getTemplates() {
  return REPORT_TEMPLATES;
}
