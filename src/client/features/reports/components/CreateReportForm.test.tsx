import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreateReportForm from './CreateReportForm';
import type { ReportFolder } from '@client/context/types/state';

// ============ FIXTURES ============

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

function buildDefaultProps(overrides: Partial<Parameters<typeof CreateReportForm>[0]> = {}) {
  return {
    isOpen: false,
    folders: [],
    isLoading: false,
    error: null,
    onSubmit: vi.fn().mockResolvedValue(undefined),
    onCancel: vi.fn(),
    onOpen: vi.fn(),
    ...overrides,
  };
}

// ============ TESTS ============

describe('CreateReportForm component', () => {
  describe('before the form is opened', () => {
    it('only shows a "New Report" trigger button', () => {
      render(<CreateReportForm {...buildDefaultProps()} />);

      expect(screen.getByRole('button', { name: /new report/i })).toBeVisible();
      expect(screen.queryByLabelText(/description/i)).not.toBeInTheDocument();
    });

    it('calls onOpen when the trigger button is clicked', async () => {
      const onOpen = vi.fn();
      const user = userEvent.setup();
      render(<CreateReportForm {...buildDefaultProps({ onOpen })} />);

      await user.click(screen.getByRole('button', { name: /new report/i }));

      expect(onOpen).toHaveBeenCalledOnce();
    });
  });

  describe('once the form is open', () => {
    it('shows the description field and create button', () => {
      render(<CreateReportForm {...buildDefaultProps({ isOpen: true })} />);

      expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /create/i })).toBeInTheDocument();
    });

    it('prevents submission when the description field is empty', async () => {
      const onSubmit = vi.fn().mockResolvedValue(undefined);
      const user = userEvent.setup();
      render(<CreateReportForm {...buildDefaultProps({ isOpen: true, onSubmit })} />);

      const createBtn = screen.getByRole('button', { name: /create/i });
      expect(createBtn).toBeDisabled();

      await user.click(createBtn);

      expect(onSubmit).not.toHaveBeenCalled();
    });

    it('enables the Create button only after a description is entered', async () => {
      const user = userEvent.setup();
      render(<CreateReportForm {...buildDefaultProps({ isOpen: true })} />);

      const createBtn = screen.getByRole('button', { name: /create/i });
      expect(createBtn).toBeDisabled();

      await user.type(screen.getByLabelText(/description/i), 'Patients without future appointments');

      expect(createBtn).not.toBeDisabled();
    });

    it('submits with the entered name and description when both are provided', async () => {
      const onSubmit = vi.fn().mockResolvedValue(undefined);
      const user = userEvent.setup();
      render(<CreateReportForm {...buildDefaultProps({ isOpen: true, onSubmit })} />);

      await user.type(screen.getByLabelText(/report name/i), 'My Report');
      await user.type(screen.getByLabelText(/description/i), 'Patients inactive for 90 days');

      await user.click(screen.getByRole('button', { name: /create/i }));

      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'My Report',
          description: 'Patients inactive for 90 days',
        })
      );
    });

    it('uses "Untitled Report" as the name when the user leaves name blank', async () => {
      const onSubmit = vi.fn().mockResolvedValue(undefined);
      const user = userEvent.setup();
      render(<CreateReportForm {...buildDefaultProps({ isOpen: true, onSubmit })} />);

      await user.type(screen.getByLabelText(/description/i), 'Some report description');
      await user.click(screen.getByRole('button', { name: /create/i }));

      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Untitled Report' })
      );
    });

    it('calls onCancel when the cancel button is clicked', async () => {
      const onCancel = vi.fn();
      const user = userEvent.setup();
      render(<CreateReportForm {...buildDefaultProps({ isOpen: true, onCancel })} />);

      await user.click(screen.getByRole('button', { name: /cancel/i }));

      expect(onCancel).toHaveBeenCalledOnce();
    });

    it('calls onCancel when the close icon button is clicked', async () => {
      const onCancel = vi.fn();
      const user = userEvent.setup();
      render(<CreateReportForm {...buildDefaultProps({ isOpen: true, onCancel })} />);

      // The X close icon button is near the heading
      const heading = screen.getByText(/create report/i);
      const headerBox = heading.closest('div')!.parentElement!;
      const closeBtn = within(headerBox).getByRole('button');
      await user.click(closeBtn);

      expect(onCancel).toHaveBeenCalledOnce();
    });

    it('shows an error alert when the error prop is provided', () => {
      render(
        <CreateReportForm
          {...buildDefaultProps({ isOpen: true, error: 'SQL generation failed' })}
        />
      );

      expect(screen.getByRole('alert')).toHaveTextContent('SQL generation failed');
    });

    it('renders folder options in the folder select when folders are provided', async () => {
      const user = userEvent.setup();
      const folders = [makeFolder({ id: 'f1', name: 'Analytics' }), makeFolder({ id: 'f2', name: 'Finance' })];
      render(<CreateReportForm {...buildDefaultProps({ isOpen: true, folders })} />);

      // Open the folder select
      const select = screen.getByLabelText(/folder/i);
      await user.click(select);

      expect(await screen.findByText('Analytics')).toBeInTheDocument();
      expect(await screen.findByText('Finance')).toBeInTheDocument();
    });
  });

  describe('template selection', () => {
    it('prefills the description when a template chip is clicked', async () => {
      const user = userEvent.setup();
      render(<CreateReportForm {...buildDefaultProps({ isOpen: true })} />);

      // Click the "Annual Recall" template chip
      await user.click(screen.getByText(/annual recall/i));

      const descriptionInput = screen.getByLabelText(/description/i) as HTMLTextAreaElement;
      expect(descriptionInput.value).toContain('2025');
    });

    it('prefills the name with the template label when name was empty', async () => {
      const user = userEvent.setup();
      render(<CreateReportForm {...buildDefaultProps({ isOpen: true })} />);

      await user.click(screen.getByText(/annual recall/i));

      const nameInput = screen.getByLabelText(/report name/i) as HTMLInputElement;
      expect(nameInput.value).toBe('Annual Recall');
    });

    it('does not overwrite a name the user already typed when selecting a template', async () => {
      const user = userEvent.setup();
      render(<CreateReportForm {...buildDefaultProps({ isOpen: true })} />);

      await user.type(screen.getByLabelText(/report name/i), 'My Custom Name');
      await user.click(screen.getByText(/annual recall/i));

      const nameInput = screen.getByLabelText(/report name/i) as HTMLInputElement;
      expect(nameInput.value).toBe('My Custom Name');
    });
  });

  describe('loading state', () => {
    it('disables both action buttons while the form is submitting', () => {
      render(
        <CreateReportForm {...buildDefaultProps({ isOpen: true, isLoading: true })} />
      );

      expect(screen.getByRole('button', { name: /cancel/i })).toBeDisabled();
      // The Create button is always disabled when isLoading regardless of description
      const createBtn = screen.getByRole('button', { name: /create/i });
      expect(createBtn).toBeDisabled();
    });
  });
});
