const Demo = () => {
  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* <!-- Header --> */}
      <div className="bg-white shadow rounded-lg mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Patient Data Dashboard
            </h1>
            <button>
              Refresh Data
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* <!-- Personal Information --> */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Personal Information
            </h2>
          </div>
          <div className="px-6 py-4">
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Name</dt>
                <dd id="name" className="mt-1 text-sm text-gray-900">
                  Loading...
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Date of Birth
                </dt>
                <dd id="dob" className="mt-1 text-sm text-gray-900">
                  Loading...
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Mobile</dt>
                <dd id="mobile" className="mt-1 text-sm text-gray-900">
                  Loading...
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd id="email" className="mt-1 text-sm text-gray-900">
                  Loading...
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* <!-- Insurance Information --> */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Insurance Information
            </h2>
          </div>
          <div className="px-6 py-4">
            <dl className="grid grid-cols-1 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Member ID</dt>
                <dd id="memberId" className="mt-1 text-sm text-gray-900">
                  Loading...
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">EDI</dt>
                <dd id="edi" className="mt-1 text-sm text-gray-900">
                  Loading...
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Address</dt>
                <dd id="address" className="mt-1 text-sm text-gray-900">
                  Loading...
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* <!-- Eligibility Information --> */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Eligibility Information
            </h2>
          </div>
          <div className="px-6 py-4">
            <dl className="grid grid-cols-1 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Plan Type</dt>
                <dd id="planType" className="mt-1 text-sm text-gray-900">
                  Loading...
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Network Status
                </dt>
                <dd id="networkStatus" className="mt-1 text-sm text-gray-900">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Loading...
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Claims Address
                </dt>
                <dd id="claimsAddress" className="mt-1 text-sm text-gray-900">
                  Loading...
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* <!-- Estimate Generator --> */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Generate Estimate
            </h2>
          </div>
          <div className="px-6 py-4 space-y-6">
            <div>
              <label
                htmlFor="insuranceCompany"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Insurance Company
              </label>
              <select
                id="insuranceCompany"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Insurance Company</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Service Type (CPT/ICD)
              </label>
              <div
                id="serviceTypes"
                className="space-y-3 max-h-48 overflow-y-auto border border-gray-200 rounded-md p-3"
              >
              </div>
            </div>

            <button className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
              Generate Estimate
            </button>
          </div>
        </div>
      </div>

      {/* <!-- Status Bar --> */}
      <div className="mt-6 bg-white shadow rounded-lg">
        <div className="px-6 py-3">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>
              Last updated: <span id="lastUpdated">Never</span>
            </span>
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <span className="h-2 w-2 bg-green-400 rounded-full mr-2"></span>
                Connected
              </span>
              <span>Patient ID: #12345</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Demo;
