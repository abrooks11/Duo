import type {Eob, Deposit } from '../../../../shared/types/payment.types'

type PaymentListProps = {
  data: Eob[] | Deposit[]
}

const PaymentList = ({data}: PaymentListProps) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        No payments to display
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Payer</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Amount</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Reference</th>
            <th className="text-center py-3 px-4 font-semibold text-gray-700">Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={`${row.id}-${row.reference}`}
              className="border-b border-gray-100 hover:bg-gray-50"
            >
              <td className="py-3 px-4 text-gray-900">
                {new Date(row.createdDate).toLocaleDateString()}
              </td>
              <td className="py-3 px-4 text-gray-900">
                {row.payerName}
              </td>
              <td className="py-3 px-4 font-bold text-green-600">
                ${row.amount}
              </td>
              <td className="py-3 px-4 text-gray-900">
                {row.reference}
              </td>
              <td className="py-3 px-4 text-center">
                <span className="text-red-600 text-xl">❌</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentList;
