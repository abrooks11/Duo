# Feature Goal: 
    - Currently Duo gets database updates by ingesting different excel reports. Since the database is relational, Duo can pull data from different data tables to compose the full patient picture. 

    Ultimately I want to use the Tebra API to update ny database. 
    
    For right now, I want to see if it's feasible to fetch appointment and patient data from tebra. 

    I've attempted to do this in the past and got stuck because I'm not familiar with XML and SOAP API

# Success: 
- Successful fetch of bulk appointments 


# Credentials
- located in .env

# TEBRA

## Resources
API FAQ - https://helpme.tebra.com/Tebra_PM/12_API_and_Integration/19_API_FAQs

API Integration Technical Guide - https://kareocustomertraining.s3.amazonaws.com/Help%20Center/Guides/Tebra%20API%20Integration%20Technical%20Guide.pdf

## API Functions 
The Tebra API offers a number of different functions to interact with the Tebra system data. Retrieving data from different types of records in Tebra:
- Appointment (single)
- Appointments (bulk)
- Charges
- Patient (single)
- Patients (bulk)
- Payments