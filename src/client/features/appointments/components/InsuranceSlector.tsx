
import { useState } from 'react';
import { useInsuranceExtractor } from '../hooks/useInsuranceExtractor';

const InsuranceSelector = () => {
  const { 
    insuranceCompanies, 
    extractPatientsByInsurance, 
    getPatientCount,
    totalAppointments 
  } = useInsuranceExtractor();
  
  const [selectedInsurance, setSelectedInsurance] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInsuranceClick = (insuranceCode: string) => {
    setSelectedInsurance(insuranceCode);
    setCopyStatus('idle');
  };

  const handleCopyToClipboard = async () => {
    if (!selectedInsurance) return;

    const data = extractPatientsByInsurance[selectedInsurance];
    if (!data) return;

    try {
      await navigator.clipboard.writeText(data);
      setCopyStatus('success');
      setTimeout(() => setCopyStatus('idle'), 2000);
    } catch (error) {
      setCopyStatus('error');
      setTimeout(() => setCopyStatus('idle'), 2000);
    }
  };

  const selectedCompany = insuranceCompanies.find(comp => comp.code === selectedInsurance);
  const selectedData = selectedInsurance ? extractPatientsByInsurance[selectedInsurance] : '';
  const selectedCount = selectedInsurance ? getPatientCount[selectedInsurance] : 0;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 w-full">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">
        Insurance Patient Extractor
      </h2>
      <p className="text-xs text-gray-600 mb-4">
        Extract patient ID and DOB for scheduled/confirmed appointments without copays within selected date range ({totalAppointments} total appointments)
      </p>

      {/* Insurance Company Buttons */}
      <div className="flex flex-col gap-2 mb-4">
        {insuranceCompanies.map((company) => (
          <button
            key={company.code}
            onClick={() => handleInsuranceClick(company.code)}
            className={`p-2 rounded border text-sm font-medium transition-colors flex justify-between items-center ${
              selectedInsurance === company.code
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            <span>{company.name}</span>
            <span className="text-xs opacity-75">
              {getPatientCount[company.code]} patients
            </span>
          </button>
        ))}
      </div>

      {/* Results Display */}
      {selectedInsurance && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-800">
              {selectedCompany?.name} - {selectedCount} Patients
            </h3>
            {selectedData && (
              <button
                onClick={handleCopyToClipboard}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  copyStatus === 'success' 
                    ? 'bg-green-100 text-green-700' 
                    : copyStatus === 'error'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {copyStatus === 'success' ? '✓ Copied!' : copyStatus === 'error' ? 'Copy Failed' : 'Copy to Clipboard'}
              </button>
            )}
          </div>

          <div className="bg-gray-50 rounded p-3">
            <div className="text-xs text-gray-600 mb-2">Format: PatientID,DOB</div>
            <textarea
              readOnly
              value={selectedData || 'No patients found for this insurance company.'}
              className="w-full h-32 p-2 text-xs font-mono bg-white border border-gray-300 rounded resize-none focus:outline-none"
              placeholder="Patient data will appear here..."
            />
          </div>
        </div>
      )}

      {!selectedInsurance && (
        <div className="text-center py-4 text-gray-500">
          <div className="text-sm font-medium mb-1">Select an Insurance Company</div>
          <div className="text-xs">Click a button above to extract patient data</div>
        </div>
      )}
    </div>
  );
};

export default InsuranceSelector;