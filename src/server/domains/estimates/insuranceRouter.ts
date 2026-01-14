import express from 'express';

const insuranceRouter = express.Router();

insuranceRouter.get('/', async (req, res) => {    
  const getAvailityToken = async () => {

    // AVAILITY CREDENTIALS
    const availityUrl = 'https://api.availity.com/availity/v1/token';
    const clientId = process.env.CLIENT_ID;
    const clientSecret = process.env.CLIENT_SECRET;
    
    try {
    // FETCH A VALID AVAILITY TOKEN
      const response = await fetch(availityUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: clientId,
          client_secret: clientSecret,
          scope: 'hipaa',
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Token request failed:', response.status, errorText);
        throw new Error(`Token request failed: ${response.status}`);
          }

      const data = await response.json();
      console.log('Token received successfully');

      // USE TOKEN TO FETCH ESTIMATE
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
          birthDate: '1978-03-29', // yyyy-mm-dd
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
    })

    if (!estimateResponse.ok) {
        const errorText = await estimateResponse.text();
        console.error('Estimate request failed:', estimateResponse.status, errorText);
        throw new Error(`Estimate request failed: ${estimateResponse.status}`);      }
    
        const estimateResult = await estimateResponse.json();
        console.log('Estimate result:', estimateResult);
        
        // Return both token and estimate result
        return {
          token: data.access_token,
          estimate: estimateResult
        };
    } catch (error) {
        console.error('Error in getAvailityToken:', error);
        throw error; // Re-throw so the caller can handle it
    }
  };

  const token = await getAvailityToken();





  console.log({token})
  return res.status(200).json({ token: token });
});

export default insuranceRouter;
