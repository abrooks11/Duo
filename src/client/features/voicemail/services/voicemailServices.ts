import { useCallback } from 'react';
import { apiClient, useApiWithState } from '../../../hooks/useApi';
import { requestVoicemail, deleteVoicemail } from './voicemailApi'; // Keep existing logic
import { voicemailActions } from '../../../context/reducers/voicemailReducer';
import type { VoicemailData } from '../../../context/types/state';

export const voicemailServices = {
  async getAll(): Promise<VoicemailData[]> {
    try {
      // Use existing voicemail API logic
      const data = await requestVoicemail();
      return data;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Failed to fetch voicemails'
      );
    }
  },

  async getById(id: string): Promise<VoicemailData> {
    const response = await apiClient.get<VoicemailData>(`voicemail/${id}`);
    if (!response.success) {
      throw new Error(response.error || `Failed to fetch voicemail ${id}`);
    }
    return response.data;
  },

  async delete(id: string): Promise<void> {
    const result = await deleteVoicemail(id);
    if (result.status !== 200) {
      throw new Error('Failed to delete voicemail');
    }
  },

//   async markAsRead(id: string): Promise<VoicemailData> {
//     const response = await apiClient.put<VoicemailData>(`voicemail/${id}`, {
//       status: 'read',
//     });
//     if (!response.success) {
//       throw new Error(response.error || 'Failed to mark voicemail as read');
//     }
//     return response.data;
//   },
};

export const useVoicemailServices = () => {
  const { fetchAndDispatch } = useApiWithState();

  const fetchVoicemail = useCallback(() =>
    fetchAndDispatch<VoicemailData[]>(
      'voicemail',
      voicemailActions.getVoicemail,
      voicemailActions.setLoading,
      voicemailActions.setError
    ), [fetchAndDispatch]);

  return {
    fetchVoicemail,
  };
};
