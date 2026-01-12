import { useCallback } from 'react';
import  useGlobalContext from '@client/hooks/useGlobalContext';
import { appointmentActions } from '@client/context/reducers/appointmentReducer';
import { appointmentServices, useAppointmentService } from '../services/appointmentServices';
import type { AppointmentData, DateRangeObject } from '@client/context/types/state';

export const useAppointment = () => {
  const { state, dispatch } = useGlobalContext();
    const { fetchAppointments } = useAppointmentService();


  const loadAppointments = useCallback(async () => {
    await fetchAppointments();
  }, [fetchAppointments]);

  const updateAppointment = useCallback(
    async (id: number, appointmentData: Partial<AppointmentData>) => {
      dispatch(appointmentActions.setLoading(true));
      try {
        const updatedAppointment = await appointmentServices.update(
          id,
          appointmentData
        );
        await loadAppointments(); // This will now dispatch to state
        return updatedAppointment;
      } catch (error) {
        dispatch(
          appointmentActions.setError(
            error instanceof Error
              ? error.message
              : 'Failed to update appointment'
          )
        );
        throw error;
      }
    },
    [dispatch, loadAppointments]
  );

  const toggleFilter = useCallback(
    (filterKey: string) => {
      dispatch(appointmentActions.toggleFilter(filterKey));
    },
    [dispatch]
  );

  const setDateRange = useCallback(
    (dateRange: DateRangeObject[]) => {
      dispatch(appointmentActions.setDateRange(dateRange));
    },
    [dispatch]
  );

return {
  // State
  appointments: state.appointments.data,
  rowFilterDetails: state.appointments.rowFilterDetails,
  allColumnHeaders: state.appointments.allColumnHeaders,
  selectedDateRange: state.appointments.selectedDateRange,
  isLoading: state.appointments.isLoading,
  error: state.appointments.error,

  // Actions
  loadAppointments,
  updateAppointment,
  toggleFilter,
  setDateRange,

  // Computed
  appointmentCount: state.appointments.data.length,
  hasError: !!state.appointments.error,
  isEmpty: state.appointments.data.length === 0,
};
};
