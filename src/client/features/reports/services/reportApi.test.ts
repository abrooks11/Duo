// import { describe, it, expect, vi, beforeAll, afterAll, afterEach } from 'vitest';
// import { setupServer } from 'msw/node';
// import { http, HttpResponse } from 'msw';
// import {
//   fetchFolders,
//   createFolder,
//   updateFolder,
//   deleteFolder,
//   fetchReports,
//   fetchReport,
//   createReport,
//   updateReport,
//   deleteReport,
//   runReport,
//   duplicateReport,
// } from './reportApi';
// import type { ReportFolder, ReportData } from '@client/context/types/state';

// // ============ MOCK toast so it doesn't produce side-effects in tests ============
// vi.mock('react-toastify', () => ({
//   toast: {
//     success: vi.fn(),
//     error: vi.fn(),
//   },
// }));

// // ============ FIXTURES ============

// const BASE = 'http://localhost:3000/api';

// function makeFolder(overrides: Partial<ReportFolder> = {}): ReportFolder {
//   return {
//     id: 'f1',
//     name: 'My Folder',
//     isDefault: false,
//     sortOrder: 1,
//     reports: [],
//     createdAt: '2024-01-01T00:00:00.000Z',
//     updatedAt: '2024-01-01T00:00:00.000Z',
//     ...overrides,
//   };
// }

// function makeReport(overrides: Partial<ReportData> = {}): ReportData {
//   return {
//     id: 'r1',
//     name: 'Test Report',
//     description: 'A description',
//     sqlQuery: 'SELECT 1',
//     cachedData: null,
//     cachedAt: null,
//     folderId: 'f1',
//     createdAt: '2024-01-01T00:00:00.000Z',
//     updatedAt: '2024-01-01T00:00:00.000Z',
//     ...overrides,
//   };
// }

// // ============ MSW SERVER ============

// const server = setupServer();

// beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
// afterEach(() => server.resetHandlers());
// afterAll(() => server.close());

// // ============ FOLDER API TESTS ============

// describe('reportApi — folder operations', () => {
//   describe('fetchFolders', () => {
//     it('returns the array of folders from the server response', async () => {
//       const folders = [makeFolder({ id: 'f1' }), makeFolder({ id: 'f2' })];
//       server.use(
//         http.get(`${BASE}/reports/folders`, () =>
//           HttpResponse.json({ data: folders })
//         )
//       );

//       const result = await fetchFolders();

//       expect(result).toHaveLength(2);
//       expect(result[0].id).toBe('f1');
//     });

//     it('throws when the server returns an error status', async () => {
//       server.use(
//         http.get(`${BASE}/reports/folders`, () =>
//           HttpResponse.json({ message: 'Server error' }, { status: 500 })
//         )
//       );

//       await expect(fetchFolders()).rejects.toThrow('Failed to fetch folders');
//     });
//   });

//   describe('createFolder', () => {
//     it('returns the created folder from the server', async () => {
//       const folder = makeFolder({ id: 'f-new', name: 'New Folder' });
//       server.use(
//         http.post(`${BASE}/reports/folders`, () =>
//           HttpResponse.json({ data: folder })
//         )
//       );

//       const result = await createFolder('New Folder');

//       expect(result.id).toBe('f-new');
//       expect(result.name).toBe('New Folder');
//     });

//     it('throws when the server rejects folder creation', async () => {
//       server.use(
//         http.post(`${BASE}/reports/folders`, () =>
//           HttpResponse.json({ message: 'Bad request' }, { status: 400 })
//         )
//       );

//       await expect(createFolder('Bad')).rejects.toThrow('Failed to create folder');
//     });
//   });

//   describe('updateFolder', () => {
//     it('returns the updated folder from the server', async () => {
//       const folder = makeFolder({ id: 'f1', name: 'Renamed' });
//       server.use(
//         http.patch(`${BASE}/reports/folders/f1`, () =>
//           HttpResponse.json({ data: folder })
//         )
//       );

//       const result = await updateFolder('f1', { name: 'Renamed' });

//       expect(result.name).toBe('Renamed');
//     });

//     it('throws when the update fails', async () => {
//       server.use(
//         http.patch(`${BASE}/reports/folders/f1`, () =>
//           HttpResponse.json({ message: 'Not found' }, { status: 404 })
//         )
//       );

//       await expect(updateFolder('f1', { name: 'x' })).rejects.toThrow(
//         'Failed to update folder'
//       );
//     });
//   });

//   describe('deleteFolder', () => {
//     it('resolves without error on successful deletion', async () => {
//       server.use(
//         http.delete(`${BASE}/reports/folders/f1`, () =>
//           HttpResponse.json({ data: null })
//         )
//       );

//       await expect(deleteFolder('f1')).resolves.toBeUndefined();
//     });

//     it('throws when the deletion fails', async () => {
//       server.use(
//         http.delete(`${BASE}/reports/folders/f1`, () =>
//           HttpResponse.json({ message: 'Forbidden' }, { status: 403 })
//         )
//       );

//       await expect(deleteFolder('f1')).rejects.toThrow('Failed to delete folder');
//     });
//   });
// });

// // ============ REPORT API TESTS ============

// describe('reportApi — report operations', () => {
//   describe('fetchReports', () => {
//     it('returns all reports from the server', async () => {
//       const reports = [makeReport({ id: 'r1' }), makeReport({ id: 'r2' })];
//       server.use(
//         http.get(`${BASE}/reports`, () =>
//           HttpResponse.json({ data: reports })
//         )
//       );

//       const result = await fetchReports();

//       expect(result).toHaveLength(2);
//     });

//     it('throws when the request fails', async () => {
//       server.use(
//         http.get(`${BASE}/reports`, () =>
//           HttpResponse.json({ message: 'error' }, { status: 500 })
//         )
//       );

//       await expect(fetchReports()).rejects.toThrow('Failed to fetch reports');
//     });
//   });

//   describe('fetchReport', () => {
//     it('returns the single report matching the given id', async () => {
//       const report = makeReport({ id: 'r42', name: 'Specific Report' });
//       server.use(
//         http.get(`${BASE}/reports/r42`, () =>
//           HttpResponse.json({ data: report })
//         )
//       );

//       const result = await fetchReport('r42');

//       expect(result.id).toBe('r42');
//       expect(result.name).toBe('Specific Report');
//     });

//     it('throws when the report is not found', async () => {
//       server.use(
//         http.get(`${BASE}/reports/missing`, () =>
//           HttpResponse.json({ message: 'Not found' }, { status: 404 })
//         )
//       );

//       await expect(fetchReport('missing')).rejects.toThrow('Failed to fetch report');
//     });
//   });

//   describe('createReport', () => {
//     it('returns the newly created report from the server', async () => {
//       const report = makeReport({ id: 'r-created', name: 'Created Report' });
//       server.use(
//         http.post(`${BASE}/reports`, () =>
//           HttpResponse.json({ data: report })
//         )
//       );

//       const result = await createReport({ name: 'Created Report', description: 'desc' });

//       expect(result.id).toBe('r-created');
//     });

//     it('throws the error message from the server body on failure', async () => {
//       server.use(
//         http.post(`${BASE}/reports`, () =>
//           HttpResponse.json({ error: 'SQL generation failed' }, { status: 422 })
//         )
//       );

//       await expect(
//         createReport({ name: 'Bad', description: 'bad desc' })
//       ).rejects.toThrow('SQL generation failed');
//     });
//   });

//   describe('updateReport', () => {
//     it('returns the updated report from the server', async () => {
//       const report = makeReport({ id: 'r1', name: 'Updated' });
//       server.use(
//         http.patch(`${BASE}/reports/r1`, () =>
//           HttpResponse.json({ data: report })
//         )
//       );

//       const result = await updateReport('r1', { name: 'Updated' });

//       expect(result.name).toBe('Updated');
//     });

//     it('throws when the update is rejected', async () => {
//       server.use(
//         http.patch(`${BASE}/reports/r1`, () =>
//           HttpResponse.json({ error: 'Validation failed' }, { status: 400 })
//         )
//       );

//       await expect(updateReport('r1', { name: '' })).rejects.toThrow(
//         'Validation failed'
//       );
//     });
//   });

//   describe('deleteReport', () => {
//     it('resolves without error on successful deletion', async () => {
//       server.use(
//         http.delete(`${BASE}/reports/r1`, () =>
//           HttpResponse.json({ data: null })
//         )
//       );

//       await expect(deleteReport('r1')).resolves.toBeUndefined();
//     });

//     it('throws when the server rejects the deletion', async () => {
//       server.use(
//         http.delete(`${BASE}/reports/r1`, () =>
//           HttpResponse.json({ message: 'Not found' }, { status: 404 })
//         )
//       );

//       await expect(deleteReport('r1')).rejects.toThrow('Failed to delete report');
//     });
//   });

//   describe('runReport', () => {
//     it('returns the updated report with fresh data after running', async () => {
//       const report = makeReport({ id: 'r1', cachedData: [{ col: 'val' }] });
//       server.use(
//         http.post(`${BASE}/reports/r1/run`, () =>
//           HttpResponse.json({ data: report })
//         )
//       );

//       const result = await runReport('r1');

//       expect(result.cachedData).toHaveLength(1);
//     });

//     it('throws with the server error message when the query fails', async () => {
//       server.use(
//         http.post(`${BASE}/reports/r1/run`, () =>
//           HttpResponse.json({ error: 'Query timed out' }, { status: 500 })
//         )
//       );

//       await expect(runReport('r1')).rejects.toThrow('Query timed out');
//     });
//   });

//   describe('duplicateReport', () => {
//     it('returns the newly cloned report', async () => {
//       const report = makeReport({ id: 'r-copy', name: 'Copy of Report' });
//       server.use(
//         http.post(`${BASE}/reports/r1/duplicate`, () =>
//           HttpResponse.json({ data: report })
//         )
//       );

//       const result = await duplicateReport('r1');

//       expect(result.id).toBe('r-copy');
//     });

//     it('throws when duplication fails', async () => {
//       server.use(
//         http.post(`${BASE}/reports/r1/duplicate`, () =>
//           HttpResponse.json({ message: 'Server error' }, { status: 500 })
//         )
//       );

//       await expect(duplicateReport('r1')).rejects.toThrow('Failed to duplicate report');
//     });
//   });
// });
