<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sch="http://www.kareo.com/api/schemas/">
   <soapenv:Header/>
   <soapenv:Body>
      <sch:GetPayments>
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
               <sch:AdjudicationDate>?</sch:AdjudicationDate>
               {/* <!--Optional:--> */}
               <sch:Adjustments>?</sch:Adjustments>
               {/* <!--Optional:--> */}
               <sch:Amount>?</sch:Amount>
               {/* <!--Optional:--> */}
               <sch:Applied>?</sch:Applied>
               {/* <!--Optional:--> */}
               <sch:AppointmentID>?</sch:AppointmentID>
               {/* <!--Optional:--> */}
               <sch:BatchNumber>?</sch:BatchNumber>
               {/* <!--Optional:--> */}
               <sch:Category>?</sch:Category>
               {/* <!--Optional:--> */}
               <sch:CreatedDate>?</sch:CreatedDate>
               {/* <!--Optional:--> */}
               <sch:ID>?</sch:ID>
               {/* <!--Optional:--> */}
               <sch:LastModifiedDate>?</sch:LastModifiedDate>
               {/* <!--Optional:--> */}
               <sch:PayerName>?</sch:PayerName>
               {/* <!--Optional:--> */}
               <sch:PayerType>?</sch:PayerType>
               {/* <!--Optional:--> */}
               <sch:PaymentMethod>?</sch:PaymentMethod>
               {/* <!--Optional:--> */}
               <sch:PostDate>?</sch:PostDate>
               {/* <!--Optional:--> */}
               <sch:PracticeId>?</sch:PracticeId>
               {/* <!--Optional:--> */}
               <sch:ReferenceNumber>?</sch:ReferenceNumber>
               {/* <!--Optional:--> */}
               <sch:Refunds>?</sch:Refunds>
               {/* <!--Optional:--> */}
               <sch:Unapplied>?</sch:Unapplied>
            </sch:Fields>
            {/* <!--Optional:--> */}
            <sch:Filter>
               {/* <!--Optional:--> */}
               <sch:Amount>?</sch:Amount>
               {/* <!--Optional:--> */}
               <sch:AppointmentID>?</sch:AppointmentID>
               {/* <!--Optional:--> */}
               <sch:BatchNumber>?</sch:BatchNumber>
               {/* <!--Optional:--> */}
               <sch:FromCreatedDate>?</sch:FromCreatedDate>
               {/* <!--Optional:--> */}
               <sch:FromLastModifiedDate>?</sch:FromLastModifiedDate>
               {/* <!--Optional:--> */}
               <sch:FromPostDate>?</sch:FromPostDate>
               {/* <!--Optional:--> */}
               <sch:ID>?</sch:ID>
               {/* <!--Optional:--> */}
               <sch:PayerName>?</sch:PayerName>
               {/* <!--Optional:--> */}
               <sch:PayerType>?</sch:PayerType>
               {/* <!--Optional:--> */}
               <sch:PracticeID>?</sch:PracticeID>
               {/* <!--Optional:--> */}
               <sch:PracticeName>?</sch:PracticeName>
               {/* <!--Optional:--> */}
               <sch:ReferenceNumber>?</sch:ReferenceNumber>
               {/* <!--Optional:--> */}
               <sch:ToCreatedDate>?</sch:ToCreatedDate>
               {/* <!--Optional:--> */}
               <sch:ToLastModifiedDate>?</sch:ToLastModifiedDate>
               {/* <!--Optional:--> */}
               <sch:ToPostDate>?</sch:ToPostDate>
            </sch:Filter>
         </sch:request>
      </sch:GetPayments>
   </soapenv:Body>
</soapenv:Envelope>