import { useCallback } from 'react';
import useGlobalContext from './useGlobalContext';
import { voicemailServices, useVoicemailService } from '../services/voicemailServices';
import { voicemailActions } from '../context/reducers/voicemailReducer';

export const useVoicemail = () => {
  const { state, dispatch } = useGlobalContext();
  const { fetchVoicemail } = useVoicemailService();

  const loadVoicemail = useCallback(async () => {
    await fetchVoicemail();
  }, [fetchVoicemail]);

   const deleteVoicemail = useCallback(
     async (id: string) => {
       dispatch(voicemailActions.setLoading(true));

       try {
         await voicemailServices.delete(id);
         await loadVoicemail(); // Refresh list
       } catch (error) {
         dispatch(
           voicemailActions.setError(
             error instanceof Error
               ? error.message
               : 'Failed to delete voicemail'
           )
         );
         throw error;
       }
     },
     [dispatch, loadVoicemail]
   );

  const toggleFilter = useCallback(
    (filterKey: string) => {
      dispatch(voicemailActions.toggleFilter(filterKey));
    },
    [dispatch]
  );

  return {
    // State
    voicemail: state.voicemail.data,
    rowFilterDetails: state.voicemail.rowFilterDetails,
    allColumnHeaders: state.voicemail.allColumnHeaders,
    isLoading: state.voicemail.isLoading,
    error: state.voicemail.error,

    // Actions
    loadVoicemail,
    deleteVoicemail,
    toggleFilter,

    // Computed
    voicemailCount: state.voicemail.data.length,
    hasError: !!state.voicemail.error,
    isEmpty: state.voicemail.data.length === 0,
  };
};
