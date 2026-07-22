// import { useCallback, useMemo } from 'react';
// import useGlobalContext from '../../../hooks/useGlobalContext';
// import { reportActions } from '../../../context/reducers/reportReducer';
// import { useReportServices, reportServices } from '../services/reportServices';
// import type { ReportData, ReportFolder } from '../../../context/types/state';

// export const useReports = () => {
//   const { state, dispatch } = useGlobalContext();
//   const services = useReportServices();

//   // ============ STATE SELECTORS ============

//   const folders = state.reports.folders;
//   const selectedReportId = state.reports.selectedReportId;
//   const isCreating = state.reports.isCreating;
//   const isRunning = state.reports.isRunning;
//   const hasUnsavedChanges = state.reports.hasUnsavedChanges;
//   const isLoading = state.reports.isLoading;
//   const error = state.reports.error;

//   // Get all reports from all folders
//   const allReports = useMemo(() => {
//     return folders.flatMap((folder) => folder.reports);
//   }, [folders]);

//   // Get the currently selected report
//   const selectedReport = useMemo(() => {
//     if (!selectedReportId) return null;
//     return allReports.find((r) => r.id === selectedReportId) || null;
//   }, [selectedReportId, allReports]);

//   // Get report count
//   const reportCount = allReports.length;

//   // Check if empty
//   const isEmpty = reportCount === 0;

//   // ============ ACTIONS ============

//   const selectReport = useCallback(
//     (reportId: string | null) => {
//       dispatch(reportActions.selectReport(reportId));
//     },
//     [dispatch]
//   );

//   const setCreating = useCallback(
//     (isCreating: boolean) => {
//       dispatch(reportActions.setCreating(isCreating));
//     },
//     [dispatch]
//   );

//   const setUnsaved = useCallback(
//     (hasUnsavedChanges: boolean) => {
//       dispatch(reportActions.setUnsaved(hasUnsavedChanges));
//     },
//     [dispatch]
//   );

//   const clearError = useCallback(() => {
//     dispatch(reportActions.setError(null));
//   }, [dispatch]);

//   // ============ COMPUTED HELPERS ============

//   // Find report by ID
//   const getReportById = useCallback(
//     (id: string): ReportData | undefined => {
//       return allReports.find((r) => r.id === id);
//     },
//     [allReports]
//   );

//   // Find folder by ID
//   const getFolderById = useCallback(
//     (id: string): ReportFolder | undefined => {
//       return folders.find((f) => f.id === id);
//     },
//     [folders]
//   );

//   // Get reports in a specific folder
//   const getReportsInFolder = useCallback(
//     (folderId: string): ReportData[] => {
//       const folder = folders.find((f) => f.id === folderId);
//       return folder?.reports || [];
//     },
//     [folders]
//   );

//   // Get default folders (pre-defined)
//   const defaultFolders = useMemo(() => {
//     return folders.filter((f) => f.isDefault);
//   }, [folders]);

//   // Get custom folders (user-created)
//   const customFolders = useMemo(() => {
//     return folders.filter((f) => !f.isDefault);
//   }, [folders]);

//   return {
//     // State
//     folders,
//     selectedReportId,
//     selectedReport,
//     isCreating,
//     isRunning,
//     hasUnsavedChanges,
//     isLoading,
//     error,

//     // Computed
//     allReports,
//     reportCount,
//     isEmpty,
//     defaultFolders,
//     customFolders,

//     // Actions
//     selectReport,
//     setCreating,
//     setUnsaved,
//     clearError,

//     // Helpers
//     getReportById,
//     getFolderById,
//     getReportsInFolder,

//     // Service methods (async operations)
//     loadFolders: services.loadFolders,
//     createReport: services.createReport,
//     updateReport: services.updateReport,
//     deleteReport: services.deleteReport,
//     refreshReport: services.refreshReport,
//     duplicateReport: services.duplicateReport,
//     createFolder: services.createFolder,
//     updateFolder: services.updateFolder,
//     deleteFolder: services.deleteFolder,

//     // Static services for direct API calls
//     fetchTemplates: reportServices.getTemplates,
//   };
// };

// export default useReports;
