import { useState, useEffect } from 'react';
import PaymentList from '../resource-components/payments/PaymentList';
import type { Eob, Deposit } from '../../../server/types/payment.types';

const Payments = () => {
  type Resource = 'eobs' | 'deposits' | 'matched';
  
  const BASE_URL = 'http://localhost:3000/api/payments';
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>('all');

  const fetchData = async (resource: Resource): Promise<void> => {
    const response = await fetch(`${BASE_URL}/${resource}`);

    const data = await response.json();

    // Sort by date (most recent first)
    const sortByDate = (items: any[]) => {
      return items.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
    };

    switch (resource) {
      case 'eobs':
        setUnmatchedEobs(sortByDate(data.eobs || []));
        break;
      case 'deposits':
        setUnmatchedDeposits(sortByDate(data.deposits || []));
        break;
      case 'matched':
        setMatchedEobs(sortByDate(data.matchedEobs || []));
        break;
      default:
        break;
    }

    return;
  };

  const fetchEobsByPaymentMethod = async (method: string): Promise<void> => {
    // Sort function for consistency
    const sortByDate = (items: any[]) => {
      return items.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
    };

    if (method === 'all') {
      await fetchData('eobs');
    } else {
      const response = await fetch(`${BASE_URL}/eobs/method/${method}`);
      const data = await response.json();
      setUnmatchedEobs(sortByDate(data.eobs || []));
    }
  };

  const fetchValidationData = async (): Promise<any> => {
    try {
      const response = await fetch(`${BASE_URL}/validation/completeness`);
      const data = await response.json();
      return data.validation;
    } catch (error) {
      console.error('Failed to fetch validation data:', error);
      return null;
    }
  };

  const matchDeposits = async (): Promise<void> => {
    console.log('Starting matching process...');

    const response = await fetch(`${BASE_URL}/match`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    console.log('Match results:', data);
    
    // Refresh all data after matching
    await fetchData('eobs');
    await fetchData('deposits');
    await fetchData('matched');
    
    return;
  };

  useEffect(() => {
    fetchData('eobs');
    fetchData('deposits');
    fetchData('matched');
    
    // Fetch validation data
    fetchValidationData().then(setValidationData);
  }, []);

  const [unmatchedEobs, setUnmatchedEobs] = useState<Eob[]>([]);

  const [unmatchedDeposits, setUnmatchedDeposits] = useState<Deposit[]>([]);

  const [matchedEobs, setMatchedEobs] = useState<Eob[]>([]);
  const [validationData, setValidationData] = useState<any>(null);

  console.log({ unmatchedEobs, unmatchedDeposits, matchedEobs });
  // console.log('UNMATCHED EOBS', unmatchedEobs )

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Payment Reconciliation
        </h1>

        {/* Payment Method Filter */}
        <div className="mb-6 bg-white rounded-lg shadow-md p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter EOBs by Payment Method:
          </label>
          <select 
            value={paymentMethodFilter} 
            onChange={(e) => {
              setPaymentMethodFilter(e.target.value);
              fetchEobsByPaymentMethod(e.target.value);
            }}
            className="border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="all">All EOBs</option>
            <option value="1">💸 Checks Only</option>
            <option value="3">💳 Credit Cards Only</option>
            <option value="4">🏦 Electronic Funds Transfer Only</option>
          </select>
        </div>

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

        {/* Enhanced Workflow Monitoring */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Summary Stats */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-blue-900 mb-4">📊 Current Status</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Matched EOBs:</span>
                <span className="font-semibold text-green-600">{matchedEobs.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Pending EOBs:</span>
                <span className="font-semibold text-orange-600">{unmatchedEobs.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Pending Deposits:</span>
                <span className="font-semibold text-red-600">{unmatchedDeposits.length}</span>
              </div>
            </div>
          </div>

          {/* Phase 2 Monitoring */}
          {validationData && (
            <>
              <div className="bg-yellow-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-yellow-900 mb-4">⚠️ EFT Monitoring</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>EFT EOBs without Deposits:</span>
                    <span className="font-semibold text-red-600">
                      {validationData.eftEobsWithoutDeposits}
                    </span>
                  </div>
                  <div className="text-xs text-yellow-700 mt-2">
                    These should have corresponding ACH deposits
                  </div>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-green-900 mb-4">💳 Payment Methods</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>💸 Checks:</span>
                    <span className="font-semibold">{validationData.checkEobsCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>💳 Credit Cards:</span>
                    <span className="font-semibold">{validationData.creditCardEobsCount}</span>
                  </div>
                  <div className="text-xs text-green-700 mt-2">
                    Credit cards don't need ACH deposits
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payments;
