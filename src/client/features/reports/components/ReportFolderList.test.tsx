import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ReportFolderList from './ReportFolderList';
import type { ReportFolder, ReportData } from '@client/context/types/state';

// ============ FIXTURES ============

function makeReport(overrides: Partial<ReportData> = {}): ReportData {
  return {
    id: 'r1',
    name: 'Test Report',
    description: 'A description',
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

function buildDefaultProps(overrides: Partial<Parameters<typeof ReportFolderList>[0]> = {}) {
  return {
    folders: [],
    selectedReportId: null,
    onSelectReport: vi.fn(),
    onDeleteFolder: vi.fn(),
    onRenameFolder: vi.fn(),
    ...overrides,
  };
}

// ============ TESTS ============

describe('ReportFolderList component', () => {
  describe('folder header rendering', () => {
    it('shows the folder name and report count', () => {
      const folder = makeFolder({ id: 'f1', name: 'Analytics', reports: [makeReport()] });
      render(<ReportFolderList {...buildDefaultProps({ folders: [folder] })} />);

      expect(screen.getByText('Analytics')).toBeInTheDocument();
      expect(screen.getByText('(1)')).toBeInTheDocument();
    });

    it('shows "No reports" when a folder is empty', () => {
      const folder = makeFolder({ id: 'f1', name: 'Empty Folder', reports: [] });
      render(<ReportFolderList {...buildDefaultProps({ folders: [folder] })} />);

      expect(screen.getByText(/no reports/i)).toBeInTheDocument();
    });
  });

  describe('default folders — no context menu', () => {
    it('does not render a context menu button for default folders', () => {
      const folder = makeFolder({ id: 'f-def', name: 'Uncategorized', isDefault: true });
      render(<ReportFolderList {...buildDefaultProps({ folders: [folder] })} />);

      // The MoreVert icon button is only rendered for non-default folders
      // We confirm no menu is present by checking nothing triggers the menu items
      expect(screen.queryByRole('button', { name: '' })).not.toBeInTheDocument();
    });
  });

  describe('custom folders — context menu', () => {
    it('shows Rename and Delete options after opening the folder context menu', async () => {
      const user = userEvent.setup();
      const folder = makeFolder({ id: 'f-custom', name: 'Custom', isDefault: false });
      render(<ReportFolderList {...buildDefaultProps({ folders: [folder] })} />);

      // The MoreVert button has no accessible name — find it via the svg icon
      // MUI renders the button; target it by its test role
      const moreButtons = screen.getAllByRole('button');
      // The last button in the folder row is the MoreVert icon
      const moreBtn = moreButtons[moreButtons.length - 1];
      await user.click(moreBtn);

      expect(await screen.findByRole('menuitem', { name: /rename/i })).toBeInTheDocument();
      expect(await screen.findByRole('menuitem', { name: /delete/i })).toBeInTheDocument();
    });

    it('calls onDeleteFolder with the folder id when Delete is chosen', async () => {
      const onDeleteFolder = vi.fn();
      const user = userEvent.setup();
      const folder = makeFolder({ id: 'f-del', name: 'To Delete', isDefault: false });
      render(
        <ReportFolderList
          {...buildDefaultProps({ folders: [folder], onDeleteFolder })}
        />
      );

      const moreButtons = screen.getAllByRole('button');
      await user.click(moreButtons[moreButtons.length - 1]);

      const deleteItem = await screen.findByRole('menuitem', { name: /delete/i });
      await user.click(deleteItem);

      expect(onDeleteFolder).toHaveBeenCalledWith('f-del');
    });
  });

  describe('report selection', () => {
    it('calls onSelectReport with the report id when a report is clicked', async () => {
      const onSelectReport = vi.fn();
      const user = userEvent.setup();
      const report = makeReport({ id: 'r-click', name: 'Clickable Report' });
      const folder = makeFolder({ id: 'f1', reports: [report] });
      render(
        <ReportFolderList
          {...buildDefaultProps({ folders: [folder], onSelectReport })}
        />
      );

      await user.click(screen.getByText('Clickable Report'));

      expect(onSelectReport).toHaveBeenCalledWith('r-click');
    });

    it('visually distinguishes the currently selected report', () => {
      const r1 = makeReport({ id: 'r-selected', name: 'Selected Report' });
      const r2 = makeReport({ id: 'r-other', name: 'Other Report' });
      const folder = makeFolder({ id: 'f1', reports: [r1, r2] });
      render(
        <ReportFolderList
          {...buildDefaultProps({ folders: [folder], selectedReportId: 'r-selected' })}
        />
      );

      // The selected report's name is rendered with fontWeight 600
      // We test user-visible distinction: MUI adds aria-selected or a "selected" class
      const selectedItem = screen.getByText('Selected Report').closest('[class*="MuiListItemButton"]');
      expect(selectedItem).toHaveClass('Mui-selected');
    });
  });

  describe('folder expand/collapse', () => {
    it('collapses the folder reports when the folder header is clicked', async () => {
      const user = userEvent.setup();
      const report = makeReport({ id: 'r1', name: 'Visible Report' });
      const folder = makeFolder({ id: 'f1', reports: [report] });
      render(<ReportFolderList {...buildDefaultProps({ folders: [folder] })} />);

      // Reports are visible by default
      expect(screen.getByText('Visible Report')).toBeVisible();

      // Click folder header to collapse
      await user.click(screen.getByText('My Folder'));

      expect(screen.queryByText('Visible Report')).not.toBeInTheDocument();
    });
  });
});
