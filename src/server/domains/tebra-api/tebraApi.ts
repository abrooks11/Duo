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
  });
  return response.text();
}

/**
 * Fetch appointments from Tebra for the given date range.
 * @param fromDate - "YYYY-MM-DD"
 * @param toDate   - "YYYY-MM-DD"
 * @returns Array of AppointmentData objects
 */
export async function fetchAppointments(fromDate: string, toDate: string): Promise<any[]> {
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
  const result = parsed?.Envelope?.Body?.GetAppointmentsResponse?.GetAppointmentsResult;

  if (!result) throw new Error('Could not locate GetAppointmentsResult in response');
  if (result.ErrorResponse?.IsError === true || result.ErrorResponse?.IsError === 'true') {
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
export async function fetchPayments(fromDate: string, toDate: string): Promise<any[]> {
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

  if (!result) throw new Error('Could not locate GetPaymentsResult in response');
  if (result.ErrorResponse?.IsError === true || result.ErrorResponse?.IsError === 'true') {
    throw new Error(`Tebra API error: ${result.ErrorResponse.ErrorMessage}`);
  }

  const payments = result?.Payments?.PaymentData;
  if (!payments) return [];
  return Array.isArray(payments) ? payments : [payments];
}

/**
 * Fetch charges from Tebra for the given date range.
 * @param fromDate - "YYYY-MM-DD"
 * @param toDate   - "YYYY-MM-DD"
 * @returns Array of ChargeData objects
 */
export async function fetchCharges(fromDate: string, toDate: string): Promise<any[]> {
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
  if (result.ErrorResponse?.IsError === true || result.ErrorResponse?.IsError === 'true') {
    throw new Error(`Tebra API error: ${result.ErrorResponse.ErrorMessage}`);
  }

  const charges = result?.Charges?.ChargeData;
  if (!charges) return [];
  return Array.isArray(charges) ? charges : [charges];
}
