<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sch="http://www.kareo.com/api/schemas/">
   <soapenv:Header/>
   <soapenv:Body>
      <sch:GetPatients>
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
               <sch:Active>?</sch:Active>
               {/* <!--Optional:--> */}
               <sch:AddressLine1>?</sch:AddressLine1>
               {/* <!--Optional:--> */}
               <sch:AddressLine2>?</sch:AddressLine2>
               {/* <!--Optional:--> */}
               <sch:Adjustments>?</sch:Adjustments>
               {/* <!--Optional:--> */}
               <sch:Age>?</sch:Age>
               {/* <!--Optional:--> */}
               <sch:AlertMessage>?</sch:AlertMessage>
               {/* <!--Optional:--> */}
               <sch:AlertShowWhenDisplayingPatientDetails>?</sch:AlertShowWhenDisplayingPatientDetails>
               {/* <!--Optional:--> */}
               <sch:AlertShowWhenEnteringEncounters>?</sch:AlertShowWhenEnteringEncounters>
               {/* <!--Optional:--> */}
               <sch:AlertShowWhenPostingPayments>?</sch:AlertShowWhenPostingPayments>
               {/* <!--Optional:--> */}
               <sch:AlertShowWhenPreparingPatientStatements>?</sch:AlertShowWhenPreparingPatientStatements>
               {/* <!--Optional:--> */}
               <sch:AlertShowWhenSchedulingAppointments>?</sch:AlertShowWhenSchedulingAppointments>
               {/* <!--Optional:--> */}
               <sch:AlertShowWhenViewingClaimDetails>?</sch:AlertShowWhenViewingClaimDetails>
               {/* <!--Optional:--> */}
               <sch:Authorization1ContactFullName>?</sch:Authorization1ContactFullName>
               {/* <!--Optional:--> */}
               <sch:Authorization1ContactPhone>?</sch:Authorization1ContactPhone>
               {/* <!--Optional:--> */}
               <sch:Authorization1ContactPhoneExt>?</sch:Authorization1ContactPhoneExt>
               {/* <!--Optional:--> */}
               <sch:Authorization1EndDate>?</sch:Authorization1EndDate>
               {/* <!--Optional:--> */}
               <sch:Authorization1InsurancePlanName>?</sch:Authorization1InsurancePlanName>
               {/* <!--Optional:--> */}
               <sch:Authorization1Notes>?</sch:Authorization1Notes>
               {/* <!--Optional:--> */}
               <sch:Authorization1Number>?</sch:Authorization1Number>
               {/* <!--Optional:--> */}
               <sch:Authorization1NumberOfVisits>?</sch:Authorization1NumberOfVisits>
               {/* <!--Optional:--> */}
               <sch:Authorization1NumberOfVisitsUsed>?</sch:Authorization1NumberOfVisitsUsed>
               {/* <!--Optional:--> */}
               <sch:Authorization1StartDate>?</sch:Authorization1StartDate>
               {/* <!--Optional:--> */}
               <sch:Authorization2ContactFullName>?</sch:Authorization2ContactFullName>
               {/* <!--Optional:--> */}
               <sch:Authorization2ContactPhone>?</sch:Authorization2ContactPhone>
               {/* <!--Optional:--> */}
               <sch:Authorization2ContactPhoneExt>?</sch:Authorization2ContactPhoneExt>
               {/* <!--Optional:--> */}
               <sch:Authorization2EndDate>?</sch:Authorization2EndDate>
               {/* <!--Optional:--> */}
               <sch:Authorization2InsurancePlanName>?</sch:Authorization2InsurancePlanName>
               {/* <!--Optional:--> */}
               <sch:Authorization2Notes>?</sch:Authorization2Notes>
               {/* <!--Optional:--> */}
               <sch:Authorization2Number>?</sch:Authorization2Number>
               {/* <!--Optional:--> */}
               <sch:Authorization2NumberOfVisits>?</sch:Authorization2NumberOfVisits>
               {/* <!--Optional:--> */}
               <sch:Authorization2NumberOfVisitsUsed>?</sch:Authorization2NumberOfVisitsUsed>
               {/* <!--Optional:--> */}
               <sch:Authorization2StartDate>?</sch:Authorization2StartDate>
               {/* <!--Optional:--> */}
               <sch:Authorization3ContactFullName>?</sch:Authorization3ContactFullName>
               {/* <!--Optional:--> */}
               <sch:Authorization3ContactPhone>?</sch:Authorization3ContactPhone>
               {/* <!--Optional:--> */}
               <sch:Authorization3ContactPhoneExt>?</sch:Authorization3ContactPhoneExt>
               {/* <!--Optional:--> */}
               <sch:Authorization3EndDate>?</sch:Authorization3EndDate>
               {/* <!--Optional:--> */}
               <sch:Authorization3InsurancePlanName>?</sch:Authorization3InsurancePlanName>
               {/* <!--Optional:--> */}
               <sch:Authorization3Notes>?</sch:Authorization3Notes>
               {/* <!--Optional:--> */}
               <sch:Authorization3Number>?</sch:Authorization3Number>
               {/* <!--Optional:--> */}
               <sch:Authorization3NumberOfVisits>?</sch:Authorization3NumberOfVisits>
               {/* <!--Optional:--> */}
               <sch:Authorization3NumberOfVisitsUsed>?</sch:Authorization3NumberOfVisitsUsed>
               {/* <!--Optional:--> */}
               <sch:Authorization3StartDate>?</sch:Authorization3StartDate>
               {/* <!--Optional:--> */}
               <sch:Charges>?</sch:Charges>
               {/* <!--Optional:--> */}
               <sch:City>?</sch:City>
               {/* <!--Optional:--> */}
               <sch:CollectionCategoryName>?</sch:CollectionCategoryName>
               {/* <!--Optional:--> */}
               <sch:Country>?</sch:Country>
               {/* <!--Optional:--> */}
               <sch:CreatedDate>?</sch:CreatedDate>
               {/* <!--Optional:--> */}
               <sch:DOB>?</sch:DOB>
               {/* <!--Optional:--> */}
               <sch:DefaultCaseConditionRelatedToAbuse>?</sch:DefaultCaseConditionRelatedToAbuse>
               {/* <!--Optional:--> */}
               <sch:DefaultCaseConditionRelatedToAutoAccident>?</sch:DefaultCaseConditionRelatedToAutoAccident>
               {/* <!--Optional:--> */}
               <sch:DefaultCaseConditionRelatedToAutoAccidentState>?</sch:DefaultCaseConditionRelatedToAutoAccidentState>
               {/* <!--Optional:--> */}
               <sch:DefaultCaseConditionRelatedToEPSDT>?</sch:DefaultCaseConditionRelatedToEPSDT>
               {/* <!--Optional:--> */}
               <sch:DefaultCaseConditionRelatedToEmergency>?</sch:DefaultCaseConditionRelatedToEmergency>
               {/* <!--Optional:--> */}
               <sch:DefaultCaseConditionRelatedToEmployment>?</sch:DefaultCaseConditionRelatedToEmployment>
               {/* <!--Optional:--> */}
               <sch:DefaultCaseConditionRelatedToFamilyPlanning>?</sch:DefaultCaseConditionRelatedToFamilyPlanning>
               {/* <!--Optional:--> */}
               <sch:DefaultCaseConditionRelatedToOther>?</sch:DefaultCaseConditionRelatedToOther>
               {/* <!--Optional:--> */}
               <sch:DefaultCaseConditionRelatedToPregnancy>?</sch:DefaultCaseConditionRelatedToPregnancy>
               {/* <!--Optional:--> */}
               <sch:DefaultCaseDatesAccidentDate>?</sch:DefaultCaseDatesAccidentDate>
               {/* <!--Optional:--> */}
               <sch:DefaultCaseDatesAcuteManifestationDate>?</sch:DefaultCaseDatesAcuteManifestationDate>
               {/* <!--Optional:--> */}
               <sch:DefaultCaseDatesInjuryEndDate>?</sch:DefaultCaseDatesInjuryEndDate>
               {/* <!--Optional:--> */}
               <sch:DefaultCaseDatesInjuryStartDate>?</sch:DefaultCaseDatesInjuryStartDate>
               {/* <!--Optional:--> */}
               <sch:DefaultCaseDatesLastMenstrualPeriodDate>?</sch:DefaultCaseDatesLastMenstrualPeriodDate>
               {/* <!--Optional:--> */}
               <sch:DefaultCaseDatesLastSeenDate>?</sch:DefaultCaseDatesLastSeenDate>
               {/* <!--Optional:--> */}
               <sch:DefaultCaseDatesLastXRayDate>?</sch:DefaultCaseDatesLastXRayDate>
               {/* <!--Optional:--> */}
               <sch:DefaultCaseDatesReferralDate>?</sch:DefaultCaseDatesReferralDate>
               {/* <!--Optional:--> */}
               <sch:DefaultCaseDatesRelatedDisabilityEndDate>?</sch:DefaultCaseDatesRelatedDisabilityEndDate>
               {/* <!--Optional:--> */}
               <sch:DefaultCaseDatesRelatedDisabilityStartDate>?</sch:DefaultCaseDatesRelatedDisabilityStartDate>
               {/* <!--Optional:--> */}
               <sch:DefaultCaseDatesRelatedHospitalizationEndDate>?</sch:DefaultCaseDatesRelatedHospitalizationEndDate>
               {/* <!--Optional:--> */}
               <sch:DefaultCaseDatesRelatedHospitalizationStartDate>?</sch:DefaultCaseDatesRelatedHospitalizationStartDate>
               {/* <!--Optional:--> */}
               <sch:DefaultCaseDatesSameOrSimilarIllnessEndDate>?</sch:DefaultCaseDatesSameOrSimilarIllnessEndDate>
               {/* <!--Optional:--> */}
               <sch:DefaultCaseDatesSameOrSimilarIllnessStartDate>?</sch:DefaultCaseDatesSameOrSimilarIllnessStartDate>
               {/* <!--Optional:--> */}
               <sch:DefaultCaseDatesUnableToWorkEndDate>?</sch:DefaultCaseDatesUnableToWorkEndDate>
               {/* <!--Optional:--> */}
               <sch:DefaultCaseDatesUnableToWorkStartDate>?</sch:DefaultCaseDatesUnableToWorkStartDate>
               {/* <!--Optional:--> */}
               <sch:DefaultCaseDescription>?</sch:DefaultCaseDescription>
               {/* <!--Optional:--> */}
               <sch:DefaultCaseID>?</sch:DefaultCaseID>
               {/* <!--Optional:--> */}
               <sch:DefaultCaseName>?</sch:DefaultCaseName>
               {/* <!--Optional:--> */}
               <sch:DefaultCasePayerScenario>?</sch:DefaultCasePayerScenario>
               {/* <!--Optional:--> */}
               <sch:DefaultCaseReferringProviderFullName>?</sch:DefaultCaseReferringProviderFullName>
               {/* <!--Optional:--> */}
               <sch:DefaultCaseReferringProviderID>?</sch:DefaultCaseReferringProviderID>
               {/* <!--Optional:--> */}
               <sch:DefaultCaseSendPatientStatements>?</sch:DefaultCaseSendPatientStatements>
               {/* <!--Optional:--> */}
               <sch:DefaultRenderingProviderFullName>?</sch:DefaultRenderingProviderFullName>
               {/* <!--Optional:--> */}
               <sch:DefaultRenderingProviderId>?</sch:DefaultRenderingProviderId>
               {/* <!--Optional:--> */}
               <sch:DefaultServiceLocationBillingName>?</sch:DefaultServiceLocationBillingName>
               {/* <!--Optional:--> */}
               <sch:DefaultServiceLocationFaxPhone>?</sch:DefaultServiceLocationFaxPhone>
               {/* <!--Optional:--> */}
               <sch:DefaultServiceLocationFaxPhoneExt>?</sch:DefaultServiceLocationFaxPhoneExt>
               {/* <!--Optional:--> */}
               <sch:DefaultServiceLocationId>?</sch:DefaultServiceLocationId>
               {/* <!--Optional:--> */}
               <sch:DefaultServiceLocationName>?</sch:DefaultServiceLocationName>
               {/* <!--Optional:--> */}
               <sch:DefaultServiceLocationNameAddressLine1>?</sch:DefaultServiceLocationNameAddressLine1>
               {/* <!--Optional:--> */}
               <sch:DefaultServiceLocationNameAddressLine2>?</sch:DefaultServiceLocationNameAddressLine2>
               {/* <!--Optional:--> */}
               <sch:DefaultServiceLocationNameCity>?</sch:DefaultServiceLocationNameCity>
               {/* <!--Optional:--> */}
               <sch:DefaultServiceLocationNameCountry>?</sch:DefaultServiceLocationNameCountry>
               {/* <!--Optional:--> */}
               <sch:DefaultServiceLocationNameState>?</sch:DefaultServiceLocationNameState>
               {/* <!--Optional:--> */}
               <sch:DefaultServiceLocationNameZipCode>?</sch:DefaultServiceLocationNameZipCode>
               {/* <!--Optional:--> */}
               <sch:DefaultServiceLocationPhone>?</sch:DefaultServiceLocationPhone>
               {/* <!--Optional:--> */}
               <sch:DefaultServiceLocationPhoneExt>?</sch:DefaultServiceLocationPhoneExt>
               {/* <!--Optional:--> */}
               <sch:EmailAddress>?</sch:EmailAddress>
               {/* <!--Optional:--> */}
               <sch:EmergencyName>?</sch:EmergencyName>
               {/* <!--Optional:--> */}
               <sch:EmergencyPhone>?</sch:EmergencyPhone>
               {/* <!--Optional:--> */}
               <sch:EmergencyPhoneExt>?</sch:EmergencyPhoneExt>
               {/* <!--Optional:--> */}
               <sch:EmployerName>?</sch:EmployerName>
               {/* <!--Optional:--> */}
               <sch:EmploymentStatus>?</sch:EmploymentStatus>
               {/* <!--Optional:--> */}
               <sch:FirstName>?</sch:FirstName>
               {/* <!--Optional:--> */}
               <sch:Gender>?</sch:Gender>
               {/* <!--Optional:--> */}
               <sch:GuarantorDifferentThanPatient>?</sch:GuarantorDifferentThanPatient>
               {/* <!--Optional:--> */}
               <sch:GuarantorFirstName>?</sch:GuarantorFirstName>
               {/* <!--Optional:--> */}
               <sch:GuarantorLastName>?</sch:GuarantorLastName>
               {/* <!--Optional:--> */}
               <sch:GuarantorMiddleName>?</sch:GuarantorMiddleName>
               {/* <!--Optional:--> */}
               <sch:GuarantorPrefix>?</sch:GuarantorPrefix>
               {/* <!--Optional:--> */}
               <sch:GuarantorSuffix>?</sch:GuarantorSuffix>
               {/* <!--Optional:--> */}
               <sch:HomePhone>?</sch:HomePhone>
               {/* <!--Optional:--> */}
               <sch:HomePhoneExt>?</sch:HomePhoneExt>
               {/* <!--Optional:--> */}
               <sch:ID>?</sch:ID>
               {/* <!--Optional:--> */}
               <sch:InsuranceBalance>?</sch:InsuranceBalance>
               {/* <!--Optional:--> */}
               <sch:InsurancePayments>?</sch:InsurancePayments>
               {/* <!--Optional:--> */}
               <sch:LastAppointmentDate>?</sch:LastAppointmentDate>
               {/* <!--Optional:--> */}
               <sch:LastDiagnosis>?</sch:LastDiagnosis>
               {/* <!--Optional:--> */}
               <sch:LastEncounterDate>?</sch:LastEncounterDate>
               {/* <!--Optional:--> */}
               <sch:LastModifiedDate>?</sch:LastModifiedDate>
               {/* <!--Optional:--> */}
               <sch:LastName>?</sch:LastName>
               {/* <!--Optional:--> */}
               <sch:LastPaymentDate>?</sch:LastPaymentDate>
               {/* <!--Optional:--> */}
               <sch:LastStatementDate>?</sch:LastStatementDate>
               {/* <!--Optional:--> */}
               <sch:MaritalStatus>?</sch:MaritalStatus>
               {/* <!--Optional:--> */}
               <sch:MedicalRecordNumber>?</sch:MedicalRecordNumber>
               {/* <!--Optional:--> */}
               <sch:MiddleName>?</sch:MiddleName>
               {/* <!--Optional:--> */}
               <sch:MobilePhone>?</sch:MobilePhone>
               {/* <!--Optional:--> */}
               <sch:MobilePhoneExt>?</sch:MobilePhoneExt>
               {/* <!--Optional:--> */}
               <sch:MostRecentNote1Date>?</sch:MostRecentNote1Date>
               {/* <!--Optional:--> */}
               <sch:MostRecentNote1Message>?</sch:MostRecentNote1Message>
               {/* <!--Optional:--> */}
               <sch:MostRecentNote1User>?</sch:MostRecentNote1User>
               {/* <!--Optional:--> */}
               <sch:MostRecentNote2Date>?</sch:MostRecentNote2Date>
               {/* <!--Optional:--> */}
               <sch:MostRecentNote2Message>?</sch:MostRecentNote2Message>
               {/* <!--Optional:--> */}
               <sch:MostRecentNote2User>?</sch:MostRecentNote2User>
               {/* <!--Optional:--> */}
               <sch:MostRecentNote3Date>?</sch:MostRecentNote3Date>
               {/* <!--Optional:--> */}
               <sch:MostRecentNote3Message>?</sch:MostRecentNote3Message>
               {/* <!--Optional:--> */}
               <sch:MostRecentNote3User>?</sch:MostRecentNote3User>
               {/* <!--Optional:--> */}
               <sch:MostRecentNote4Date>?</sch:MostRecentNote4Date>
               {/* <!--Optional:--> */}
               <sch:MostRecentNote4Message>?</sch:MostRecentNote4Message>
               {/* <!--Optional:--> */}
               <sch:MostRecentNote4User>?</sch:MostRecentNote4User>
               {/* <!--Optional:--> */}
               <sch:PatientBalance>?</sch:PatientBalance>
               {/* <!--Optional:--> */}
               <sch:PatientFullName>?</sch:PatientFullName>
               {/* <!--Optional:--> */}
               <sch:PatientPayments>?</sch:PatientPayments>
               {/* <!--Optional:--> */}
               <sch:PracticeId>?</sch:PracticeId>
               {/* <!--Optional:--> */}
               <sch:PracticeName>?</sch:PracticeName>
               {/* <!--Optional:--> */}
               <sch:Prefix>?</sch:Prefix>
               {/* <!--Optional:--> */}
               <sch:PrimaryCarePhysicianFullName>?</sch:PrimaryCarePhysicianFullName>
               {/* <!--Optional:--> */}
               <sch:PrimaryCarePhysicianId>?</sch:PrimaryCarePhysicianId>
               {/* <!--Optional:--> */}
               <sch:PrimaryInsurancePolicyCompanyID>?</sch:PrimaryInsurancePolicyCompanyID>
               {/* <!--Optional:--> */}
               <sch:PrimaryInsurancePolicyCompanyName>?</sch:PrimaryInsurancePolicyCompanyName>
               {/* <!--Optional:--> */}
               <sch:PrimaryInsurancePolicyCopay>?</sch:PrimaryInsurancePolicyCopay>
               {/* <!--Optional:--> */}
               <sch:PrimaryInsurancePolicyDeductible>?</sch:PrimaryInsurancePolicyDeductible>
               {/* <!--Optional:--> */}
               <sch:PrimaryInsurancePolicyEffectiveEndDate>?</sch:PrimaryInsurancePolicyEffectiveEndDate>
               {/* <!--Optional:--> */}
               <sch:PrimaryInsurancePolicyEffectiveStartDate>?</sch:PrimaryInsurancePolicyEffectiveStartDate>
               {/* <!--Optional:--> */}
               <sch:PrimaryInsurancePolicyGroupNumber>?</sch:PrimaryInsurancePolicyGroupNumber>
               {/* <!--Optional:--> */}
               <sch:PrimaryInsurancePolicyInsuredAddressLine1>?</sch:PrimaryInsurancePolicyInsuredAddressLine1>
               {/* <!--Optional:--> */}
               <sch:PrimaryInsurancePolicyInsuredAddressLine2>?</sch:PrimaryInsurancePolicyInsuredAddressLine2>
               {/* <!--Optional:--> */}
               <sch:PrimaryInsurancePolicyInsuredCity>?</sch:PrimaryInsurancePolicyInsuredCity>
               {/* <!--Optional:--> */}
               <sch:PrimaryInsurancePolicyInsuredCountry>?</sch:PrimaryInsurancePolicyInsuredCountry>
               {/* <!--Optional:--> */}
               <sch:PrimaryInsurancePolicyInsuredDateOfBirth>?</sch:PrimaryInsurancePolicyInsuredDateOfBirth>
               {/* <!--Optional:--> */}
               <sch:PrimaryInsurancePolicyInsuredFullName>?</sch:PrimaryInsurancePolicyInsuredFullName>
               {/* <!--Optional:--> */}
               <sch:PrimaryInsurancePolicyInsuredGender>?</sch:PrimaryInsurancePolicyInsuredGender>
               {/* <!--Optional:--> */}
               <sch:PrimaryInsurancePolicyInsuredIDNumber>?</sch:PrimaryInsurancePolicyInsuredIDNumber>
               {/* <!--Optional:--> */}
               <sch:PrimaryInsurancePolicyInsuredNotes>?</sch:PrimaryInsurancePolicyInsuredNotes>
               {/* <!--Optional:--> */}
               <sch:PrimaryInsurancePolicyInsuredSocialSecurityNumber>?</sch:PrimaryInsurancePolicyInsuredSocialSecurityNumber>
               {/* <!--Optional:--> */}
               <sch:PrimaryInsurancePolicyInsuredState>?</sch:PrimaryInsurancePolicyInsuredState>
               {/* <!--Optional:--> */}
               <sch:PrimaryInsurancePolicyInsuredZipCode>?</sch:PrimaryInsurancePolicyInsuredZipCode>
               {/* <!--Optional:--> */}
               <sch:PrimaryInsurancePolicyNumber>?</sch:PrimaryInsurancePolicyNumber>
               {/* <!--Optional:--> */}
               <sch:PrimaryInsurancePolicyPatientRelationshipToInsured>?</sch:PrimaryInsurancePolicyPatientRelationshipToInsured>
               {/* <!--Optional:--> */}
               <sch:PrimaryInsurancePolicyPlanAddressLine1>?</sch:PrimaryInsurancePolicyPlanAddressLine1>
               {/* <!--Optional:--> */}
               <sch:PrimaryInsurancePolicyPlanAddressLine2>?</sch:PrimaryInsurancePolicyPlanAddressLine2>
               {/* <!--Optional:--> */}
               <sch:PrimaryInsurancePolicyPlanAdjusterFullName>?</sch:PrimaryInsurancePolicyPlanAdjusterFullName>
               {/* <!--Optional:--> */}
               <sch:PrimaryInsurancePolicyPlanCity>?</sch:PrimaryInsurancePolicyPlanCity>
               {/* <!--Optional:--> */}
               <sch:PrimaryInsurancePolicyPlanCountry>?</sch:PrimaryInsurancePolicyPlanCountry>
               {/* <!--Optional:--> */}
               <sch:PrimaryInsurancePolicyPlanFaxNumber>?</sch:PrimaryInsurancePolicyPlanFaxNumber>
               {/* <!--Optional:--> */}
               <sch:PrimaryInsurancePolicyPlanFaxNumberExt>?</sch:PrimaryInsurancePolicyPlanFaxNumberExt>
               {/* <!--Optional:--> */}
               <sch:PrimaryInsurancePolicyPlanID>?</sch:PrimaryInsurancePolicyPlanID>
               {/* <!--Optional:--> */}
               <sch:PrimaryInsurancePolicyPlanName>?</sch:PrimaryInsurancePolicyPlanName>
               {/* <!--Optional:--> */}
               <sch:PrimaryInsurancePolicyPlanPhoneNumber>?</sch:PrimaryInsurancePolicyPlanPhoneNumber>
               {/* <!--Optional:--> */}
               <sch:PrimaryInsurancePolicyPlanPhoneNumberExt>?</sch:PrimaryInsurancePolicyPlanPhoneNumberExt>
               {/* <!--Optional:--> */}
               <sch:PrimaryInsurancePolicyPlanState>?</sch:PrimaryInsurancePolicyPlanState>
               {/* <!--Optional:--> */}
               <sch:PrimaryInsurancePolicyPlanZipCode>?</sch:PrimaryInsurancePolicyPlanZipCode>
               {/* <!--Optional:--> */}
               <sch:ReferralSource>?</sch:ReferralSource>
               {/* <!--Optional:--> */}
               <sch:ReferringProviderFullName>?</sch:ReferringProviderFullName>
               {/* <!--Optional:--> */}
               <sch:ReferringProviderId>?</sch:ReferringProviderId>
               {/* <!--Optional:--> */}
               <sch:SSN>?</sch:SSN>
               {/* <!--Optional:--> */}
               <sch:SecondaryInsurancePolicyCompanyID>?</sch:SecondaryInsurancePolicyCompanyID>
               {/* <!--Optional:--> */}
               <sch:SecondaryInsurancePolicyCompanyName>?</sch:SecondaryInsurancePolicyCompanyName>
               {/* <!--Optional:--> */}
               <sch:SecondaryInsurancePolicyCopay>?</sch:SecondaryInsurancePolicyCopay>
               {/* <!--Optional:--> */}
               <sch:SecondaryInsurancePolicyDeductible>?</sch:SecondaryInsurancePolicyDeductible>
               {/* <!--Optional:--> */}
               <sch:SecondaryInsurancePolicyEffectiveEndDate>?</sch:SecondaryInsurancePolicyEffectiveEndDate>
               {/* <!--Optional:--> */}
               <sch:SecondaryInsurancePolicyEffectiveStartDate>?</sch:SecondaryInsurancePolicyEffectiveStartDate>
               {/* <!--Optional:--> */}
               <sch:SecondaryInsurancePolicyGroupNumber>?</sch:SecondaryInsurancePolicyGroupNumber>
               {/* <!--Optional:--> */}
               <sch:SecondaryInsurancePolicyInsuredAddressLine1>?</sch:SecondaryInsurancePolicyInsuredAddressLine1>
               {/* <!--Optional:--> */}
               <sch:SecondaryInsurancePolicyInsuredAddressLine2>?</sch:SecondaryInsurancePolicyInsuredAddressLine2>
               {/* <!--Optional:--> */}
               <sch:SecondaryInsurancePolicyInsuredCity>?</sch:SecondaryInsurancePolicyInsuredCity>
               {/* <!--Optional:--> */}
               <sch:SecondaryInsurancePolicyInsuredCountry>?</sch:SecondaryInsurancePolicyInsuredCountry>
               {/* <!--Optional:--> */}
               <sch:SecondaryInsurancePolicyInsuredDateOfBirth>?</sch:SecondaryInsurancePolicyInsuredDateOfBirth>
               {/* <!--Optional:--> */}
               <sch:SecondaryInsurancePolicyInsuredFullName>?</sch:SecondaryInsurancePolicyInsuredFullName>
               {/* <!--Optional:--> */}
               <sch:SecondaryInsurancePolicyInsuredGender>?</sch:SecondaryInsurancePolicyInsuredGender>
               {/* <!--Optional:--> */}
               <sch:SecondaryInsurancePolicyInsuredIDNumber>?</sch:SecondaryInsurancePolicyInsuredIDNumber>
               {/* <!--Optional:--> */}
               <sch:SecondaryInsurancePolicyInsuredNotes>?</sch:SecondaryInsurancePolicyInsuredNotes>
               {/* <!--Optional:--> */}
               <sch:SecondaryInsurancePolicyInsuredSocialSecurityNumber>?</sch:SecondaryInsurancePolicyInsuredSocialSecurityNumber>
               {/* <!--Optional:--> */}
               <sch:SecondaryInsurancePolicyInsuredState>?</sch:SecondaryInsurancePolicyInsuredState>
               {/* <!--Optional:--> */}
               <sch:SecondaryInsurancePolicyInsuredZipCode>?</sch:SecondaryInsurancePolicyInsuredZipCode>
               {/* <!--Optional:--> */}
               <sch:SecondaryInsurancePolicyNumber>?</sch:SecondaryInsurancePolicyNumber>
               {/* <!--Optional:--> */}
               <sch:SecondaryInsurancePolicyPatientRelationshipToInsured>?</sch:SecondaryInsurancePolicyPatientRelationshipToInsured>
               {/* <!--Optional:--> */}
               <sch:SecondaryInsurancePolicyPlanAddressLine1>?</sch:SecondaryInsurancePolicyPlanAddressLine1>
               {/* <!--Optional:--> */}
               <sch:SecondaryInsurancePolicyPlanAddressLine2>?</sch:SecondaryInsurancePolicyPlanAddressLine2>
               {/* <!--Optional:--> */}
               <sch:SecondaryInsurancePolicyPlanAdjusterFullName>?</sch:SecondaryInsurancePolicyPlanAdjusterFullName>
               {/* <!--Optional:--> */}
               <sch:SecondaryInsurancePolicyPlanCity>?</sch:SecondaryInsurancePolicyPlanCity>
               {/* <!--Optional:--> */}
               <sch:SecondaryInsurancePolicyPlanCountry>?</sch:SecondaryInsurancePolicyPlanCountry>
               {/* <!--Optional:--> */}
               <sch:SecondaryInsurancePolicyPlanFaxNumber>?</sch:SecondaryInsurancePolicyPlanFaxNumber>
               {/* <!--Optional:--> */}
               <sch:SecondaryInsurancePolicyPlanFaxNumberExt>?</sch:SecondaryInsurancePolicyPlanFaxNumberExt>
               {/* <!--Optional:--> */}
               <sch:SecondaryInsurancePolicyPlanID>?</sch:SecondaryInsurancePolicyPlanID>
               {/* <!--Optional:--> */}
               <sch:SecondaryInsurancePolicyPlanName>?</sch:SecondaryInsurancePolicyPlanName>
               {/* <!--Optional:--> */}
               <sch:SecondaryInsurancePolicyPlanPhoneNumber>?</sch:SecondaryInsurancePolicyPlanPhoneNumber>
               {/* <!--Optional:--> */}
               <sch:SecondaryInsurancePolicyPlanPhoneNumberExt>?</sch:SecondaryInsurancePolicyPlanPhoneNumberExt>
               {/* <!--Optional:--> */}
               <sch:SecondaryInsurancePolicyPlanState>?</sch:SecondaryInsurancePolicyPlanState>
               {/* <!--Optional:--> */}
               <sch:SecondaryInsurancePolicyPlanZipCode>?</sch:SecondaryInsurancePolicyPlanZipCode>
               {/* <!--Optional:--> */}
               <sch:State>?</sch:State>
               {/* <!--Optional:--> */}
               <sch:StatementNote>?</sch:StatementNote>
               {/* <!--Optional:--> */}
               <sch:Suffix>?</sch:Suffix>
               {/* <!--Optional:--> */}
               <sch:TotalBalance>?</sch:TotalBalance>
               {/* <!--Optional:--> */}
               <sch:WorkPhone>?</sch:WorkPhone>
               {/* <!--Optional:--> */}
               <sch:WorkPhoneExt>?</sch:WorkPhoneExt>
               {/* <!--Optional:--> */}
               <sch:ZipCode>?</sch:ZipCode>
            </sch:Fields>
            {/* <!--Optional:--> */}
            <sch:Filter>
               {/* <!--Optional:--> */}
               <sch:CollectionCategoryName>?</sch:CollectionCategoryName>
               {/* <!--Optional:--> */}
               <sch:DefaultCasePayerScenario>?</sch:DefaultCasePayerScenario>
               {/* <!--Optional:--> */}
               <sch:DefaultRenderingProviderFullName>?</sch:DefaultRenderingProviderFullName>
               {/* <!--Optional:--> */}
               <sch:DefaultServiceLocationName>?</sch:DefaultServiceLocationName>
               {/* <!--Optional:--> */}
               <sch:FirstName>?</sch:FirstName>
               {/* <!--Optional:--> */}
               <sch:FromCreatedDate>?</sch:FromCreatedDate>
               {/* <!--Optional:--> */}
               <sch:FromDateOfBirth>?</sch:FromDateOfBirth>
               {/* <!--Optional:--> */}
               <sch:FromLastEncounterDate>?</sch:FromLastEncounterDate>
               {/* <!--Optional:--> */}
               <sch:FromLastModifiedDate>?</sch:FromLastModifiedDate>
               {/* <!--Optional:--> */}
               <sch:FullName>?</sch:FullName>
               {/* <!--Optional:--> */}
               <sch:Gender>?</sch:Gender>
               {/* <!--Optional:--> */}
               <sch:IsActive>?</sch:IsActive>
               {/* <!--Optional:--> */}
               <sch:LastName>?</sch:LastName>
               {/* <!--Optional:--> */}
               <sch:MiddleName>?</sch:MiddleName>
               {/* <!--Optional:--> */}
               <sch:PracticeID>?</sch:PracticeID>
               {/* <!--Optional:--> */}
               <sch:PracticeName>?</sch:PracticeName>
               {/* <!--Optional:--> */}
               <sch:PrimaryCarePhysicianFullName>?</sch:PrimaryCarePhysicianFullName>
               {/* <!--Optional:--> */}
               <sch:PrimaryInsurancePolicyCompanyName>?</sch:PrimaryInsurancePolicyCompanyName>
               {/* <!--Optional:--> */}
               <sch:PrimaryInsurancePolicyPlanName>?</sch:PrimaryInsurancePolicyPlanName>
               {/* <!--Optional:--> */}
               <sch:ReferralSource>?</sch:ReferralSource>
               {/* <!--Optional:--> */}
               <sch:ReferringProviderFullName>?</sch:ReferringProviderFullName>
               {/* <!--Optional:--> */}
               <sch:SSN>?</sch:SSN>
               {/* <!--Optional:--> */}
               <sch:SecondaryInsurancePolicyCompanyName>?</sch:SecondaryInsurancePolicyCompanyName>
               {/* <!--Optional:--> */}
               <sch:SecondaryInsurancePolicyPlanName>?</sch:SecondaryInsurancePolicyPlanName>
               {/* <!--Optional:--> */}
               <sch:ToCreatedDate>?</sch:ToCreatedDate>
               {/* <!--Optional:--> */}
               <sch:ToDateOfBirth>?</sch:ToDateOfBirth>
               {/* <!--Optional:--> */}
               <sch:ToLastEncounterDate>?</sch:ToLastEncounterDate>
               {/* <!--Optional:--> */}
               <sch:ToLastModifiedDate>?</sch:ToLastModifiedDate>
            </sch:Filter>
         </sch:request>
      </sch:GetPatients>
   </soapenv:Body>
</soapenv:Envelope>