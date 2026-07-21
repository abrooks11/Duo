import { produce } from 'immer';

import type { ReportState, ReportFolder, ReportData } from '../types/state';
import type { ReportAction } from '../types/actions';

export const initialReportState: ReportState = {
  folders: [],
  selectedReportId: null,
  isCreating: false,
  isRunning: false,
  hasUnsavedChanges: false,
  isLoading: false,
  error: null,
};

export const reportReducer = (
  state: ReportState,
  action: ReportAction
): ReportState => {
  return produce(state, (draft) => {
    switch (action.type) {
      case 'reports/GET_FOLDERS':
        draft.folders = action.payload.folders;
        draft.isLoading = false;
        draft.error = null;
        break;

      case 'reports/SELECT_REPORT':
        draft.selectedReportId = action.payload.reportId;
        break;

      case 'reports/SET_CREATING':
        draft.isCreating = action.payload.isCreating;
        break;

      case 'reports/SET_RUNNING':
        draft.isRunning = action.payload.isRunning;
        break;

      case 'reports/ADD_REPORT':
        const newReport = action.payload.report;
        // Find the folder and add the report to it
        const targetFolder = draft.folders.find(
          (f) => f.id === newReport.folderId
        );
        if (targetFolder) {
          targetFolder.reports.unshift(newReport);
        } else {
          // Add to Uncategorized if folder not found
          const uncategorized = draft.folders.find(
            (f) => f.name === 'Uncategorized'
          );
          if (uncategorized) {
            uncategorized.reports.unshift(newReport);
          }
        }
        draft.selectedReportId = newReport.id;
        draft.isCreating = false;
        break;

      case 'reports/UPDATE_REPORT':
        const updatedReport = action.payload.report;
        // Find and update the report in all folders
        for (const folder of draft.folders) {
          const reportIndex = folder.reports.findIndex(
            (r) => r.id === updatedReport.id
          );
          if (reportIndex !== -1) {
            // If folder changed, remove from current folder
            if (folder.id !== updatedReport.folderId) {
              folder.reports.splice(reportIndex, 1);
              // Add to new folder
              const newFolder = draft.folders.find(
                (f) => f.id === updatedReport.folderId
              );
              if (newFolder) {
                newFolder.reports.unshift(updatedReport);
              }
            } else {
              // Update in place
              folder.reports[reportIndex] = updatedReport;
            }
            break;
          }
        }
        draft.isRunning = false;
        break;

      case 'reports/DELETE_REPORT':
        const reportIdToDelete = action.payload.reportId;
        for (const folder of draft.folders) {
          const index = folder.reports.findIndex(
            (r) => r.id === reportIdToDelete
          );
          if (index !== -1) {
            folder.reports.splice(index, 1);
            break;
          }
        }
        if (draft.selectedReportId === reportIdToDelete) {
          draft.selectedReportId = null;
        }
        break;

      case 'reports/ADD_FOLDER':
        draft.folders.push(action.payload.folder);
        // Sort by sortOrder
        draft.folders.sort((a, b) => a.sortOrder - b.sortOrder);
        break;

      case 'reports/UPDATE_FOLDER':
        const updatedFolder = action.payload.folder;
        const folderIndex = draft.folders.findIndex(
          (f) => f.id === updatedFolder.id
        );
        if (folderIndex !== -1) {
          // Preserve reports when updating folder
          const existingFolder = draft.folders[folderIndex];
          const existingReports = existingFolder ? existingFolder.reports : [];
          draft.folders[folderIndex] = {
            ...updatedFolder,
            reports: existingReports,
          };
        }
        break;

      case 'reports/DELETE_FOLDER':
        const folderIdToDelete = action.payload.folderId;
        const folderToDeleteIndex = draft.folders.findIndex(
          (f) => f.id === folderIdToDelete
        );
        if (folderToDeleteIndex !== -1) {
          // Move reports to Uncategorized
          const folderToDelete = draft.folders[folderToDeleteIndex];
          const reportsToMove = folderToDelete ? folderToDelete.reports : [];
          const uncategorizedFolder = draft.folders.find(
            (f) => f.name === 'Uncategorized'
          );
          if (uncategorizedFolder && reportsToMove.length > 0) {
            uncategorizedFolder.reports.push(...reportsToMove);
          }
          // Remove the folder
          draft.folders.splice(folderToDeleteIndex, 1);
        }
        break;

      case 'reports/SET_UNSAVED':
        draft.hasUnsavedChanges = action.payload.hasUnsavedChanges;
        break;

      case 'reports/SET_LOADING':
        draft.isLoading = action.payload.isLoading;
        if (action.payload.isLoading) {
          draft.error = null;
        }
        break;

      case 'reports/SET_ERROR':
        draft.error = action.payload.error;
        draft.isLoading = false;
        draft.isRunning = false;
        break;

      default:
        break;
    }
  });
};

// Action creators for reports
export const reportActions = {
  getFolders: (folders: ReportFolder[]): ReportAction => ({
    type: 'reports/GET_FOLDERS',
    payload: { folders },
  }),

  selectReport: (reportId: string | null): ReportAction => ({
    type: 'reports/SELECT_REPORT',
    payload: { reportId },
  }),

  setCreating: (isCreating: boolean): ReportAction => ({
    type: 'reports/SET_CREATING',
    payload: { isCreating },
  }),

  setRunning: (isRunning: boolean): ReportAction => ({
    type: 'reports/SET_RUNNING',
    payload: { isRunning },
  }),

  addReport: (report: ReportData): ReportAction => ({
    type: 'reports/ADD_REPORT',
    payload: { report },
  }),

  updateReport: (report: ReportData): ReportAction => ({
    type: 'reports/UPDATE_REPORT',
    payload: { report },
  }),

  deleteReport: (reportId: string): ReportAction => ({
    type: 'reports/DELETE_REPORT',
    payload: { reportId },
  }),

  addFolder: (folder: ReportFolder): ReportAction => ({
    type: 'reports/ADD_FOLDER',
    payload: { folder },
  }),

  updateFolder: (folder: ReportFolder): ReportAction => ({
    type: 'reports/UPDATE_FOLDER',
    payload: { folder },
  }),

  deleteFolder: (folderId: string): ReportAction => ({
    type: 'reports/DELETE_FOLDER',
    payload: { folderId },
  }),

  setUnsaved: (hasUnsavedChanges: boolean): ReportAction => ({
    type: 'reports/SET_UNSAVED',
    payload: { hasUnsavedChanges },
  }),

  setLoading: (isLoading: boolean): ReportAction => ({
    type: 'reports/SET_LOADING',
    payload: { isLoading },
  }),

  setError: (error: string | null): ReportAction => ({
    type: 'reports/SET_ERROR',
    payload: { error },
  }),
};
