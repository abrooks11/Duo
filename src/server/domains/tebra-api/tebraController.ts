import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

import { parseStringPromise } from 'xml2js';
import { syncAppointments } from './tebraSync.ts';
import { AppError, handleControllerError, sendSuccess, sendError } from '../../shared/errorHandlers.js';
import { createChildLogger } from '../../shared/logger.js';

const log = createChildLogger('tebra');

const tebraController = {
  testTebraApi: async (req, res, next) => {
    try {
      log.debug('testTebraApi middleware called');

      const tebraInfo = {
        url: process.env.TEBRA_API_URL,
        customerKey: process.env.TEBRA_CUSTOMER_KEY,
        user: process.env.TEBRA_USER_ID,
        password: process.env.TEBRA_PASSWORD,
      };

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

      log.debug({ status: response.status }, 'Tebra test response');

      const xmlResponse = await response.text();

      if (xmlResponse && xmlResponse.trim().length > 0) {
        const parsedData = await parseStringPromise(xmlResponse);
        log.debug('Tebra test: parsed response successfully');
        return sendSuccess(res, parsedData);
      }

      return next();
    } catch (error) {
      handleControllerError(error, 'testTebraApi', next, 'Tebra API test request failed');
    }
  },

  getAppointments: async (req, res, next) => {
    try {
      log.debug('getAppointments middleware called');

      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        return next(new AppError('startDate and endDate query parameters are required', 400, 'Missing date range parameters'));
      }

      const tebraInfo = {
        url: process.env.TEBRA_API_URL,
        customerKey: process.env.TEBRA_CUSTOMER_KEY,
        user: process.env.TEBRA_USER_ID,
        password: process.env.TEBRA_PASSWORD,
      };

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

      log.debug({ startDate, endDate }, 'Sending SOAP request for date range');

      const response = await fetch(tebraInfo.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/xml; charset=utf-8',
          SOAPAction: 'http://www.kareo.com/api/schemas/KareoServices/GetAppointments',
        },
        body: xmlRequest,
      });

      log.debug({ status: response.status }, 'Tebra appointments response');

      const xmlResponse = await response.text();

      if (xmlResponse && xmlResponse.trim().length > 0) {
        if (xmlResponse.includes('<s:Fault>')) {
          log.error('SOAP Fault detected in response');
          return next(new AppError('SOAP fault returned from Tebra API', 500, `SOAP Fault: ${xmlResponse}`));
        }

        const parsedData = await parseStringPromise(xmlResponse);
        log.debug('Parsed appointments data successfully');
        return sendSuccess(res, parsedData);
      }

      return next(new AppError('Empty response from Tebra API', 500, 'Received empty XML response'));
    } catch (error) {
      handleControllerError(error, 'getAppointments', next, 'Tebra getAppointments request failed');
    }
  },

  syncAppointments: async (req, res, next) => {
    try {
      const { startDate, endDate } = req.body;

      if (!startDate || !endDate) {
        return sendError(res, 'startDate and endDate are required in the request body (YYYY-MM-DD)', 400);
      }

      const result = await syncAppointments(startDate, endDate);
      return sendSuccess(res, result);
    } catch (error) {
      handleControllerError(error, 'syncAppointments', next, 'Tebra sync failed');
    }
  },
};

export default tebraController;
