/** VISUAL COMPONENT
 * PROPS:
 * - RESOURCE TYPE [EOBS, DEPOSITS, MATCHED DEPOSITS]
 * - ARRAY OF OBJECTS

 */

/* EOB COlUMNS 
id
createdDate
reference
payerName
paymentMethod
amount
 */

/* DEPOSIT COLUMNS
id
createdDate
reference
payerName
amount
*/

const PaymentList = ({data}) => {
  return (
    <div>
      {data &&
        data.map((row) => {
          return <div
            key={`${row.id}-${row.reference}`}
            className="border border-red-200 rounded-lg p-4 bg-red-50"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className="font-medium text-gray-900">{row.createdDate}</span>
                <span className="font-medium text-gray-900">{row.payerName}</span>
                <span className="font-medium text-gray-900">{row.reference}</span>
                <span className="font-bold text-green-600 ml-3">
                  {/* ${row.amount.toFixed(2)} */}
                  ${row.amount}
                </span>
              </div>
              <span className="text-red-600 text-xl">❌</span>
            </div>
            
          </div>;
        })}
    </div>
  );
};

export default PaymentList;
