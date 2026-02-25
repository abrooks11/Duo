<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sch="http://www.kareo.com/api/schemas/">
   <soapenv:Header/>
   <soapenv:Body>
      <sch:GetCharges>
         {/* <!--Optional:--> */}
         <sch:request>
            <sch:RequestHeader>
               {/* <!--Optional:--> */}
               <sch:ClientVersion>?</sch:ClientVersion>
               {/* <!--Optional:--> */}
               <sch:CustomerKey>?</sch:CustomerKey>
               {/* <!--Optional:--> */}
               <sch:Password>?</sch:Password>
               {/* <!--Optional:--> */}
               <sch:User>?</sch:User>
            </sch:RequestHeader>
            <sch:Fields>
               {/* <!--Optional:--> */}
               <sch:AdjustedCharges>?</sch:AdjustedCharges>
               {/* <!--Optional:--> */}
               <sch:AllowedAmount>?</sch:AllowedAmount>
               {/* <!--Optional:--> */}
               <sch:AppointmentID>?</sch:AppointmentID>
               {/* <!--Optional:--> */}
               <sch:BatchNumber>?</sch:BatchNumber>
               {/* <!--Optional:--> */}
               <sch:BilledTo>?</sch:BilledTo>
               {/* <!--Optional:--> */}
               <sch:CaseName>?</sch:CaseName>
               {/* <!--Optional:--> */}
               <sch:CasePayerScenario>?</sch:CasePayerScenario>
               {/* <!--Optional:--> */}
               <sch:CopayAmount>?</sch:CopayAmount>
               {/* <!--Optional:--> */}
               <sch:CopayCategory>?</sch:CopayCategory>
               {/* <!--Optional:--> */}
               <sch:CopayMethod>?</sch:CopayMethod>
               {/* <!--Optional:--> */}
               <sch:CopayReference>?</sch:CopayReference>
               {/* <!--Optional:--> */}
               <sch:CreatedDate>?</sch:CreatedDate>
               {/* <!--Optional:--> */}
               <sch:DoNotSendClaimElectronically>?</sch:DoNotSendClaimElectronically>
               {/* <!--Optional:--> */}
               <sch:DoNotSendElectronicallyToSecondary>?</sch:DoNotSendElectronicallyToSecondary>
               {/* <!--Optional:--> */}
               <sch:EClaimNote>?</sch:EClaimNote>
               {/* <!--Optional:--> */}
               <sch:EClaimNoteType>?</sch:EClaimNoteType>
               {/* <!--Optional:--> */}
               <sch:EncounterDiagnosisID1>?</sch:EncounterDiagnosisID1>
               {/* <!--Optional:--> */}
               <sch:EncounterDiagnosisID2>?</sch:EncounterDiagnosisID2>
               {/* <!--Optional:--> */}
               <sch:EncounterDiagnosisID3>?</sch:EncounterDiagnosisID3>
               {/* <!--Optional:--> */}
               <sch:EncounterDiagnosisID4>?</sch:EncounterDiagnosisID4>
               {/* <!--Optional:--> */}
               <sch:EncounterID>?</sch:EncounterID>
               {/* <!--Optional:--> */}
               <sch:EncounterProcedureID>?</sch:EncounterProcedureID>
               {/* <!--Optional:--> */}
               <sch:EncounterStatus>?</sch:EncounterStatus>
               {/* <!--Optional:--> */}
               <sch:ExpectedAmount>?</sch:ExpectedAmount>
               {/* <!--Optional:--> */}
               <sch:HospitalizationEndDate>?</sch:HospitalizationEndDate>
               {/* <!--Optional:--> */}
               <sch:HospitalizationStartDate>?</sch:HospitalizationStartDate>
               {/* <!--Optional:--> */}
               <sch:ID>?</sch:ID>
               {/* <!--Optional:--> */}
               <sch:InsuranceBalance>?</sch:InsuranceBalance>
               {/* <!--Optional:--> */}
               <sch:LastModifiedDate>?</sch:LastModifiedDate>
               {/* <!--Optional:--> */}
               <sch:LineNote>?</sch:LineNote>
               {/* <!--Optional:--> */}
               <sch:LocalUseBox10d>?</sch:LocalUseBox10d>
               {/* <!--Optional:--> */}
               <sch:LocalUseBox19>?</sch:LocalUseBox19>
               {/* <!--Optional:--> */}
               <sch:Minutes>?</sch:Minutes>
               {/* <!--Optional:--> */}
               <sch:OtherAdjustment>?</sch:OtherAdjustment>
               {/* <!--Optional:--> */}
               <sch:OtherPaymentAmount>?</sch:OtherPaymentAmount>
               {/* <!--Optional:--> */}
               <sch:OtherPaymentCategoryDesc>?</sch:OtherPaymentCategoryDesc>
               {/* <!--Optional:--> */}
               <sch:OtherPaymentID>?</sch:OtherPaymentID>
               {/* <!--Optional:--> */}
               <sch:OtherPaymentMethodDesc>?</sch:OtherPaymentMethodDesc>
               {/* <!--Optional:--> */}
               <sch:OtherPaymentPostingDate>?</sch:OtherPaymentPostingDate>
               {/* <!--Optional:--> */}
               <sch:OtherPaymentRef>?</sch:OtherPaymentRef>
               {/* <!--Optional:--> */}
               <sch:PatientBalance>?</sch:PatientBalance>
               {/* <!--Optional:--> */}
               <sch:PatientBatchID>?</sch:PatientBatchID>
               {/* <!--Optional:--> */}
               <sch:PatientDateOfBirth>?</sch:PatientDateOfBirth>
               {/* <!--Optional:--> */}
               <sch:PatientFirstBillDate>?</sch:PatientFirstBillDate>
               {/* <!--Optional:--> */}
               <sch:PatientFirstName>?</sch:PatientFirstName>
               {/* <!--Optional:--> */}
               <sch:PatientID>?</sch:PatientID>
               {/* <!--Optional:--> */}
               <sch:PatientLastBillDate>?</sch:PatientLastBillDate>
               {/* <!--Optional:--> */}
               <sch:PatientLastName>?</sch:PatientLastName>
               {/* <!--Optional:--> */}
               <sch:PatientMiddleName>?</sch:PatientMiddleName>
               {/* <!--Optional:--> */}
               <sch:PatientName>?</sch:PatientName>
               {/* <!--Optional:--> */}
               <sch:PatientPaymentAmount>?</sch:PatientPaymentAmount>
               {/* <!--Optional:--> */}
               <sch:PatientPaymentCategoryDesc>?</sch:PatientPaymentCategoryDesc>
               {/* <!--Optional:--> */}
               <sch:PatientPaymentID>?</sch:PatientPaymentID>
               {/* <!--Optional:--> */}
               <sch:PatientPaymentMethodDesc>?</sch:PatientPaymentMethodDesc>
               {/* <!--Optional:--> */}
               <sch:PatientPaymentPostingDate>?</sch:PatientPaymentPostingDate>
               {/* <!--Optional:--> */}
               <sch:PatientPaymentRef>?</sch:PatientPaymentRef>
               {/* <!--Optional:--> */}
               <sch:PostingDate>?</sch:PostingDate>
               {/* <!--Optional:--> */}
               <sch:PracticeID>?</sch:PracticeID>
               {/* <!--Optional:--> */}
               <sch:PracticeName>?</sch:PracticeName>
               {/* <!--Optional:--> */}
               <sch:PrimaryInsuranceAddressLine1>?</sch:PrimaryInsuranceAddressLine1>
               {/* <!--Optional:--> */}
               <sch:PrimaryInsuranceAddressLine2>?</sch:PrimaryInsuranceAddressLine2>
               {/* <!--Optional:--> */}
               <sch:PrimaryInsuranceAdjudicationDate>?</sch:PrimaryInsuranceAdjudicationDate>
               {/* <!--Optional:--> */}
               <sch:PrimaryInsuranceBatchID>?</sch:PrimaryInsuranceBatchID>
               {/* <!--Optional:--> */}
               <sch:PrimaryInsuranceCity>?</sch:PrimaryInsuranceCity>
               {/* <!--Optional:--> */}
               <sch:PrimaryInsuranceCompanyName>?</sch:PrimaryInsuranceCompanyName>
               {/* <!--Optional:--> */}
               <sch:PrimaryInsuranceCountry>?</sch:PrimaryInsuranceCountry>
               {/* <!--Optional:--> */}
               <sch:PrimaryInsuranceFirstBillDate>?</sch:PrimaryInsuranceFirstBillDate>
               {/* <!--Optional:--> */}
               <sch:PrimaryInsuranceInsuranceAllowed>?</sch:PrimaryInsuranceInsuranceAllowed>
               {/* <!--Optional:--> */}
               <sch:PrimaryInsuranceInsuranceCoinsurance>?</sch:PrimaryInsuranceInsuranceCoinsurance>
               {/* <!--Optional:--> */}
               <sch:PrimaryInsuranceInsuranceContractAdjustment>?</sch:PrimaryInsuranceInsuranceContractAdjustment>
               {/* <!--Optional:--> */}
               <sch:PrimaryInsuranceInsuranceContractAdjustmentReason>?</sch:PrimaryInsuranceInsuranceContractAdjustmentReason>
               {/* <!--Optional:--> */}
               <sch:PrimaryInsuranceInsuranceCopay>?</sch:PrimaryInsuranceInsuranceCopay>
               {/* <!--Optional:--> */}
               <sch:PrimaryInsuranceInsuranceDeductible>?</sch:PrimaryInsuranceInsuranceDeductible>
               {/* <!--Optional:--> */}
               <sch:PrimaryInsuranceInsurancePayment>?</sch:PrimaryInsuranceInsurancePayment>
               {/* <!--Optional:--> */}
               <sch:PrimaryInsuranceInsuranceSecondaryAdjustment>?</sch:PrimaryInsuranceInsuranceSecondaryAdjustment>
               {/* <!--Optional:--> */}
               <sch:PrimaryInsuranceInsuranceSecondaryAdjustmentReason>?</sch:PrimaryInsuranceInsuranceSecondaryAdjustmentReason>
               {/* <!--Optional:--> */}
               <sch:PrimaryInsuranceLastBillDate>?</sch:PrimaryInsuranceLastBillDate>
               {/* <!--Optional:--> */}
               <sch:PrimaryInsurancePaymentCategoryDesc>?</sch:PrimaryInsurancePaymentCategoryDesc>
               {/* <!--Optional:--> */}
               <sch:PrimaryInsurancePaymentID>?</sch:PrimaryInsurancePaymentID>
               {/* <!--Optional:--> */}
               <sch:PrimaryInsurancePaymentMethodDesc>?</sch:PrimaryInsurancePaymentMethodDesc>
               {/* <!--Optional:--> */}
               <sch:PrimaryInsurancePaymentPostingDate>?</sch:PrimaryInsurancePaymentPostingDate>
               {/* <!--Optional:--> */}
               <sch:PrimaryInsurancePaymentRef>?</sch:PrimaryInsurancePaymentRef>
               {/* <!--Optional:--> */}
               <sch:PrimaryInsurancePlanName>?</sch:PrimaryInsurancePlanName>
               {/* <!--Optional:--> */}
               <sch:PrimaryInsuranceState>?</sch:PrimaryInsuranceState>
               {/* <!--Optional:--> */}
               <sch:PrimaryInsuranceZipCode>?</sch:PrimaryInsuranceZipCode>
               {/* <!--Optional:--> */}
               <sch:ProcedureCode>?</sch:ProcedureCode>
               {/* <!--Optional:--> */}
               <sch:ProcedureCodeCategory>?</sch:ProcedureCodeCategory>
               {/* <!--Optional:--> */}
               <sch:ProcedureModifier1>?</sch:ProcedureModifier1>
               {/* <!--Optional:--> */}
               <sch:ProcedureModifier2>?</sch:ProcedureModifier2>
               {/* <!--Optional:--> */}
               <sch:ProcedureModifier3>?</sch:ProcedureModifier3>
               {/* <!--Optional:--> */}
               <sch:ProcedureModifier4>?</sch:ProcedureModifier4>
               {/* <!--Optional:--> */}
               <sch:ProcedureName>?</sch:ProcedureName>
               {/* <!--Optional:--> */}
               <sch:Receipts>?</sch:Receipts>
               {/* <!--Optional:--> */}
               <sch:RefCode>?</sch:RefCode>
               {/* <!--Optional:--> */}
               <sch:ReferringProviderID>?</sch:ReferringProviderID>
               {/* <!--Optional:--> */}
               <sch:ReferringProviderName>?</sch:ReferringProviderName>
               {/* <!--Optional:--> */}
               <sch:RenderingProviderID>?</sch:RenderingProviderID>
               {/* <!--Optional:--> */}
               <sch:RenderingProviderName>?</sch:RenderingProviderName>
               {/* <!--Optional:--> */}
               <sch:SchedulingProviderID>?</sch:SchedulingProviderID>
               {/* <!--Optional:--> */}
               <sch:SchedulingProviderName>?</sch:SchedulingProviderName>
               {/* <!--Optional:--> */}
               <sch:SecondaryInsuranceAddressLine1>?</sch:SecondaryInsuranceAddressLine1>
               {/* <!--Optional:--> */}
               <sch:SecondaryInsuranceAddressLine2>?</sch:SecondaryInsuranceAddressLine2>
               {/* <!--Optional:--> */}
               <sch:SecondaryInsuranceAdjudicationDate>?</sch:SecondaryInsuranceAdjudicationDate>
               {/* <!--Optional:--> */}
               <sch:SecondaryInsuranceBatchID>?</sch:SecondaryInsuranceBatchID>
               {/* <!--Optional:--> */}
               <sch:SecondaryInsuranceCity>?</sch:SecondaryInsuranceCity>
               {/* <!--Optional:--> */}
               <sch:SecondaryInsuranceCompanyName>?</sch:SecondaryInsuranceCompanyName>
               {/* <!--Optional:--> */}
               <sch:SecondaryInsuranceCountry>?</sch:SecondaryInsuranceCountry>
               {/* <!--Optional:--> */}
               <sch:SecondaryInsuranceFirstBillDate>?</sch:SecondaryInsuranceFirstBillDate>
               {/* <!--Optional:--> */}
               <sch:SecondaryInsuranceInsuranceAllowed>?</sch:SecondaryInsuranceInsuranceAllowed>
               {/* <!--Optional:--> */}
               <sch:SecondaryInsuranceInsuranceCoinsurance>?</sch:SecondaryInsuranceInsuranceCoinsurance>
               {/* <!--Optional:--> */}
               <sch:SecondaryInsuranceInsuranceContractAdjustment>?</sch:SecondaryInsuranceInsuranceContractAdjustment>
               {/* <!--Optional:--> */}
               <sch:SecondaryInsuranceInsuranceContractAdjustmentReason>?</sch:SecondaryInsuranceInsuranceContractAdjustmentReason>
               {/* <!--Optional:--> */}
               <sch:SecondaryInsuranceInsuranceCopay>?</sch:SecondaryInsuranceInsuranceCopay>
               {/* <!--Optional:--> */}
               <sch:SecondaryInsuranceInsuranceDeductible>?</sch:SecondaryInsuranceInsuranceDeductible>
               {/* <!--Optional:--> */}
               <sch:SecondaryInsuranceInsurancePayment>?</sch:SecondaryInsuranceInsurancePayment>
               {/* <!--Optional:--> */}
               <sch:SecondaryInsuranceInsuranceSecondaryAdjustment>?</sch:SecondaryInsuranceInsuranceSecondaryAdjustment>
               {/* <!--Optional:--> */}
               <sch:SecondaryInsuranceInsuranceSecondaryAdjustmentReason>?</sch:SecondaryInsuranceInsuranceSecondaryAdjustmentReason>
               {/* <!--Optional:--> */}
               <sch:SecondaryInsuranceLastBillDate>?</sch:SecondaryInsuranceLastBillDate>
               {/* <!--Optional:--> */}
               <sch:SecondaryInsurancePaymentCategoryDesc>?</sch:SecondaryInsurancePaymentCategoryDesc>
               {/* <!--Optional:--> */}
               <sch:SecondaryInsurancePaymentID>?</sch:SecondaryInsurancePaymentID>
               {/* <!--Optional:--> */}
               <sch:SecondaryInsurancePaymentMethodDesc>?</sch:SecondaryInsurancePaymentMethodDesc>
               {/* <!--Optional:--> */}
               <sch:SecondaryInsurancePaymentPostingDate>?</sch:SecondaryInsurancePaymentPostingDate>
               {/* <!--Optional:--> */}
               <sch:SecondaryInsurancePaymentRef>?</sch:SecondaryInsurancePaymentRef>
               {/* <!--Optional:--> */}
               <sch:SecondaryInsurancePlanName>?</sch:SecondaryInsurancePlanName>
               {/* <!--Optional:--> */}
               <sch:SecondaryInsuranceState>?</sch:SecondaryInsuranceState>
               {/* <!--Optional:--> */}
               <sch:SecondaryInsuranceZipCode>?</sch:SecondaryInsuranceZipCode>
               {/* <!--Optional:--> */}
               <sch:ServiceEndDate>?</sch:ServiceEndDate>
               {/* <!--Optional:--> */}
               <sch:ServiceLocationBillingName>?</sch:ServiceLocationBillingName>
               {/* <!--Optional:--> */}
               <sch:ServiceLocationCLIANumber>?</sch:ServiceLocationCLIANumber>
               {/* <!--Optional:--> */}
               <sch:ServiceLocationFacilityID>?</sch:ServiceLocationFacilityID>
               {/* <!--Optional:--> */}
               <sch:ServiceLocationFacilityIdType>?</sch:ServiceLocationFacilityIdType>
               {/* <!--Optional:--> */}
               <sch:ServiceLocationFax>?</sch:ServiceLocationFax>
               {/* <!--Optional:--> */}
               <sch:ServiceLocationFaxExt>?</sch:ServiceLocationFaxExt>
               {/* <!--Optional:--> */}
               <sch:ServiceLocationId>?</sch:ServiceLocationId>
               {/* <!--Optional:--> */}
               <sch:ServiceLocationNPI>?</sch:ServiceLocationNPI>
               {/* <!--Optional:--> */}
               <sch:ServiceLocationName>?</sch:ServiceLocationName>
               {/* <!--Optional:--> */}
               <sch:ServiceLocationNameAddressLine1>?</sch:ServiceLocationNameAddressLine1>
               {/* <!--Optional:--> */}
               <sch:ServiceLocationNameAddressLine2>?</sch:ServiceLocationNameAddressLine2>
               {/* <!--Optional:--> */}
               <sch:ServiceLocationNameCity>?</sch:ServiceLocationNameCity>
               {/* <!--Optional:--> */}
               <sch:ServiceLocationNameCountry>?</sch:ServiceLocationNameCountry>
               {/* <!--Optional:--> */}
               <sch:ServiceLocationNameState>?</sch:ServiceLocationNameState>
               {/* <!--Optional:--> */}
               <sch:ServiceLocationNameZipCode>?</sch:ServiceLocationNameZipCode>
               {/* <!--Optional:--> */}
               <sch:ServiceLocationPhone>?</sch:ServiceLocationPhone>
               {/* <!--Optional:--> */}
               <sch:ServiceLocationPhoneExt>?</sch:ServiceLocationPhoneExt>
               {/* <!--Optional:--> */}
               <sch:ServiceLocationPlaceOfServiceCode>?</sch:ServiceLocationPlaceOfServiceCode>
               {/* <!--Optional:--> */}
               <sch:ServiceLocationPlaceOfServiceName>?</sch:ServiceLocationPlaceOfServiceName>
               {/* <!--Optional:--> */}
               <sch:ServiceStartDate>?</sch:ServiceStartDate>
               {/* <!--Optional:--> */}
               <sch:Status>?</sch:Status>
               {/* <!--Optional:--> */}
               <sch:SupervisingProviderID>?</sch:SupervisingProviderID>
               {/* <!--Optional:--> */}
               <sch:SupervisingProviderName>?</sch:SupervisingProviderName>
               {/* <!--Optional:--> */}
               <sch:TertiaryInsuranceAddressLine1>?</sch:TertiaryInsuranceAddressLine1>
               {/* <!--Optional:--> */}
               <sch:TertiaryInsuranceAddressLine2>?</sch:TertiaryInsuranceAddressLine2>
               {/* <!--Optional:--> */}
               <sch:TertiaryInsuranceAdjudicationDate>?</sch:TertiaryInsuranceAdjudicationDate>
               {/* <!--Optional:--> */}
               <sch:TertiaryInsuranceBatchID>?</sch:TertiaryInsuranceBatchID>
               {/* <!--Optional:--> */}
               <sch:TertiaryInsuranceCity>?</sch:TertiaryInsuranceCity>
               {/* <!--Optional:--> */}
               <sch:TertiaryInsuranceCompanyName>?</sch:TertiaryInsuranceCompanyName>
               {/* <!--Optional:--> */}
               <sch:TertiaryInsuranceCompanyPlanName>?</sch:TertiaryInsuranceCompanyPlanName>
               {/* <!--Optional:--> */}
               <sch:TertiaryInsuranceCountry>?</sch:TertiaryInsuranceCountry>
               {/* <!--Optional:--> */}
               <sch:TertiaryInsuranceInsuranceAllowed>?</sch:TertiaryInsuranceInsuranceAllowed>
               {/* <!--Optional:--> */}
               <sch:TertiaryInsuranceInsuranceCoinsurance>?</sch:TertiaryInsuranceInsuranceCoinsurance>
               {/* <!--Optional:--> */}
               <sch:TertiaryInsuranceInsuranceContractAdjustment>?</sch:TertiaryInsuranceInsuranceContractAdjustment>
               {/* <!--Optional:--> */}
               <sch:TertiaryInsuranceInsuranceContractAdjustmentReason>?</sch:TertiaryInsuranceInsuranceContractAdjustmentReason>
               {/* <!--Optional:--> */}
               <sch:TertiaryInsuranceInsuranceCopay>?</sch:TertiaryInsuranceInsuranceCopay>
               {/* <!--Optional:--> */}
               <sch:TertiaryInsuranceInsuranceDeductible>?</sch:TertiaryInsuranceInsuranceDeductible>
               {/* <!--Optional:--> */}
               <sch:TertiaryInsuranceInsurancePayment>?</sch:TertiaryInsuranceInsurancePayment>
               {/* <!--Optional:--> */}
               <sch:TertiaryInsuranceInsuranceSecondaryAdjustment>?</sch:TertiaryInsuranceInsuranceSecondaryAdjustment>
               {/* <!--Optional:--> */}
               <sch:TertiaryInsuranceInsuranceSecondaryAdjustmentReason>?</sch:TertiaryInsuranceInsuranceSecondaryAdjustmentReason>
               {/* <!--Optional:--> */}
               <sch:TertiaryInsurancePaymentCategoryDesc>?</sch:TertiaryInsurancePaymentCategoryDesc>
               {/* <!--Optional:--> */}
               <sch:TertiaryInsurancePaymentID>?</sch:TertiaryInsurancePaymentID>
               {/* <!--Optional:--> */}
               <sch:TertiaryInsurancePaymentMethodDesc>?</sch:TertiaryInsurancePaymentMethodDesc>
               {/* <!--Optional:--> */}
               <sch:TertiaryInsurancePaymentPostingDate>?</sch:TertiaryInsurancePaymentPostingDate>
               {/* <!--Optional:--> */}
               <sch:TertiaryInsurancePaymentRef>?</sch:TertiaryInsurancePaymentRef>
               {/* <!--Optional:--> */}
               <sch:TertiaryInsuranceState>?</sch:TertiaryInsuranceState>
               {/* <!--Optional:--> */}
               <sch:TertiaryInsuranceZipCode>?</sch:TertiaryInsuranceZipCode>
               {/* <!--Optional:--> */}
               <sch:TotalBalance>?</sch:TotalBalance>
               {/* <!--Optional:--> */}
               <sch:TotalCharges>?</sch:TotalCharges>
               {/* <!--Optional:--> */}
               <sch:TypeOfService>?</sch:TypeOfService>
               {/* <!--Optional:--> */}
               <sch:UnitCharge>?</sch:UnitCharge>
               {/* <!--Optional:--> */}
               <sch:Units>?</sch:Units>
            </sch:Fields>
            {/* <!--Optional:--> */}
            <sch:Filter>
               {/* <!--Optional:--> */}
               <sch:BatchNumber>?</sch:BatchNumber>
               {/* <!--Optional:--> */}
               <sch:BilledTo>?</sch:BilledTo>
               {/* <!--Optional:--> */}
               <sch:CasePayerScenario>?</sch:CasePayerScenario>
               {/* <!--Optional:--> */}
               <sch:DiagnosisCode>?</sch:DiagnosisCode>
               {/* <!--Optional:--> */}
               <sch:EncounterStatus>?</sch:EncounterStatus>
               {/* <!--Optional:--> */}
               <sch:FromCreatedDate>?</sch:FromCreatedDate>
               {/* <!--Optional:--> */}
               <sch:FromLastModifiedDate>?</sch:FromLastModifiedDate>
               {/* <!--Optional:--> */}
               <sch:FromPostingDate>?</sch:FromPostingDate>
               {/* <!--Optional:--> */}
               <sch:FromServiceDate>?</sch:FromServiceDate>
               {/* <!--Optional:--> */}
               <sch:IncludeUnapprovedCharges>?</sch:IncludeUnapprovedCharges>
               {/* <!--Optional:--> */}
               <sch:PatientName>?</sch:PatientName>
               {/* <!--Optional:--> */}
               <sch:PracticeName>?</sch:PracticeName>
               {/* <!--Optional:--> */}
               <sch:ProcedureCode>?</sch:ProcedureCode>
               {/* <!--Optional:--> */}
               <sch:ReferringProviderFullName>?</sch:ReferringProviderFullName>
               {/* <!--Optional:--> */}
               <sch:RenderingProviderFullName>?</sch:RenderingProviderFullName>
               {/* <!--Optional:--> */}
               <sch:SchedulingProviderFullName>?</sch:SchedulingProviderFullName>
               {/* <!--Optional:--> */}
               <sch:ServiceLocationName>?</sch:ServiceLocationName>
               {/* <!--Optional:--> */}
               <sch:Status>?</sch:Status>
               {/* <!--Optional:--> */}
               <sch:ToCreatedDate>?</sch:ToCreatedDate>
               {/* <!--Optional:--> */}
               <sch:ToLastModifiedDate>?</sch:ToLastModifiedDate>
               {/* <!--Optional:--> */}
               <sch:ToPostingDate>?</sch:ToPostingDate>
               {/* <!--Optional:--> */}
               <sch:ToServiceDate>?</sch:ToServiceDate>
            </sch:Filter>
         </sch:request>
      </sch:GetCharges>
   </soapenv:Body>
</soapenv:Envelope>