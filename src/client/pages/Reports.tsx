import { useEffect, useCallback } from 'react';
import { Box, CircularProgress } from '@mui/material';
import * as XLSX from 'xlsx';

import ReportsSidebar from '@client/features/reports/components/ReportsSidebar';
import ReportView from '@client/features/reports/components/ReportView';
import { useReports } from '@client/features/reports/hooks/useReports';
import type { ReportData } from '@client/context/types/state';

const Reports = () => {
  const {
    // State
    folders,
    selectedReportId,
    selectedReport,
    isCreating,
    isRunning,
    isLoading,
    error,

    // Actions
    selectReport,
    setCreating,
    // Async operations
    loadFolders,
    createReport,
    updateReport,
    deleteReport,
    refreshReport,
    duplicateReport,
    createFolder,
    updateFolder,
    deleteFolder,
  } = useReports();

  // Load folders on mount
  useEffect(() => {
    if (folders.length === 0) {
      loadFolders();
    }
  }, [folders.length, loadFolders]);

  // Handle create report
  const handleCreateReport = useCallback(
    async (data: { name: string; description: string; folderId?: string }) => {
      await createReport(data);
    },
    [createReport]
  );

  // Handle edit report
  const handleEditReport = useCallback(
    async (id: string, data: { name?: string; description?: string }) => {
      await updateReport(id, data);
    },
    [updateReport]
  );

  // Handle delete report
  const handleDeleteReport = useCallback(
    async (id: string) => {
      await deleteReport(id);
    },
    [deleteReport]
  );

  // Handle refresh report
  const handleRefreshReport = useCallback(
    async (id: string) => {
      await refreshReport(id);
    },
    [refreshReport]
  );

  // Handle duplicate report
  const handleDuplicateReport = useCallback(
    async (id: string) => {
      await duplicateReport(id);
    },
    [duplicateReport]
  );

  // Handle export to Excel
  const handleExport = useCallback((report: ReportData) => {
    if (!report.cachedData || report.cachedData.length === 0) {
      return;
    }

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(report.cachedData);

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Report Data');

    // Generate filename
    const filename = `${report.name.replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`;

    // Download file
    XLSX.writeFile(wb, filename);
  }, []);

  // Handle create folder
  const handleCreateFolder = useCallback(
    async (name: string) => {
      await createFolder(name);
    },
    [createFolder]
  );

  // Handle delete folder
  const handleDeleteFolder = useCallback(
    async (id: string) => {
      await deleteFolder(id);
    },
    [deleteFolder]
  );

  // Handle rename folder
  const handleRenameFolder = useCallback(
    async (id: string, newName: string) => {
      await updateFolder(id, { name: newName });
    },
    [updateFolder]
  );

  // Initial loading state
  if (isLoading && folders.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        height: 'calc(100vh - 120px)', // Account for header/footer
        overflow: 'hidden',
      }}
    >
      {/* Sidebar */}
      <ReportsSidebar
        folders={folders}
        selectedReportId={selectedReportId}
        isCreating={isCreating}
        isLoading={isLoading}
        error={isCreating ? error : null}
        onSelectReport={selectReport}
        onCreateReport={handleCreateReport}
        onSetCreating={setCreating}
        onCreateFolder={handleCreateFolder}
        onDeleteFolder={handleDeleteFolder}
        onRenameFolder={handleRenameFolder}
      />

      {/* Main Content */}
      <ReportView
        report={selectedReport}
        isRunning={isRunning}
        isLoading={isLoading}
        error={!isCreating ? error : null}
        onRefresh={handleRefreshReport}
        onEdit={handleEditReport}
        onDelete={handleDeleteReport}
        onDuplicate={handleDuplicateReport}
        onExport={handleExport}
      />
    </Box>
  );
};

export default Reports;
