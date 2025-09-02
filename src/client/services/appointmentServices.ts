import { apiClient, useApiWithState } from '../hooks/useApi';
import { appointmentActions } from '../context/reducers/appointmentReducer';
import type { AppointmentData } from '../context/types/state';


export const appointmentServices = {
  async getAll(): Promise<AppointmentData[]> {
    const response = await apiClient.get<AppointmentData[]>('appointments');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch appointments');
    }
    return response.data;
  },

  async update(
    id: number,
    appointment: Partial<AppointmentData>
  ): Promise<AppointmentData> {
    const response = await apiClient.put<AppointmentData>(
      `appointments/${id}`,
      appointment
    );
    if (!response.success) {
      throw new Error(response.error || 'Failed to update appointment');
    }
    return response.data;
  },
};

export const useAppointmentService = () => {
  const { fetchAndDispatch } = useApiWithState();

  return {
    fetchAppointments: () =>
      fetchAndDispatch<AppointmentData[]>(
        'appointments',
        appointmentActions.getAppointments,
        appointmentActions.setLoading,
        appointmentActions.setError
      ),
  };
};