// import { describe, it, expect } from 'vitest';
// import { reportReducer, initialReportState } from './reportReducer';
// import type { ReportState, ReportFolder, ReportData } from '../types/state';

// // ============ FIXTURES ============

// function makeReport(overrides: Partial<ReportData> = {}): ReportData {
//   return {
//     id: 'report-1',
//     name: 'Test Report',
//     description: 'A test report',
//     sqlQuery: 'SELECT * FROM patients',
//     cachedData: null,
//     cachedAt: null,
//     folderId: 'folder-1',
//     createdAt: '2024-01-01T00:00:00.000Z',
//     updatedAt: '2024-01-01T00:00:00.000Z',
//     ...overrides,
//   };
// }

// function makeFolder(overrides: Partial<ReportFolder> = {}): ReportFolder {
//   return {
//     id: 'folder-1',
//     name: 'My Folder',
//     isDefault: false,
//     sortOrder: 1,
//     reports: [],
//     createdAt: '2024-01-01T00:00:00.000Z',
//     updatedAt: '2024-01-01T00:00:00.000Z',
//     ...overrides,
//   };
// }

// function stateWith(overrides: Partial<ReportState>): ReportState {
//   return { ...initialReportState, ...overrides };
// }

// // ============ TESTS ============

// describe('Report Reducer', () => {
//   describe('GET_FOLDERS — loading folders from the server', () => {
//     it('replaces the folder list with the incoming folders', () => {
//       const folders = [makeFolder({ id: 'f1' }), makeFolder({ id: 'f2' })];
//       const result = reportReducer(initialReportState, {
//         type: 'reports/GET_FOLDERS',
//         payload: { folders },
//       });
//       expect(result.folders).toHaveLength(2);
//       expect(result.folders[0].id).toBe('f1');
//       expect(result.folders[1].id).toBe('f2');
//     });

//     it('clears the loading flag and any previous error', () => {
//       const state = stateWith({ isLoading: true, error: 'previous error' });
//       const result = reportReducer(state, {
//         type: 'reports/GET_FOLDERS',
//         payload: { folders: [] },
//       });
//       expect(result.isLoading).toBe(false);
//       expect(result.error).toBeNull();
//     });

//     it('does not change selectedReportId when called with unrelated folders', () => {
//       const state = stateWith({ selectedReportId: 'report-99' });
//       const result = reportReducer(state, {
//         type: 'reports/GET_FOLDERS',
//         payload: { folders: [] },
//       });
//       // GET_FOLDERS does not clear selectedReportId — that is the observed behavior
//       expect(result.selectedReportId).toBe('report-99');
//     });
//   });

//   describe('SELECT_REPORT — choosing a report', () => {
//     it('sets the selected report id to the given id', () => {
//       const result = reportReducer(initialReportState, {
//         type: 'reports/SELECT_REPORT',
//         payload: { reportId: 'report-42' },
//       });
//       expect(result.selectedReportId).toBe('report-42');
//     });

//     it('clears the selection when null is dispatched', () => {
//       const state = stateWith({ selectedReportId: 'report-42' });
//       const result = reportReducer(state, {
//         type: 'reports/SELECT_REPORT',
//         payload: { reportId: null },
//       });
//       expect(result.selectedReportId).toBeNull();
//     });
//   });

//   describe('ADD_REPORT — creating a new report', () => {
//     it('prepends the new report to its target folder', () => {
//       const existing = makeReport({ id: 'old', folderId: 'folder-1' });
//       const folder = makeFolder({ id: 'folder-1', reports: [existing] });
//       const state = stateWith({ folders: [folder] });
//       const newReport = makeReport({ id: 'new', folderId: 'folder-1' });

//       const result = reportReducer(state, {
//         type: 'reports/ADD_REPORT',
//         payload: { report: newReport },
//       });

//       const resultFolder = result.folders.find((f) => f.id === 'folder-1')!;
//       expect(resultFolder.reports[0].id).toBe('new');
//       expect(resultFolder.reports).toHaveLength(2);
//     });

//     it('falls back to Uncategorized when the target folder does not exist', () => {
//       const uncategorized = makeFolder({ id: 'u1', name: 'Uncategorized', reports: [] });
//       const state = stateWith({ folders: [uncategorized] });
//       const report = makeReport({ id: 'r1', folderId: 'nonexistent-folder' });

//       const result = reportReducer(state, {
//         type: 'reports/ADD_REPORT',
//         payload: { report },
//       });

//       const unc = result.folders.find((f) => f.name === 'Uncategorized')!;
//       expect(unc.reports).toHaveLength(1);
//       expect(unc.reports[0].id).toBe('r1');
//     });

//     it('selects the newly added report', () => {
//       const folder = makeFolder({ id: 'folder-1', reports: [] });
//       const state = stateWith({ folders: [folder], selectedReportId: null });
//       const report = makeReport({ id: 'r-new', folderId: 'folder-1' });

//       const result = reportReducer(state, {
//         type: 'reports/ADD_REPORT',
//         payload: { report },
//       });

//       expect(result.selectedReportId).toBe('r-new');
//     });

//     it('clears the isCreating flag after adding', () => {
//       const folder = makeFolder({ id: 'folder-1', reports: [] });
//       const state = stateWith({ folders: [folder], isCreating: true });
//       const report = makeReport({ folderId: 'folder-1' });

//       const result = reportReducer(state, {
//         type: 'reports/ADD_REPORT',
//         payload: { report },
//       });

//       expect(result.isCreating).toBe(false);
//     });
//   });

//   describe('UPDATE_REPORT — editing an existing report', () => {
//     it('updates the report in-place when the folder has not changed', () => {
//       const report = makeReport({ id: 'r1', folderId: 'folder-1', name: 'Old Name' });
//       const folder = makeFolder({ id: 'folder-1', reports: [report] });
//       const state = stateWith({ folders: [folder] });
//       const updated = { ...report, name: 'New Name' };

//       const result = reportReducer(state, {
//         type: 'reports/UPDATE_REPORT',
//         payload: { report: updated },
//       });

//       const resultFolder = result.folders.find((f) => f.id === 'folder-1')!;
//       expect(resultFolder.reports[0].name).toBe('New Name');
//       expect(resultFolder.reports).toHaveLength(1);
//     });

//     it('moves the report to the new folder when folderId changes', () => {
//       const report = makeReport({ id: 'r1', folderId: 'folder-1' });
//       const folder1 = makeFolder({ id: 'folder-1', reports: [report] });
//       const folder2 = makeFolder({ id: 'folder-2', reports: [] });
//       const state = stateWith({ folders: [folder1, folder2] });
//       const moved = { ...report, folderId: 'folder-2' };

//       const result = reportReducer(state, {
//         type: 'reports/UPDATE_REPORT',
//         payload: { report: moved },
//       });

//       const rf1 = result.folders.find((f) => f.id === 'folder-1')!;
//       const rf2 = result.folders.find((f) => f.id === 'folder-2')!;
//       expect(rf1.reports).toHaveLength(0);
//       expect(rf2.reports).toHaveLength(1);
//       expect(rf2.reports[0].id).toBe('r1');
//     });

//     it('clears the isRunning flag after updating', () => {
//       const report = makeReport({ id: 'r1', folderId: 'folder-1' });
//       const folder = makeFolder({ id: 'folder-1', reports: [report] });
//       const state = stateWith({ folders: [folder], isRunning: true });

//       const result = reportReducer(state, {
//         type: 'reports/UPDATE_REPORT',
//         payload: { report },
//       });

//       expect(result.isRunning).toBe(false);
//     });
//   });

//   describe('DELETE_REPORT — removing a report', () => {
//     it('removes the report from its folder', () => {
//       const r1 = makeReport({ id: 'r1', folderId: 'folder-1' });
//       const r2 = makeReport({ id: 'r2', folderId: 'folder-1' });
//       const folder = makeFolder({ id: 'folder-1', reports: [r1, r2] });
//       const state = stateWith({ folders: [folder] });

//       const result = reportReducer(state, {
//         type: 'reports/DELETE_REPORT',
//         payload: { reportId: 'r1' },
//       });

//       const rf = result.folders.find((f) => f.id === 'folder-1')!;
//       expect(rf.reports).toHaveLength(1);
//       expect(rf.reports[0].id).toBe('r2');
//     });

//     it('clears selectedReportId when the deleted report was selected', () => {
//       const r1 = makeReport({ id: 'r1', folderId: 'folder-1' });
//       const folder = makeFolder({ id: 'folder-1', reports: [r1] });
//       const state = stateWith({ folders: [folder], selectedReportId: 'r1' });

//       const result = reportReducer(state, {
//         type: 'reports/DELETE_REPORT',
//         payload: { reportId: 'r1' },
//       });

//       expect(result.selectedReportId).toBeNull();
//     });

//     it('leaves selectedReportId unchanged when a different report is deleted', () => {
//       const r1 = makeReport({ id: 'r1', folderId: 'folder-1' });
//       const r2 = makeReport({ id: 'r2', folderId: 'folder-1' });
//       const folder = makeFolder({ id: 'folder-1', reports: [r1, r2] });
//       const state = stateWith({ folders: [folder], selectedReportId: 'r2' });

//       const result = reportReducer(state, {
//         type: 'reports/DELETE_REPORT',
//         payload: { reportId: 'r1' },
//       });

//       expect(result.selectedReportId).toBe('r2');
//     });

//     it('is a no-op when the report id does not exist in any folder', () => {
//       const folder = makeFolder({ id: 'folder-1', reports: [] });
//       const state = stateWith({ folders: [folder] });

//       const result = reportReducer(state, {
//         type: 'reports/DELETE_REPORT',
//         payload: { reportId: 'nonexistent' },
//       });

//       expect(result.folders[0].reports).toHaveLength(0);
//     });
//   });

//   describe('ADD_FOLDER — creating a new folder', () => {
//     it('adds the folder to the folders list', () => {
//       const folder = makeFolder({ id: 'f-new', name: 'New Folder' });
//       const result = reportReducer(initialReportState, {
//         type: 'reports/ADD_FOLDER',
//         payload: { folder },
//       });
//       expect(result.folders).toHaveLength(1);
//       expect(result.folders[0].id).toBe('f-new');
//     });

//     it('sorts folders by sortOrder after adding', () => {
//       const existing = makeFolder({ id: 'f1', sortOrder: 2 });
//       const state = stateWith({ folders: [existing] });
//       const incoming = makeFolder({ id: 'f2', sortOrder: 1 });

//       const result = reportReducer(state, {
//         type: 'reports/ADD_FOLDER',
//         payload: { folder: incoming },
//       });

//       expect(result.folders[0].id).toBe('f2');
//       expect(result.folders[1].id).toBe('f1');
//     });
//   });

//   describe('UPDATE_FOLDER — renaming or reordering a folder', () => {
//     it('updates the folder name and sortOrder in place', () => {
//       const folder = makeFolder({ id: 'f1', name: 'Old Name', sortOrder: 5 });
//       const state = stateWith({ folders: [folder] });
//       const updated: ReportFolder = { ...folder, name: 'New Name', sortOrder: 10 };

//       const result = reportReducer(state, {
//         type: 'reports/UPDATE_FOLDER',
//         payload: { folder: updated },
//       });

//       expect(result.folders[0].name).toBe('New Name');
//       expect(result.folders[0].sortOrder).toBe(10);
//     });

//     it('preserves the existing reports inside the folder when updating', () => {
//       const report = makeReport({ id: 'r1', folderId: 'f1' });
//       const folder = makeFolder({ id: 'f1', name: 'Old', reports: [report] });
//       const state = stateWith({ folders: [folder] });
//       const updated: ReportFolder = { ...folder, name: 'New', reports: [] };

//       const result = reportReducer(state, {
//         type: 'reports/UPDATE_FOLDER',
//         payload: { folder: updated },
//       });

//       // Reports from the existing folder should be preserved
//       expect(result.folders[0].reports).toHaveLength(1);
//       expect(result.folders[0].reports[0].id).toBe('r1');
//     });

//     it('is a no-op when the folder id does not exist', () => {
//       const folder = makeFolder({ id: 'f1' });
//       const state = stateWith({ folders: [folder] });
//       const nonExistent = makeFolder({ id: 'nonexistent', name: 'Ghost' });

//       const result = reportReducer(state, {
//         type: 'reports/UPDATE_FOLDER',
//         payload: { folder: nonExistent },
//       });

//       expect(result.folders).toHaveLength(1);
//       expect(result.folders[0].id).toBe('f1');
//     });
//   });

//   describe('DELETE_FOLDER — removing a folder', () => {
//     it('removes the folder from the list', () => {
//       const f1 = makeFolder({ id: 'f1' });
//       const f2 = makeFolder({ id: 'f2' });
//       const state = stateWith({ folders: [f1, f2] });

//       const result = reportReducer(state, {
//         type: 'reports/DELETE_FOLDER',
//         payload: { folderId: 'f1' },
//       });

//       expect(result.folders).toHaveLength(1);
//       expect(result.folders[0].id).toBe('f2');
//     });

//     it('moves the deleted folder reports into Uncategorized when it exists', () => {
//       const report = makeReport({ id: 'r1', folderId: 'f1' });
//       const f1 = makeFolder({ id: 'f1', name: 'Custom', reports: [report] });
//       const uncategorized = makeFolder({ id: 'u1', name: 'Uncategorized', reports: [] });
//       const state = stateWith({ folders: [f1, uncategorized] });

//       const result = reportReducer(state, {
//         type: 'reports/DELETE_FOLDER',
//         payload: { folderId: 'f1' },
//       });

//       const unc = result.folders.find((f) => f.name === 'Uncategorized')!;
//       expect(unc.reports).toHaveLength(1);
//       expect(unc.reports[0].id).toBe('r1');
//     });

//     it('removes reports along with the folder when no Uncategorized folder exists', () => {
//       const report = makeReport({ id: 'r1', folderId: 'f1' });
//       const f1 = makeFolder({ id: 'f1', name: 'Custom', reports: [report] });
//       const f2 = makeFolder({ id: 'f2', name: 'Other', reports: [] });
//       const state = stateWith({ folders: [f1, f2] });

//       const result = reportReducer(state, {
//         type: 'reports/DELETE_FOLDER',
//         payload: { folderId: 'f1' },
//       });

//       // The folder is gone; reports were not orphaned into another folder
//       expect(result.folders).toHaveLength(1);
//       expect(result.folders[0].id).toBe('f2');
//     });
//   });

//   describe('SET_CREATING — tracking form visibility', () => {
//     it('sets isCreating to true', () => {
//       const result = reportReducer(initialReportState, {
//         type: 'reports/SET_CREATING',
//         payload: { isCreating: true },
//       });
//       expect(result.isCreating).toBe(true);
//     });

//     it('sets isCreating to false', () => {
//       const state = stateWith({ isCreating: true });
//       const result = reportReducer(state, {
//         type: 'reports/SET_CREATING',
//         payload: { isCreating: false },
//       });
//       expect(result.isCreating).toBe(false);
//     });
//   });

//   describe('SET_RUNNING — tracking query execution', () => {
//     it('sets isRunning to true while a report is executing', () => {
//       const result = reportReducer(initialReportState, {
//         type: 'reports/SET_RUNNING',
//         payload: { isRunning: true },
//       });
//       expect(result.isRunning).toBe(true);
//     });

//     it('sets isRunning to false when execution completes', () => {
//       const state = stateWith({ isRunning: true });
//       const result = reportReducer(state, {
//         type: 'reports/SET_RUNNING',
//         payload: { isRunning: false },
//       });
//       expect(result.isRunning).toBe(false);
//     });
//   });

//   describe('SET_LOADING — tracking async operations', () => {
//     it('sets isLoading to true and clears any existing error', () => {
//       const state = stateWith({ error: 'old error' });
//       const result = reportReducer(state, {
//         type: 'reports/SET_LOADING',
//         payload: { isLoading: true },
//       });
//       expect(result.isLoading).toBe(true);
//       expect(result.error).toBeNull();
//     });

//     it('sets isLoading to false without touching the error field', () => {
//       const state = stateWith({ isLoading: true, error: 'existing error' });
//       const result = reportReducer(state, {
//         type: 'reports/SET_LOADING',
//         payload: { isLoading: false },
//       });
//       expect(result.isLoading).toBe(false);
//       // error is preserved when loading is set to false
//       expect(result.error).toBe('existing error');
//     });
//   });

//   describe('SET_ERROR — recording failures', () => {
//     it('stores the error message and clears loading and running flags', () => {
//       const state = stateWith({ isLoading: true, isRunning: true });
//       const result = reportReducer(state, {
//         type: 'reports/SET_ERROR',
//         payload: { error: 'Something went wrong' },
//       });
//       expect(result.error).toBe('Something went wrong');
//       expect(result.isLoading).toBe(false);
//       expect(result.isRunning).toBe(false);
//     });

//     it('clears a previous error when null is dispatched', () => {
//       const state = stateWith({ error: 'old error' });
//       const result = reportReducer(state, {
//         type: 'reports/SET_ERROR',
//         payload: { error: null },
//       });
//       expect(result.error).toBeNull();
//     });
//   });

//   describe('SET_UNSAVED — tracking unsaved changes', () => {
//     it('sets hasUnsavedChanges to true when edits are pending', () => {
//       const result = reportReducer(initialReportState, {
//         type: 'reports/SET_UNSAVED',
//         payload: { hasUnsavedChanges: true },
//       });
//       expect(result.hasUnsavedChanges).toBe(true);
//     });

//     it('clears hasUnsavedChanges after saving', () => {
//       const state = stateWith({ hasUnsavedChanges: true });
//       const result = reportReducer(state, {
//         type: 'reports/SET_UNSAVED',
//         payload: { hasUnsavedChanges: false },
//       });
//       expect(result.hasUnsavedChanges).toBe(false);
//     });
//   });
// });
