<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sch="http://www.kareo.com/api/schemas/">
   <soapenv:Header/>
   <soapenv:Body>
      <sch:GetAppointments>
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
               <sch:AllDay>?</sch:AllDay>
               {/* <!--Optional:--> */}
               <sch:AppointmentDuration>?</sch:AppointmentDuration>
               {/* <!--Optional:--> */}
               <sch:AppointmentReason1>?</sch:AppointmentReason1>
               {/* <!--Optional:--> */}
               <sch:AppointmentReason10>?</sch:AppointmentReason10>
               {/* <!--Optional:--> */}
               <sch:AppointmentReason2>?</sch:AppointmentReason2>
               {/* <!--Optional:--> */}
               <sch:AppointmentReason3>?</sch:AppointmentReason3>
               {/* <!--Optional:--> */}
               <sch:AppointmentReason4>?</sch:AppointmentReason4>
               {/* <!--Optional:--> */}
               <sch:AppointmentReason5>?</sch:AppointmentReason5>
               {/* <!--Optional:--> */}
               <sch:AppointmentReason6>?</sch:AppointmentReason6>
               {/* <!--Optional:--> */}
               <sch:AppointmentReason7>?</sch:AppointmentReason7>
               {/* <!--Optional:--> */}
               <sch:AppointmentReason8>?</sch:AppointmentReason8>
               {/* <!--Optional:--> */}
               <sch:AppointmentReason9>?</sch:AppointmentReason9>
               {/* <!--Optional:--> */}
               <sch:AppointmentReasonID1>?</sch:AppointmentReasonID1>
               {/* <!--Optional:--> */}
               <sch:AppointmentReasonID10>?</sch:AppointmentReasonID10>
               {/* <!--Optional:--> */}
               <sch:AppointmentReasonID2>?</sch:AppointmentReasonID2>
               {/* <!--Optional:--> */}
               <sch:AppointmentReasonID3>?</sch:AppointmentReasonID3>
               {/* <!--Optional:--> */}
               <sch:AppointmentReasonID4>?</sch:AppointmentReasonID4>
               {/* <!--Optional:--> */}
               <sch:AppointmentReasonID5>?</sch:AppointmentReasonID5>
               {/* <!--Optional:--> */}
               <sch:AppointmentReasonID6>?</sch:AppointmentReasonID6>
               {/* <!--Optional:--> */}
               <sch:AppointmentReasonID7>?</sch:AppointmentReasonID7>
               {/* <!--Optional:--> */}
               <sch:AppointmentReasonID8>?</sch:AppointmentReasonID8>
               {/* <!--Optional:--> */}
               <sch:AppointmentReasonID9>?</sch:AppointmentReasonID9>
               {/* <!--Optional:--> */}
               <sch:AuthorizationEndDate>?</sch:AuthorizationEndDate>
               {/* <!--Optional:--> */}
               <sch:AuthorizationID>?</sch:AuthorizationID>
               {/* <!--Optional:--> */}
               <sch:AuthorizationInsurancePlan>?</sch:AuthorizationInsurancePlan>
               {/* <!--Optional:--> */}
               <sch:AuthorizationNumber>?</sch:AuthorizationNumber>
               {/* <!--Optional:--> */}
               <sch:AuthorizationStartDate>?</sch:AuthorizationStartDate>
               {/* <!--Optional:--> */}
               <sch:ConfirmationStatus>?</sch:ConfirmationStatus>
               {/* <!--Optional:--> */}
               <sch:CreatedDate>?</sch:CreatedDate>
               {/* <!--Optional:--> */}
               <sch:EndDate>?</sch:EndDate>
               {/* <!--Optional:--> */}
               <sch:ID>?</sch:ID>
               {/* <!--Optional:--> */}
               <sch:LastModifiedDate>?</sch:LastModifiedDate>
               {/* <!--Optional:--> */}
               <sch:Notes>?</sch:Notes>
               {/* <!--Optional:--> */}
               <sch:PatientCaseID>?</sch:PatientCaseID>
               {/* <!--Optional:--> */}
               <sch:PatientCaseName>?</sch:PatientCaseName>
               {/* <!--Optional:--> */}
               <sch:PatientCasePayerScenario>?</sch:PatientCasePayerScenario>
               {/* <!--Optional:--> */}
               <sch:PatientFullName>?</sch:PatientFullName>
               {/* <!--Optional:--> */}
               <sch:PatientID>?</sch:PatientID>
               {/* <!--Optional:--> */}
               <sch:PracticeID>?</sch:PracticeID>
               {/* <!--Optional:--> */}
               <sch:PracticeName>?</sch:PracticeName>
               {/* <!--Optional:--> */}
               <sch:Recurring>?</sch:Recurring>
               {/* <!--Optional:--> */}
               <sch:ResourceID1>?</sch:ResourceID1>
               {/* <!--Optional:--> */}
               <sch:ResourceID10>?</sch:ResourceID10>
               {/* <!--Optional:--> */}
               <sch:ResourceID2>?</sch:ResourceID2>
               {/* <!--Optional:--> */}
               <sch:ResourceID3>?</sch:ResourceID3>
               {/* <!--Optional:--> */}
               <sch:ResourceID4>?</sch:ResourceID4>
               {/* <!--Optional:--> */}
               <sch:ResourceID5>?</sch:ResourceID5>
               {/* <!--Optional:--> */}
               <sch:ResourceID6>?</sch:ResourceID6>
               {/* <!--Optional:--> */}
               <sch:ResourceID7>?</sch:ResourceID7>
               {/* <!--Optional:--> */}
               <sch:ResourceID8>?</sch:ResourceID8>
               {/* <!--Optional:--> */}
               <sch:ResourceID9>?</sch:ResourceID9>
               {/* <!--Optional:--> */}
               <sch:ResourceName1>?</sch:ResourceName1>
               {/* <!--Optional:--> */}
               <sch:ResourceName10>?</sch:ResourceName10>
               {/* <!--Optional:--> */}
               <sch:ResourceName2>?</sch:ResourceName2>
               {/* <!--Optional:--> */}
               <sch:ResourceName3>?</sch:ResourceName3>
               {/* <!--Optional:--> */}
               <sch:ResourceName4>?</sch:ResourceName4>
               {/* <!--Optional:--> */}
               <sch:ResourceName5>?</sch:ResourceName5>
               {/* <!--Optional:--> */}
               <sch:ResourceName6>?</sch:ResourceName6>
               {/* <!--Optional:--> */}
               <sch:ResourceName7>?</sch:ResourceName7>
               {/* <!--Optional:--> */}
               <sch:ResourceName8>?</sch:ResourceName8>
               {/* <!--Optional:--> */}
               <sch:ResourceName9>?</sch:ResourceName9>
               {/* <!--Optional:--> */}
               <sch:ResourceTypeID1>?</sch:ResourceTypeID1>
               {/* <!--Optional:--> */}
               <sch:ResourceTypeID10>?</sch:ResourceTypeID10>
               {/* <!--Optional:--> */}
               <sch:ResourceTypeID2>?</sch:ResourceTypeID2>
               {/* <!--Optional:--> */}
               <sch:ResourceTypeID3>?</sch:ResourceTypeID3>
               {/* <!--Optional:--> */}
               <sch:ResourceTypeID4>?</sch:ResourceTypeID4>
               {/* <!--Optional:--> */}
               <sch:ResourceTypeID5>?</sch:ResourceTypeID5>
               {/* <!--Optional:--> */}
               <sch:ResourceTypeID6>?</sch:ResourceTypeID6>
               {/* <!--Optional:--> */}
               <sch:ResourceTypeID7>?</sch:ResourceTypeID7>
               {/* <!--Optional:--> */}
               <sch:ResourceTypeID8>?</sch:ResourceTypeID8>
               {/* <!--Optional:--> */}
               <sch:ResourceTypeID9>?</sch:ResourceTypeID9>
               {/* <!--Optional:--> */}
               <sch:ServiceLocationID>?</sch:ServiceLocationID>
               {/* <!--Optional:--> */}
               <sch:ServiceLocationName>?</sch:ServiceLocationName>
               {/* <!--Optional:--> */}
               <sch:StartDate>?</sch:StartDate>
               {/* <!--Optional:--> */}
               <sch:Type>?</sch:Type>
            </sch:Fields>
            {/* <!--Optional:--> */}
            <sch:Filter>
               {/* <!--Optional:--> */}
               <sch:AppointmentReason>?</sch:AppointmentReason>
               {/* <!--Optional:--> */}
               <sch:ConfirmationStatus>?</sch:ConfirmationStatus>
               {/* <!--Optional:--> */}
               <sch:EndDate>?</sch:EndDate>
               {/* <!--Optional:--> */}
               <sch:FromCreatedDate>?</sch:FromCreatedDate>
               {/* <!--Optional:--> */}
               <sch:FromLastModifiedDate>?</sch:FromLastModifiedDate>
               {/* <!--Optional:--> */}
               <sch:PatientCasePayerScenario>?</sch:PatientCasePayerScenario>
               {/* <!--Optional:--> */}
               <sch:PatientFullName>?</sch:PatientFullName>
               {/* <!--Optional:--> */}
               <sch:PatientID>?</sch:PatientID>
               {/* <!--Optional:--> */}
               <sch:PracticeName>?</sch:PracticeName>
               {/* <!--Optional:--> */}
               <sch:ResourceName>?</sch:ResourceName>
               {/* <!--Optional:--> */}
               <sch:ServiceLocationName>?</sch:ServiceLocationName>
               {/* <!--Optional:--> */}
               <sch:StartDate>?</sch:StartDate>
               {/* <!--Optional:--> */}
               <sch:TimeZoneOffsetFromGMT>?</sch:TimeZoneOffsetFromGMT>
               {/* <!--Optional:--> */}
               <sch:ToCreatedDate>?</sch:ToCreatedDate>
               {/* <!--Optional:--> */}
               <sch:ToLastModifiedDate>?</sch:ToLastModifiedDate>
               {/* <!--Optional:--> */}
               <sch:Type>?</sch:Type>
            </sch:Filter>
         </sch:request>
      </sch:GetAppointments>
   </soapenv:Body>
</soapenv:Envelope>