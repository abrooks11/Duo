import type {Eob, Deposit } from '../../../../shared/types/payment.types'

type PaymentListProps = {
  data: Eob[] | Deposit[]
}

const PaymentList = ({data}: PaymentListProps) => {
  const getPaymentMethodLabel = (method: string) => {
    if (!method) return "❓ Not Set";
    
    // Convert to string and get the first character (the number part)
    const methodStr = String(method).toLowerCase();
    const methodCode = methodStr.charAt(0);
    
    // Handle descriptive payment methods (e.g., "4 - Electronic Funds Transfer")
    if (methodStr.includes('check') || methodCode === '1') {
      return "💸 Check";
    } else if (methodStr.includes('credit') || methodStr.includes('card') || methodCode === '3') {
      return "💳 Credit Card";
    } else if (methodStr.includes('electronic') || methodStr.includes('transfer') || methodStr.includes('eft') || methodCode === '4') {
      return "🏦 Electronic Transfer";
    }
    
    // Fallback to exact matches for simple codes
    switch (method) {
      case "1": return "💸 Check";
      case "3": return "💳 Credit Card";
      case "4": return "🏦 Electronic Transfer";
      case 1: 
      case "1.0": return "💸 Check";
      case 3:
      case "3.0": return "💳 Credit Card";
      case 4:
      case "4.0": return "🏦 Electronic Transfer";
      default: 
        return `❓ Unknown (${method})`;
    }
  };

  const getStatusIcon = (item: Eob | Deposit) => {
    if ('depositId' in item) {
      // This is an EOB
      const eob = item as Eob;
      if (eob.depositId) return "✅";
      if (eob.paymentMethod === "3") return "💳"; // Credit card doesn't need deposit
      return "❌";
    }
    // This is a Deposit
    return "❌";
  };

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
            {data.length > 0 && 'paymentMethod' in data[0] && (
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Method</th>
            )}
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
              {'paymentMethod' in row && (
                <td className="py-3 px-4 text-sm">
                  {getPaymentMethodLabel(row.paymentMethod)}
                </td>
              )}
              <td className="py-3 px-4 text-center">
                <span className="text-xl">{getStatusIcon(row)}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentList;
