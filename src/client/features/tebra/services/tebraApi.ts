/**
 * Tebra API service layer
 * Handles communication with the Tebra SOAP API via backend proxy
 */

/**
 * Fetches appointments from Tebra API for a given date range
 * @param startDate - Start date in YYYY-MM-DD format
 * @param endDate - End date in YYYY-MM-DD format
 * @returns Promise with parsed appointment data
 */
export const fetchTebraAppointments = async (
  startDate: string,
  endDate: string
) => {
  const response = await fetch(
    `/api/tebra/appointments?startDate=${startDate}&endDate=${endDate}`,
    {
      method: 'GET',
      credentials: 'include',
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message?.err || 'Failed to fetch appointments from Tebra'
    );
  }

  return response.json();
};
