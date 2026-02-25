import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

import { parseStringPromise } from 'xml2js';

const tebraController = {
  testTebraApi: async (req, res, next) => {
    try {
      console.log('testTebraApi middleware');

      const tebraInfo = {
        url: process.env.TEBRA_API_URL,
        customerKey: process.env.TEBRA_CUSTOMER_KEY,
        user: process.env.TEBRA_USER_ID,
        password: process.env.TEBRA_PASSWORD,
      };

      // SOAP request without SOAPAction - WCF often uses message-based routing
      const xmlRequest = `<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
  <s:Body>
    <GetPractices xmlns="http://www.kareo.com/api/schemas/2.1/">
      <request>
        <RequestHeader>
          <CustomerKey>${tebraInfo.customerKey}</CustomerKey>
          <User>${tebraInfo.user}</User>
          <Password>${tebraInfo.password}</Password>
        </RequestHeader>
      </request>
    </GetPractices>
  </s:Body>
</s:Envelope>`;

      const response = await fetch(tebraInfo.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/xml; charset=utf-8',
          SOAPAction: 'http://www.kareo.com/api/schemas/KareoServices/GetPractices',
        },
        body: xmlRequest,
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers));

      const xmlResponse = await response.text();
      console.log('Raw XML response:', xmlResponse);

      if (xmlResponse && xmlResponse.trim().length > 0) {
        const parsedData = await parseStringPromise(xmlResponse);
        console.log('parsedData:', JSON.stringify(parsedData, null, 2));

        // Send parsed data to client
        return res.json({ success: true, data: parsedData });
      }

      return next();
    } catch (error) {
      next({
        status: 500,
        message: { err: 'Error: testTebraApi Request failed' }, // message to client
        log: `Error in tebraController: ${error}`, // log to server
      });
    }
  },

  getAppointments: async (req, res, next) => {
    try {
      console.log('getAppointments middleware');

      const { startDate, endDate } = req.query;

      // Validate date parameters
      if (!startDate || !endDate) {
        return next({
          status: 400,
          message: { err: 'startDate and endDate query parameters are required' },
          log: 'Missing date range parameters in getAppointments',
        });
      }

      const tebraInfo = {
        url: process.env.TEBRA_API_URL,
        customerKey: process.env.TEBRA_CUSTOMER_KEY,
        user: process.env.TEBRA_USER_ID,
        password: process.env.TEBRA_PASSWORD,
      };

      // Construct SOAP envelope for GetAppointments
      const xmlRequest = `<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
  <s:Body>
    <GetAppointments xmlns="http://www.kareo.com/api/schemas/2.1/">
      <request>
        <RequestHeader>
          <CustomerKey>${tebraInfo.customerKey}</CustomerKey>
          <User>${tebraInfo.user}</User>
          <Password>${tebraInfo.password}</Password>
        </RequestHeader>
        <Fields>
          <ID>true</ID>
          <PatientID>true</PatientID>
          <PatientFullName>true</PatientFullName>
          <StartDate>true</StartDate>
          <EndDate>true</EndDate>
          <ConfirmationStatus>true</ConfirmationStatus>
          <AppointmentReason1>true</AppointmentReason1>
          <ResourceName1>true</ResourceName1>
          <Notes>true</Notes>
          <CreatedDate>true</CreatedDate>
          <LastModifiedDate>true</LastModifiedDate>
          <PracticeName>true</PracticeName>
          <ServiceLocationName>true</ServiceLocationName>
          <Type>true</Type>
        </Fields>
        <Filter>
          <StartDate>${startDate}</StartDate>
          <EndDate>${endDate}</EndDate>
        </Filter>
      </request>
    </GetAppointments>
  </s:Body>
</s:Envelope>`;

      console.log('Sending SOAP request for date range:', { startDate, endDate });
      console.log('XML Request:', xmlRequest);

      const response = await fetch(tebraInfo.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/xml; charset=utf-8',
          SOAPAction: 'http://www.kareo.com/api/schemas/KareoServices/GetAppointments',
        },
        body: xmlRequest,
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers));

      const xmlResponse = await response.text();
      console.log('Raw XML response:', xmlResponse);

      if (xmlResponse && xmlResponse.trim().length > 0) {
        // Check for SOAP fault
        if (xmlResponse.includes('<s:Fault>')) {
          console.error('SOAP Fault detected in response');
          return next({
            status: 500,
            message: { err: 'SOAP fault returned from Tebra API' },
            log: `SOAP Fault: ${xmlResponse}`,
          });
        }

        const parsedData = await parseStringPromise(xmlResponse);
        console.log('Parsed appointments data:', JSON.stringify(parsedData, null, 2));

        // Send parsed data to client
        return res.json({ success: true, data: parsedData });
      }

      return next({
        status: 500,
        message: { err: 'Empty response from Tebra API' },
        log: 'Received empty XML response',
      });
    } catch (error) {
      next({
        status: 500,
        message: { err: 'Error: getAppointments Request failed' },
        log: `Error in getAppointments: ${error}`,
      });
    }
  },
};

export default tebraController;
