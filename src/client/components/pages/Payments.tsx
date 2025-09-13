import { useState, useEffect } from 'react';
import PaymentList from '../resource-components/payments/PaymentList';
import type { Eob, Deposit } from '../../../shared/types/payment.types';

const Payments = () => {
  type Resource = 'eobs' | 'deposits' | 'matched';
  
  const BASE_URL = 'http://localhost:3000/api/payments';

  const fetchData = async (resource: Resource): Promise<void> => {
    const response = await fetch(`${BASE_URL}/${resource}`);

    const data = await response.json();

    switch (resource) {
      case 'eobs':
        setUnmatchedEobs(data.eobs);
        break;
      case 'deposits':
        setUnmatchedDeposits(data.deposits);
        break;
      case 'matched':
        setMatchedEobs(data.matchedEobs);
        break;
      default:
        break;
    }

    return;
  };

  const matchDeposits = async (): Promise<void> => {
    console.log('button clocked');

    const response = await fetch(`${BASE_URL}/match`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json()

    console.log(data)
    return
  }

  useEffect(() => {
    fetchData('eobs');
    fetchData('deposits');
    fetchData('matched');
  }, []);

  const [unmatchedEobs, setUnmatchedEobs] = useState<Eob[]>([]);

  const [unmatchedDeposits, setUnmatchedDeposits] = useState<Deposit[]>([]);

  const [matchedEobs, setMatchedEobs] = useState<Eob[]>([]);

  console.log({ unmatchedEobs, unmatchedDeposits, matchedEobs });
  // console.log('UNMATCHED EOBS', unmatchedEobs )

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Payment Reconciliation
        </h1>

        {/* Top Row - Two Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Left Column - Bank Deposits Need EOBs */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <button className="w-full mt-4 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg border-2 border-dashed border-gray-300 transition-colors">
              + Upload Bank File
            </button>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <span className="mr-2">🏦</span>
                Bank Deposits (Need EOBs)
              </h2>
              <span className="bg-red-100 text-red-800 text-sm font-medium px-2.5 py-0.5 rounded">
                {unmatchedDeposits.length} pending
              </span>
            </div>

            <div className="space-y-3">
              <PaymentList data={unmatchedDeposits} />
            </div>
          </div>

          {/* Right Column - EOBs Need Payments */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <button className="w-full mt-4 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg border-2 border-dashed border-gray-300 transition-colors">
              + Upload EOBs
            </button>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <span className="mr-2">📄</span>
                EOBs (Need Payments)
              </h2>
              <span className="bg-red-100 text-red-800 text-sm font-medium px-2.5 py-0.5 rounded">
                {unmatchedEobs.length} pending
              </span>
            </div>

            <div className="space-y-3">
              <PaymentList data={unmatchedEobs} />
            </div>
          </div>
        </div>

        {/* Bottom Row - Matched Payments */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <span className="mr-2">✅</span>
              Matched Payments
            </h2>

            <span className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded">
              {matchedEobs.length} matched
            </span>
          </div>
          <button
            className="w-full mt-4 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg border-2 border-dashed border-gray-300 transition-colors"
            onClick={matchDeposits}
          >
            Match Deposits
          </button>
          <div className="space-y-3">
            <PaymentList data={matchedEobs} />
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <div className="flex items-center justify-center">
            <span className="text-lg font-medium text-blue-900 mr-2">
              📊 Summary:
            </span>
            <span className="text-blue-800">
              {matchedEobs.length} Matched | {unmatchedEobs.length} EOBs Pending
              | {unmatchedDeposits.length} Deposits Pending
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;
