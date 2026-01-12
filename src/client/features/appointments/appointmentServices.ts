import { useCallback } from 'react';
import { apiClient, useApiWithState } from '@client/hooks/useApi';
import { appointmentActions } from '@client/context/reducers/appointmentReducer';
import type { AppointmentData } from '@client/context/types/state';


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

  const fetchAppointments = useCallback(() =>
    fetchAndDispatch<AppointmentData[]>(
      'appointments',
      appointmentActions.getAppointments,
      appointmentActions.setLoading,
      appointmentActions.setError
    ), [fetchAndDispatch]);

  return {
    fetchAppointments,
  };
};