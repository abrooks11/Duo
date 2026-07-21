import express from 'express';
import { sendSuccess, asyncHandler } from '../../shared/errorHandlers.js';
import { createChildLogger } from '../../shared/logger.js';

const log = createChildLogger('insurance');
const insuranceRouter = express.Router();

insuranceRouter.get('/', asyncHandler(async (_req, res) => {
  const getAvailityToken = async () => {
    const availityUrl = 'https://api.availity.com/availity/v1/token';
    const clientId = process.env.CLIENT_ID;
    const clientSecret = process.env.CLIENT_SECRET;

    const response = await fetch(availityUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: clientId ?? '',
        client_secret: clientSecret ?? '',
        scope: 'hipaa',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      log.error({ status: response.status }, `Token request failed: ${errorText}`);
      throw new Error(`Token request failed: ${response.status}`);
    }

    const data = await response.json() as { access_token: string };
    log.info('Availity token received successfully');

    const requestBody = {
      requestTypeCode: 'PRE_DETERMINATION',
      payer: {
        id: 'BCBSF'
      },
      billingProvider: {
        npi: '1578528451'
      },
      subscriber: {
        memberId: 'ZGP848227951'
      },
      patient: {
        lastName: 'WEATHERSBY',
        firstName: 'RICHESHA',
        birthDate: '1978-03-29',
        gender: 'F'
      },
      serviceLines: [{
        procedureCode: '99213',
        serviceFromDate: '2025-07-10',
        quantity: '1',
        amount: '400.00'
      }],
      diagnoses: [{
        qualifier: 'ABK',
        code: 'R10.2'
      }]
    };

    const estimateResponse = await fetch('https://api.availity.com/availity/development-partner/v1/professional-claims', {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${data.access_token}`,
        'accept': 'application/json',
        'content-type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!estimateResponse.ok) {
      const errorText = await estimateResponse.text();
      log.error({ status: estimateResponse.status }, `Estimate request failed: ${errorText}`);
      throw new Error(`Estimate request failed: ${estimateResponse.status}`);
    }

    const estimateResult = await estimateResponse.json() as unknown;
    log.debug('Estimate result received');

    return {
      token: data.access_token,
      estimate: estimateResult
    };
  };

  const result = await getAvailityToken();
  return sendSuccess(res, result);
}));

export default insuranceRouter;
