import type {Eob, Deposit } from '../../../../shared/types/payment.types'

type PaymentListProps = {
  data: Eob[] | Deposit[]
}

const PaymentList = ({data}: PaymentListProps) => {
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
                <span className="font-medium text-gray-900">{new Date(row.createdDate).toLocaleDateString()}</span>
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
