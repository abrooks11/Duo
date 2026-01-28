import { useCallback } from 'react';
import useGlobalContext from '../../../hooks/useGlobalContext';
import { reportActions } from '../../../context/reducers/reportReducer';
import type { ReportData, ReportFolder, ReportTemplate } from '../../../context/types/state';
import * as reportApi from './reportApi';

// Static service methods for direct API calls
export const reportServices = {
  async getFolders(): Promise<ReportFolder[]> {
    return reportApi.fetchFolders();
  },

  async createFolder(name: string): Promise<ReportFolder> {
    return reportApi.createFolder(name);
  },

  async updateFolder(id: string, data: { name?: string; sortOrder?: number }): Promise<ReportFolder> {
    return reportApi.updateFolder(id, data);
  },

  async deleteFolder(id: string): Promise<void> {
    return reportApi.deleteFolder(id);
  },

  async getReports(): Promise<ReportData[]> {
    return reportApi.fetchReports();
  },

  async getReport(id: string): Promise<ReportData> {
    return reportApi.fetchReport(id);
  },

  async createReport(data: { name: string; description: string; folderId?: string }): Promise<ReportData> {
    return reportApi.createReport(data);
  },

  async updateReport(id: string, data: { name?: string; description?: string; folderId?: string }): Promise<ReportData> {
    return reportApi.updateReport(id, data);
  },

  async deleteReport(id: string): Promise<void> {
    return reportApi.deleteReport(id);
  },

  async runReport(id: string): Promise<ReportData> {
    return reportApi.runReport(id);
  },

  async duplicateReport(id: string): Promise<ReportData> {
    return reportApi.duplicateReport(id);
  },

  async getTemplates(): Promise<ReportTemplate[]> {
    return reportApi.fetchTemplates();
  },
};

// Hook for integrating with global state
export const useReportServices = () => {
  const { dispatch } = useGlobalContext();

  const loadFolders = useCallback(async () => {
    dispatch(reportActions.setLoading(true));
    try {
      const folders = await reportServices.getFolders();
      dispatch(reportActions.getFolders(folders));
    } catch (error) {
      dispatch(reportActions.setError(error instanceof Error ? error.message : 'Failed to load folders'));
    }
  }, [dispatch]);

  const createReport = useCallback(async (data: { name: string; description: string; folderId?: string }) => {
    dispatch(reportActions.setCreating(true));
    try {
      const report = await reportServices.createReport(data);
      dispatch(reportActions.addReport(report));
      return report;
    } catch (error) {
      dispatch(reportActions.setError(error instanceof Error ? error.message : 'Failed to create report'));
      dispatch(reportActions.setCreating(false));
      throw error;
    }
  }, [dispatch]);

  const updateReport = useCallback(async (id: string, data: { name?: string; description?: string; folderId?: string }) => {
    dispatch(reportActions.setLoading(true));
    try {
      const report = await reportServices.updateReport(id, data);
      dispatch(reportActions.updateReport(report));
      return report;
    } catch (error) {
      dispatch(reportActions.setError(error instanceof Error ? error.message : 'Failed to update report'));
      throw error;
    }
  }, [dispatch]);

  const deleteReport = useCallback(async (id: string) => {
    dispatch(reportActions.setLoading(true));
    try {
      await reportServices.deleteReport(id);
      dispatch(reportActions.deleteReport(id));
    } catch (error) {
      dispatch(reportActions.setError(error instanceof Error ? error.message : 'Failed to delete report'));
      throw error;
    }
  }, [dispatch]);

  const refreshReport = useCallback(async (id: string) => {
    dispatch(reportActions.setRunning(true));
    try {
      const report = await reportServices.runReport(id);
      dispatch(reportActions.updateReport(report));
      return report;
    } catch (error) {
      dispatch(reportActions.setError(error instanceof Error ? error.message : 'Failed to refresh report'));
      throw error;
    }
  }, [dispatch]);

  const duplicateReport = useCallback(async (id: string) => {
    dispatch(reportActions.setLoading(true));
    try {
      const report = await reportServices.duplicateReport(id);
      dispatch(reportActions.addReport(report));
      return report;
    } catch (error) {
      dispatch(reportActions.setError(error instanceof Error ? error.message : 'Failed to duplicate report'));
      throw error;
    }
  }, [dispatch]);

  const createFolder = useCallback(async (name: string) => {
    dispatch(reportActions.setLoading(true));
    try {
      const folder = await reportServices.createFolder(name);
      dispatch(reportActions.addFolder(folder));
      return folder;
    } catch (error) {
      dispatch(reportActions.setError(error instanceof Error ? error.message : 'Failed to create folder'));
      throw error;
    }
  }, [dispatch]);

  const updateFolder = useCallback(async (id: string, data: { name?: string; sortOrder?: number }) => {
    dispatch(reportActions.setLoading(true));
    try {
      const folder = await reportServices.updateFolder(id, data);
      dispatch(reportActions.updateFolder(folder));
      return folder;
    } catch (error) {
      dispatch(reportActions.setError(error instanceof Error ? error.message : 'Failed to update folder'));
      throw error;
    }
  }, [dispatch]);

  const deleteFolder = useCallback(async (id: string) => {
    dispatch(reportActions.setLoading(true));
    try {
      await reportServices.deleteFolder(id);
      dispatch(reportActions.deleteFolder(id));
      // Reload folders to get updated Uncategorized folder
      await loadFolders();
    } catch (error) {
      dispatch(reportActions.setError(error instanceof Error ? error.message : 'Failed to delete folder'));
      throw error;
    }
  }, [dispatch, loadFolders]);

  return {
    loadFolders,
    createReport,
    updateReport,
    deleteReport,
    refreshReport,
    duplicateReport,
    createFolder,
    updateFolder,
    deleteFolder,
  };
};
