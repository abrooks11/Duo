# Tebra SOAP API Conventions

When building or modifying Tebra SOAP API fetch functions in `tebraApi.ts`, follow these patterns exactly.

## Architecture

All Tebra SOAP calls live in `src/server/domains/tebra-api/tebraApi.ts`. The module provides:
- `buildRequestHeader()` — injects auth creds from env vars. Always use this, never hardcode credentials.
- `soapPost(action, envelope)` — sends the SOAP request with the correct `SOAPAction` header (`http://www.kareo.com/api/schemas/KareoServices/{action}`)
- `parser` — shared `XMLParser` instance (fast-xml-parser, `ignoreAttributes: false, removeNSPrefix: true`)

## Fetch Function Template

Every `fetch{Entity}` function follows this structure:

```typescript
export async function fetch{Entity}(fromDate: string, toDate: string): Promise<any[]> {
  const envelope = `<?xml version="1.0" encoding="utf-8"?>
<soapenv:Envelope
  xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
  xmlns:sch="http://www.kareo.com/api/schemas/">
  <soapenv:Header/>
  <soapenv:Body>
    <sch:Get{Entity}>
      <sch:request>
        ${buildRequestHeader()}
        <sch:Fields>
          <!-- Selected fields with value "true" -->
        </sch:Fields>
        <sch:Filter>
          <!-- Filter criteria -->
        </sch:Filter>
      </sch:request>
    </sch:Get{Entity}>
  </soapenv:Body>
</soapenv:Envelope>`;

  const rawXml = await soapPost('Get{Entity}', envelope);
  const parsed = parser.parse(rawXml);
  const result = parsed?.Envelope?.Body?.Get{Entity}Response?.Get{Entity}Result;

  if (!result) throw new Error('Could not locate Get{Entity}Result in response');
  if (result.ErrorResponse?.IsError === true || result.ErrorResponse?.IsError === 'true') {
    throw new Error(`Tebra API error: ${result.ErrorResponse.ErrorMessage}`);
  }

  const items = result?.{Entity}?.{Entity}Data;
  if (!items) return [];
  return Array.isArray(items) ? items : [items];
}
```

**Response path pattern:** `Envelope.Body.Get{Entity}Response.Get{Entity}Result.{Entity}.{Entity}Data`

**Single-result handling:** Tebra returns a bare object (not an array) when there's exactly one result. Always normalize: `Array.isArray(items) ? items : [items]`

## Known Pitfalls

1. **DO NOT use the `Amount` filter on GetPayments** — it silently blocks all results. Filter amounts in code instead.
2. **Empty placeholder records** — When Tebra finds no matching records, it returns a single `{Entity}Data` with empty string fields (e.g., `ID === ''`). Filter these out: `filter(r => r.ID && String(r.ID).trim() !== '')`
3. **Zero-amount filtering** — For payment/EOB queries, filter `Number(r.Amount) > 0` in code after fetching.
4. **Fields and Filters must be in alphabetical order** — Tebra's SOAP schema is order-sensitive. Reference the templates in `SOAP-header-templates/` for the correct field/filter ordering per entity.

## Available Fields & Filters Per Entity

The complete list of available fields and filters for each entity, in the required alphabetical order, is defined in `SOAP-header-templates/`. Always reference these files when selecting fields or filters:

| Entity | Template File | SOAP Action | Response Collection Key |
|--------|--------------|-------------|------------------------|
| Appointments | `SOAP-header-templates/appointments.js` | `GetAppointments` | `Appointments.AppointmentData` |
| Charges | `SOAP-header-templates/charges.js` | `GetCharges` | `Charges.ChargeData` |
| Patients | `SOAP-header-templates/patients.js` | `GetPatients` | `Patients.PatientData` |
| Payments | `SOAP-header-templates/payments.js` | `GetPayments` | `Payments.PaymentData` |

## Field Selection

- Set desired fields to `true` in the `<sch:Fields>` block — only fields set to `true` are returned
- Keep fields alphabetically ordered to match the SOAP schema
- Only request fields you actually need to minimize payload size

## Common Filter Patterns

- **Date range:** `FromCreatedDate` / `ToCreatedDate` (format: `YYYY-MM-DD`)
- **Practice scoping:** `PracticeName` set to `process.env.TEBRA_PRACTICE_NAME`
- **Appointments type:** `Type` set to `Patient` (filters out non-patient appointment types)
- **Payment payer type:** `PayerType` set to `Insurance` or `Patient`

## Sync Functions

Sync logic lives in `tebraSync.ts`, not in `tebraApi.ts`. Sync functions:
- Call the fetch function from `tebraApi.ts`
- Upsert results into Prisma using the shared instance from `src/server/prisma.ts`
- On UPDATE: never overwrite user-edited fields (e.g., `notes`, `insEligibility`, `patientCopay` on appointments)
- Skip records whose referenced entities don't exist locally (e.g., skip appointments for patients not in DB)
