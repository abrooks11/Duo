import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ReportTable from './ReportTable';

// ============ TESTS ============

describe('ReportTable component', () => {
  describe('when the data set is empty', () => {
    it('shows a "No data found" message', () => {
      render(<ReportTable data={[]} />);

      expect(screen.getByText(/no data found/i)).toBeInTheDocument();
    });

    it('does not render a DataGrid when data is empty', () => {
      const { container } = render(<ReportTable data={[]} />);

      expect(container.querySelector('.MuiDataGrid-root')).not.toBeInTheDocument();
    });
  });

  describe('when data rows are provided', () => {
    it('renders the DataGrid with the data rows', () => {
      const data = [
        { id: 1, patientName: 'Alice', balance: 100 },
        { id: 2, patientName: 'Bob', balance: 200 },
      ];

      const { container } = render(<ReportTable data={data} />);

      expect(container.querySelector('.MuiDataGrid-root')).toBeInTheDocument();
    });

    it('generates column headers derived from the data keys', () => {
      const data = [{ id: 1, patientName: 'Alice', totalBalance: 150 }];

      render(<ReportTable data={data} />);

      // Headers are converted from camelCase: "patientName" -> "Patient Name"
      expect(screen.getByText('Patient Name')).toBeInTheDocument();
      // "totalBalance" -> "Total Balance"
      expect(screen.getByText('Total Balance')).toBeInTheDocument();
    });

    it('does not show the "No data found" message when rows exist', () => {
      const data = [{ id: 1, name: 'Alice' }];

      render(<ReportTable data={data} />);

      expect(screen.queryByText(/no data found/i)).not.toBeInTheDocument();
    });
  });

  describe('column header name formatting', () => {
    it('converts camelCase keys to Title Case column headers', () => {
      const data = [{ appointmentDate: '2024-01-01', patientFullName: 'Alice Smith' }];

      render(<ReportTable data={data} />);

      expect(screen.getByText('Appointment Date')).toBeInTheDocument();
      expect(screen.getByText('Patient Full Name')).toBeInTheDocument();
    });

    it('converts snake_case keys to Title Case column headers', () => {
      const data = [{ patient_name: 'Alice', insurance_balance: 50 }];

      render(<ReportTable data={data} />);

      expect(screen.getByText('Patient Name')).toBeInTheDocument();
      expect(screen.getByText('Insurance Balance')).toBeInTheDocument();
    });
  });

  describe('automatic row id assignment', () => {
    it('uses the existing id field when rows already have one', () => {
      const data = [{ id: 99, name: 'Alice' }];

      // If rows do not have a unique id, DataGrid would throw; this confirms it renders
      expect(() => render(<ReportTable data={data} />)).not.toThrow();
    });

    it('falls back to index-based id when rows lack an id field', () => {
      const data = [{ name: 'Alice' }, { name: 'Bob' }];

      // Should render without error even when rows have no id
      expect(() => render(<ReportTable data={data} />)).not.toThrow();
    });
  });
});
