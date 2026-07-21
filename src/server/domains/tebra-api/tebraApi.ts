import { XMLParser } from 'fast-xml-parser';

const API_URL = process.env.TEBRA_API_URL;
const parser = new XMLParser({ ignoreAttributes: false, removeNSPrefix: true });

/**
 * Parse a Tebra SOAP datetime string into a JS Date.
 * Input: "2/24/2026 11:00:00 AM"
 */
export function parseSoapDateTime(str: unknown): Date {
  return new Date(String(str));
}

function buildRequestHeader(): string {
  return `<sch:RequestHeader>
          <sch:ClientVersion></sch:ClientVersion>
          <sch:CustomerKey>${process.env.TEBRA_CUSTOMER_KEY}</sch:CustomerKey>
          <sch:Password>${process.env.TEBRA_PASSWORD}</sch:Password>
          <sch:User>${process.env.TEBRA_USER_ID}</sch:User>
        </sch:RequestHeader>`;
}

async function soapPost(action: string, body: string): Promise<string> {
  const response = await fetch(API_URL!, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/xml; charset=utf-8',
      SOAPAction: `http://www.kareo.com/api/schemas/KareoServices/${action}`,
    },
    body,
    signal: AbortSignal.timeout(30_000),
  });
  return response.text();
}

/**
 * Fetch appointments from Tebra for the given date range.
 * @param fromDate - "YYYY-MM-DD"
 * @param toDate   - "YYYY-MM-DD"
 * @returns Array of AppointmentData objects
 */
export async function fetchAppointments(
  fromDate: string,
  toDate: string
): Promise<any[]> {
  const envelope = `<?xml version="1.0" encoding="utf-8"?>
<soapenv:Envelope
  xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
  xmlns:sch="http://www.kareo.com/api/schemas/">
  <soapenv:Header/>
  <soapenv:Body>
    <sch:GetAppointments>
      <sch:request>
        ${buildRequestHeader()}
        <sch:Fields>
          <sch:AppointmentDuration>true</sch:AppointmentDuration>
          <sch:AppointmentReason1>true</sch:AppointmentReason1>
          <sch:ConfirmationStatus>true</sch:ConfirmationStatus>
          <sch:CreatedDate>true</sch:CreatedDate>
          <sch:EndDate>true</sch:EndDate>
          <sch:ID>true</sch:ID>
          <sch:LastModifiedDate>true</sch:LastModifiedDate>
          <sch:Notes>true</sch:Notes>
          <sch:PatientCaseID>true</sch:PatientCaseID>
          <sch:PatientCaseName>true</sch:PatientCaseName>
          <sch:PatientFullName>true</sch:PatientFullName>
          <sch:PatientID>true</sch:PatientID>
          <sch:StartDate>true</sch:StartDate>
          <sch:Type>true</sch:Type>
        </sch:Fields>
        <sch:Filter>
          <sch:EndDate>${toDate}</sch:EndDate>
          <sch:PracticeName>${process.env.TEBRA_PRACTICE_NAME}</sch:PracticeName>
          <sch:StartDate>${fromDate}</sch:StartDate>
          <sch:Type>Patient</sch:Type>
        </sch:Filter>
      </sch:request>
    </sch:GetAppointments>
  </soapenv:Body>
</soapenv:Envelope>`;

  const rawXml = await soapPost('GetAppointments', envelope);
  const parsed = parser.parse(rawXml);
  const result =
    parsed?.Envelope?.Body?.GetAppointmentsResponse?.GetAppointmentsResult;

  if (!result)
    throw new Error('Could not locate GetAppointmentsResult in response');
  if (
    result.ErrorResponse?.IsError === true ||
    result.ErrorResponse?.IsError === 'true'
  ) {
    throw new Error(`Tebra API error: ${result.ErrorResponse.ErrorMessage}`);
  }

  const appointments = result?.Appointments?.AppointmentData;
  if (!appointments) return [];
  return Array.isArray(appointments) ? appointments : [appointments];
}

/**
 * Fetch patient payments from Tebra for the given date range.
 * @param fromDate - "YYYY-MM-DD"
 * @param toDate   - "YYYY-MM-DD"
 * @returns Array of PaymentData objects
 */
export async function fetchPayments(
  fromDate: string,
  toDate: string
): Promise<any[]> {
  const envelope = `<?xml version="1.0" encoding="utf-8"?>
<soapenv:Envelope
  xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
  xmlns:sch="http://www.kareo.com/api/schemas/">
  <soapenv:Header/>
  <soapenv:Body>
    <sch:GetPayments>
      <sch:request>
        ${buildRequestHeader()}
        <sch:Fields>
          <sch:Amount>true</sch:Amount>
          <sch:CreatedDate>true</sch:CreatedDate>
          <sch:ID>true</sch:ID>
          <sch:PayerName>true</sch:PayerName>
          <sch:PayerType>true</sch:PayerType>
          <sch:PaymentMethod>true</sch:PaymentMethod>
        </sch:Fields>
        <sch:Filter>
          <sch:FromCreatedDate>${fromDate}</sch:FromCreatedDate>
          <sch:PayerType>Patient</sch:PayerType>
          <sch:ToCreatedDate>${toDate}</sch:ToCreatedDate>
        </sch:Filter>
      </sch:request>
    </sch:GetPayments>
  </soapenv:Body>
</soapenv:Envelope>`;

  const rawXml = await soapPost('GetPayments', envelope);
  const parsed = parser.parse(rawXml);
  const result = parsed?.Envelope?.Body?.GetPaymentsResponse?.GetPaymentsResult;

  if (!result)
    throw new Error('Could not locate GetPaymentsResult in response');
  if (
    result.ErrorResponse?.IsError === true ||
    result.ErrorResponse?.IsError === 'true'
  ) {
    throw new Error(`Tebra API error: ${result.ErrorResponse.ErrorMessage}`);
  }

  const payments = result?.Payments?.PaymentData;
  if (!payments) return [];
  return Array.isArray(payments) ? payments : [payments];
}

/**
 * Fetch insurance EOBs from Tebra for the given date range.
 * Filters: PayerType = Insurance, Amount > 0.
 * @param fromDate - "YYYY-MM-DD"
 * @param toDate   - "YYYY-MM-DD"
 * @returns Array of PaymentData objects (insurance EOBs)
 */
export async function fetchInsuranceEobs(
  fromDate: string,
  toDate: string
): Promise<any[]> {
  const envelope = `<?xml version="1.0" encoding="utf-8"?>
<soapenv:Envelope
  xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
  xmlns:sch="http://www.kareo.com/api/schemas/">
  <soapenv:Header/>
  <soapenv:Body>
    <sch:GetPayments>
      <sch:request>
        ${buildRequestHeader()}
        <sch:Fields>
          <sch:Amount>true</sch:Amount>
          <sch:CreatedDate>true</sch:CreatedDate>
          <sch:ID>true</sch:ID>
          <sch:LastModifiedDate>true</sch:LastModifiedDate>
          <sch:PayerName>true</sch:PayerName>
          <sch:PayerType>true</sch:PayerType>
          <sch:PaymentMethod>true</sch:PaymentMethod>
          <sch:ReferenceNumber>true</sch:ReferenceNumber>
        </sch:Fields>
        <sch:Filter>
          <sch:FromCreatedDate>${fromDate}</sch:FromCreatedDate>
          <sch:PayerType>Insurance</sch:PayerType>
          <sch:ToCreatedDate>${toDate}</sch:ToCreatedDate>
        </sch:Filter>
      </sch:request>
    </sch:GetPayments>
  </soapenv:Body>
</soapenv:Envelope>`;

  console.log(
    `[DEBUG fetchInsuranceEobs] Requesting EOBs from ${fromDate} to ${toDate}`
  );
  const rawXml = await soapPost('GetPayments', envelope);
  console.log(`[DEBUG fetchInsuranceEobs] Raw XML length: ${rawXml.length}`);
  console.log(
    `[DEBUG fetchInsuranceEobs] Raw XML preview: ${rawXml.substring(0, 500)}`
  );
  const parsed = parser.parse(rawXml);
  const result = parsed?.Envelope?.Body?.GetPaymentsResponse?.GetPaymentsResult;

  console.log(
    `[DEBUG fetchInsuranceEobs] result keys:`,
    result ? Object.keys(result) : 'null'
  );
  console.log(
    `[DEBUG fetchInsuranceEobs] ErrorResponse:`,
    result?.ErrorResponse
  );
  console.log(
    `[DEBUG fetchInsuranceEobs] Payments keys:`,
    result?.Payments ? Object.keys(result.Payments) : 'null/undefined'
  );

  if (!result)
    throw new Error('Could not locate GetPaymentsResult in response');
  if (
    result.ErrorResponse?.IsError === true ||
    result.ErrorResponse?.IsError === 'true'
  ) {
    throw new Error(`Tebra API error: ${result.ErrorResponse.ErrorMessage}`);
  }

  const payments = result?.Payments?.PaymentData;
  if (!payments) return [];
  const arr = Array.isArray(payments) ? payments : [payments];
  // Filter out empty placeholder records Tebra returns when there are no results
  // Filter out empty placeholder records and zero-amount entries
  const filtered = arr.filter(
    (p: any) => p.ID && String(p.ID).trim() !== '' && Number(p.Amount) > 0
  );
  console.log(
    `[DEBUG fetchInsuranceEobs] Raw count: ${arr.length}, after filtering empty: ${filtered.length}`
  );
  // Show distinct PayerType values and counts
  const payerTypes: Record<string, number> = {};
  filtered.forEach((p: any) => {
    const pt = String(p.PayerType ?? 'null');
    payerTypes[pt] = (payerTypes[pt] || 0) + 1;
  });
  console.log(`[DEBUG fetchInsuranceEobs] PayerType breakdown:`, payerTypes);
  if (filtered.length > 0) {
    console.log(
      `[DEBUG fetchInsuranceEobs] First record sample:`,
      JSON.stringify(filtered[0]).substring(0, 500)
    );
  }
  return filtered;
}

/**
 * Fetch patients from Tebra for the given date range.
 * @param fromDate - "YYYY-MM-DD"
 * @param toDate   - "YYYY-MM-DD"
 * @returns Array of PatientData objects
 */
export async function fetchPatients(
  fromDate: string,
  toDate: string
): Promise<any[]> {
  const envelope = `<?xml version="1.0" encoding="utf-8"?>
<soapenv:Envelope
  xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
  xmlns:sch="http://www.kareo.com/api/schemas/">
  <soapenv:Header/>
  <soapenv:Body>
    <sch:GetPatients>
      <sch:request>
        ${buildRequestHeader()}
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
          <sch:FromLastModifiedDate>${fromDate}</sch:FromLastModifiedDate>
          <sch:PracticeName>${process.env.TEBRA_PRACTICE_NAME}</sch:PracticeName>
          <sch:ToLastModifiedDate>${toDate}</sch:ToLastModifiedDate>
        </sch:Filter>
      </sch:request>
    </sch:GetPatients>
  </soapenv:Body>
</soapenv:Envelope>`;

  const rawXml = await soapPost('GetPatients', envelope);
  const parsed = parser.parse(rawXml);
  const result = parsed?.Envelope?.Body?.GetPatientsResponse?.GetPatientsResult;

  if (!result)
    throw new Error('Could not locate GetPatientsResult in response');
  if (
    result.ErrorResponse?.IsError === true ||
    result.ErrorResponse?.IsError === 'true'
  ) {
    throw new Error(`Tebra API error: ${result.ErrorResponse.ErrorMessage}`);
  }

  const patients = result?.Patients?.PatientData;
  if (!patients) return [];
  return Array.isArray(patients) ? patients : [patients];
}

/**
 * Fetch balance data for patients created within a given year from Tebra.
 * Scoped to the practice; returns only patients with at least one non-zero balance.
 * @param fromDate - "YYYY-MM-DD"
 * @param toDate   - "YYYY-MM-DD"
 * @returns Array of PatientData objects with balance fields
 */
export async function fetchPatientBalances(
  fromDate: string,
  toDate: string
): Promise<any[]> {
  const envelope = `<?xml version="1.0" encoding="utf-8"?>
<soapenv:Envelope
  xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
  xmlns:sch="http://www.kareo.com/api/schemas/">
  <soapenv:Header/>
  <soapenv:Body>
    <sch:GetPatients>
      <sch:request>
        ${buildRequestHeader()}
        <sch:Fields>
          <sch:Active>true</sch:Active>
          <sch:ID>true</sch:ID>
          <sch:InsuranceBalance>true</sch:InsuranceBalance>
          <sch:LastModifiedDate>true</sch:LastModifiedDate>
          <sch:PatientBalance>true</sch:PatientBalance>
          <sch:PatientFullName>true</sch:PatientFullName>
          <sch:TotalBalance>true</sch:TotalBalance>
        </sch:Fields>
        <sch:Filter>
          <sch:FromCreatedDate>${fromDate}</sch:FromCreatedDate>
          <sch:PracticeName>${process.env.TEBRA_PRACTICE_NAME}</sch:PracticeName>
          <sch:ToCreatedDate>${toDate}</sch:ToCreatedDate>
        </sch:Filter>
      </sch:request>
    </sch:GetPatients>
  </soapenv:Body>
</soapenv:Envelope>`;

  const rawXml = await soapPost('GetPatients', envelope);
  const parsed = parser.parse(rawXml);
  const result = parsed?.Envelope?.Body?.GetPatientsResponse?.GetPatientsResult;

  if (!result)
    throw new Error('Could not locate GetPatientsResult in response');
  if (
    result.ErrorResponse?.IsError === true ||
    result.ErrorResponse?.IsError === 'true'
  ) {
    throw new Error(`Tebra API error: ${result.ErrorResponse.ErrorMessage}`);
  }

  const patients = result?.Patients?.PatientData;
  if (!patients) return [];
  const arr = Array.isArray(patients) ? patients : [patients];
  return arr.filter(
    (p: any) =>
      p.ID &&
      String(p.ID).trim() !== '' &&
      (Number(p.InsuranceBalance) > 0 ||
        Number(p.PatientBalance) > 0 ||
        Number(p.TotalBalance) > 0)
  );
}

/**
 * Fetch charges from Tebra for the given date range.
 * @param fromDate - "YYYY-MM-DD"
 * @param toDate   - "YYYY-MM-DD"
 * @returns Array of ChargeData objects
 */
export async function fetchCharges(
  fromDate: string,
  toDate: string
): Promise<any[]> {
  const envelope = `<?xml version="1.0" encoding="utf-8"?>
<soapenv:Envelope
  xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
  xmlns:sch="http://www.kareo.com/api/schemas/">
  <soapenv:Header/>
  <soapenv:Body>
    <sch:GetCharges>
      <sch:request>
        ${buildRequestHeader()}
        <sch:Fields>
          <sch:BilledTo>true</sch:BilledTo>
          <sch:CaseName>true</sch:CaseName>
          <sch:CreatedDate>true</sch:CreatedDate>
          <sch:ID>true</sch:ID>
          <sch:PatientID>true</sch:PatientID>
          <sch:PatientName>true</sch:PatientName>
          <sch:PrimaryInsurancePlanName>true</sch:PrimaryInsurancePlanName>
          <sch:ProcedureCode>true</sch:ProcedureCode>
          <sch:ProcedureName>true</sch:ProcedureName>
          <sch:ServiceEndDate>true</sch:ServiceEndDate>
          <sch:ServiceStartDate>true</sch:ServiceStartDate>
        </sch:Fields>
        <sch:Filter>
          <sch:FromCreatedDate>${fromDate}</sch:FromCreatedDate>
          <sch:ToCreatedDate>${toDate}</sch:ToCreatedDate>
        </sch:Filter>
      </sch:request>
    </sch:GetCharges>
  </soapenv:Body>
</soapenv:Envelope>`;

  const rawXml = await soapPost('GetCharges', envelope);
  const parsed = parser.parse(rawXml);
  const result = parsed?.Envelope?.Body?.GetChargesResponse?.GetChargesResult;

  if (!result) throw new Error('Could not locate GetChargesResult in response');
  if (
    result.ErrorResponse?.IsError === true ||
    result.ErrorResponse?.IsError === 'true'
  ) {
    throw new Error(`Tebra API error: ${result.ErrorResponse.ErrorMessage}`);
  }

  const charges = result?.Charges?.ChargeData;
  if (!charges) return [];
  return Array.isArray(charges) ? charges : [charges];
}
