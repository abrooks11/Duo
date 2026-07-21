import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { GlobalProvider } from '@client/context/GlobalContext';
import { GlobalContext } from '@client/context/GlobalContext';
import { useReports } from './useReports';
import type { GlobalState } from '@client/context/types/state';
import type { AppAction } from '@client/context/types/actions';
import type { ReportFolder, ReportData } from '@client/context/types/state';
import { initialGlobalState } from '@client/context/reducers/index.reducer';

// ============ MOCK service layer so hook tests stay unit-level ============
vi.mock('../services/reportServices', () => ({
  useReportServices: () => ({
    loadFolders: vi.fn(),
    createReport: vi.fn(),
    updateReport: vi.fn(),
    deleteReport: vi.fn(),
    refreshReport: vi.fn(),
    duplicateReport: vi.fn(),
    createFolder: vi.fn(),
    updateFolder: vi.fn(),
    deleteFolder: vi.fn(),
  }),
  reportServices: {
    getTemplates: vi.fn(),
  },
}));

// ============ FIXTURES ============

function makeReport(overrides: Partial<ReportData> = {}): ReportData {
  return {
    id: 'r1',
    name: 'Test Report',
    description: 'desc',
    sqlQuery: 'SELECT 1',
    cachedData: null,
    cachedAt: null,
    folderId: 'f1',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    ...overrides,
  };
}

function makeFolder(overrides: Partial<ReportFolder> = {}): ReportFolder {
  return {
    id: 'f1',
    name: 'My Folder',
    isDefault: false,
    sortOrder: 1,
    reports: [],
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    ...overrides,
  };
}

// ============ TEST PROVIDER ============
// Allows injecting a preset report slice into the context
function buildWrapper(reportState: Partial<GlobalState['reports']>) {
  const presetState: GlobalState = {
    ...initialGlobalState,
    reports: {
      ...initialGlobalState.reports,
      ...reportState,
    },
  };

  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    const [state, dispatch] = React.useReducer(
      (s: GlobalState, a: AppAction) => s,
      presetState
    );
    return (
      <GlobalContext.Provider value={{ state, dispatch }}>
        {children}
      </GlobalContext.Provider>
    );
  };

  return Wrapper;
}

// ============ TESTS ============

describe('useReports hook', () => {
  describe('allReports — flattening folders', () => {
    it('returns a flat array containing every report from every folder', () => {
      const r1 = makeReport({ id: 'r1', folderId: 'f1' });
      const r2 = makeReport({ id: 'r2', folderId: 'f2' });
      const f1 = makeFolder({ id: 'f1', reports: [r1] });
      const f2 = makeFolder({ id: 'f2', reports: [r2] });

      const { result } = renderHook(() => useReports(), {
        wrapper: buildWrapper({ folders: [f1, f2] }),
      });

      expect(result.current.allReports).toHaveLength(2);
      expect(result.current.allReports.map((r) => r.id)).toContain('r1');
      expect(result.current.allReports.map((r) => r.id)).toContain('r2');
    });

    it('returns an empty array when there are no folders', () => {
      const { result } = renderHook(() => useReports(), {
        wrapper: buildWrapper({ folders: [] }),
      });

      expect(result.current.allReports).toHaveLength(0);
    });

    it('returns an empty array when all folders are empty', () => {
      const f1 = makeFolder({ id: 'f1', reports: [] });
      const f2 = makeFolder({ id: 'f2', reports: [] });

      const { result } = renderHook(() => useReports(), {
        wrapper: buildWrapper({ folders: [f1, f2] }),
      });

      expect(result.current.allReports).toHaveLength(0);
    });
  });

  describe('selectedReport — finding the active report', () => {
    it('returns the report object matching the selected id', () => {
      const report = makeReport({ id: 'r-active', name: 'Active Report' });
      const folder = makeFolder({ id: 'f1', reports: [report] });

      const { result } = renderHook(() => useReports(), {
        wrapper: buildWrapper({ folders: [folder], selectedReportId: 'r-active' }),
      });

      expect(result.current.selectedReport).not.toBeNull();
      expect(result.current.selectedReport?.name).toBe('Active Report');
    });

    it('returns null when no report is selected', () => {
      const folder = makeFolder({ id: 'f1', reports: [makeReport()] });

      const { result } = renderHook(() => useReports(), {
        wrapper: buildWrapper({ folders: [folder], selectedReportId: null }),
      });

      expect(result.current.selectedReport).toBeNull();
    });

    it('returns null when the selected id does not match any existing report', () => {
      const folder = makeFolder({ id: 'f1', reports: [] });

      const { result } = renderHook(() => useReports(), {
        wrapper: buildWrapper({ folders: [folder], selectedReportId: 'ghost-id' }),
      });

      expect(result.current.selectedReport).toBeNull();
    });
  });

  describe('isEmpty — detecting an empty report library', () => {
    it('is true when no reports exist across any folder', () => {
      const f1 = makeFolder({ id: 'f1', reports: [] });

      const { result } = renderHook(() => useReports(), {
        wrapper: buildWrapper({ folders: [f1] }),
      });

      expect(result.current.isEmpty).toBe(true);
    });

    it('is false when at least one report exists', () => {
      const report = makeReport();
      const f1 = makeFolder({ id: 'f1', reports: [report] });

      const { result } = renderHook(() => useReports(), {
        wrapper: buildWrapper({ folders: [f1] }),
      });

      expect(result.current.isEmpty).toBe(false);
    });
  });

  describe('defaultFolders and customFolders — partitioning by isDefault', () => {
    it('puts folders with isDefault true into defaultFolders only', () => {
      const def = makeFolder({ id: 'f-def', isDefault: true });
      const custom = makeFolder({ id: 'f-cust', isDefault: false });

      const { result } = renderHook(() => useReports(), {
        wrapper: buildWrapper({ folders: [def, custom] }),
      });

      expect(result.current.defaultFolders).toHaveLength(1);
      expect(result.current.defaultFolders[0].id).toBe('f-def');
    });

    it('puts folders with isDefault false into customFolders only', () => {
      const def = makeFolder({ id: 'f-def', isDefault: true });
      const custom = makeFolder({ id: 'f-cust', isDefault: false });

      const { result } = renderHook(() => useReports(), {
        wrapper: buildWrapper({ folders: [def, custom] }),
      });

      expect(result.current.customFolders).toHaveLength(1);
      expect(result.current.customFolders[0].id).toBe('f-cust');
    });

    it('returns empty arrays when there are no folders at all', () => {
      const { result } = renderHook(() => useReports(), {
        wrapper: buildWrapper({ folders: [] }),
      });

      expect(result.current.defaultFolders).toHaveLength(0);
      expect(result.current.customFolders).toHaveLength(0);
    });
  });

  describe('getReportById — looking up a report by id', () => {
    it('returns the matching report when it exists', () => {
      const report = makeReport({ id: 'r-find', name: 'Find Me' });
      const folder = makeFolder({ id: 'f1', reports: [report] });

      const { result } = renderHook(() => useReports(), {
        wrapper: buildWrapper({ folders: [folder] }),
      });

      const found = result.current.getReportById('r-find');
      expect(found).toBeDefined();
      expect(found?.name).toBe('Find Me');
    });

    it('returns undefined when the id does not match any report', () => {
      const folder = makeFolder({ id: 'f1', reports: [] });

      const { result } = renderHook(() => useReports(), {
        wrapper: buildWrapper({ folders: [folder] }),
      });

      expect(result.current.getReportById('nope')).toBeUndefined();
    });
  });

  describe('getFolderById — looking up a folder by id', () => {
    it('returns the matching folder when it exists', () => {
      const folder = makeFolder({ id: 'f-target', name: 'Target Folder' });

      const { result } = renderHook(() => useReports(), {
        wrapper: buildWrapper({ folders: [folder] }),
      });

      const found = result.current.getFolderById('f-target');
      expect(found).toBeDefined();
      expect(found?.name).toBe('Target Folder');
    });

    it('returns undefined when no folder matches', () => {
      const { result } = renderHook(() => useReports(), {
        wrapper: buildWrapper({ folders: [] }),
      });

      expect(result.current.getFolderById('missing')).toBeUndefined();
    });
  });

  describe('reportCount', () => {
    it('reflects the total number of reports across all folders', () => {
      const f1 = makeFolder({ id: 'f1', reports: [makeReport({ id: 'r1' }), makeReport({ id: 'r2' })] });
      const f2 = makeFolder({ id: 'f2', reports: [makeReport({ id: 'r3' })] });

      const { result } = renderHook(() => useReports(), {
        wrapper: buildWrapper({ folders: [f1, f2] }),
      });

      expect(result.current.reportCount).toBe(3);
    });
  });
});
