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
          SOAPAction: '""', // Empty SOAPAction
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
};

export default tebraController;
