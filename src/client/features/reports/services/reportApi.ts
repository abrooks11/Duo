import { toast } from 'react-toastify';
import type { ReportData, ReportFolder, ReportTemplate } from '../../../context/types/state';

const baseURL = '/api';

interface ApiResponse<T> {
  data: T;
}

// ============ FOLDER API ============

export const fetchFolders = async (): Promise<ReportFolder[]> => {
  const response = await fetch(`${baseURL}/reports/folders`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch folders');
  }

  const json: ApiResponse<ReportFolder[]> = await response.json();
  return json.data;
};

export const createFolder = async (name: string): Promise<ReportFolder> => {
  const response = await fetch(`${baseURL}/reports/folders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ name }),
  });

  if (!response.ok) {
    throw new Error('Failed to create folder');
  }

  const json: ApiResponse<ReportFolder> = await response.json();
  toast.success('Folder created successfully');
  return json.data;
};

export const updateFolder = async (
  id: string,
  data: { name?: string; sortOrder?: number }
): Promise<ReportFolder> => {
  const response = await fetch(`${baseURL}/reports/folders/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to update folder');
  }

  const json: ApiResponse<ReportFolder> = await response.json();
  toast.success('Folder updated successfully');
  return json.data;
};

export const deleteFolder = async (id: string): Promise<void> => {
  const response = await fetch(`${baseURL}/reports/folders/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to delete folder');
  }

  toast.success('Folder deleted successfully');
};

// ============ REPORT API ============

export const fetchReports = async (): Promise<ReportData[]> => {
  const response = await fetch(`${baseURL}/reports`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch reports');
  }

  const json: ApiResponse<ReportData[]> = await response.json();
  return json.data;
};

export const fetchReport = async (id: string): Promise<ReportData> => {
  const response = await fetch(`${baseURL}/reports/${id}`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch report');
  }

  const json: ApiResponse<ReportData> = await response.json();
  return json.data;
};

export const createReport = async (data: {
  name: string;
  description: string;
  folderId?: string;
}): Promise<ReportData> => {
  const response = await fetch(`${baseURL}/reports`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || errorData.message?.err || 'Failed to create report');
  }

  const json: ApiResponse<ReportData> = await response.json();
  toast.success('Report created successfully');
  return json.data;
};

export const updateReport = async (
  id: string,
  data: { name?: string; description?: string; folderId?: string }
): Promise<ReportData> => {
  const response = await fetch(`${baseURL}/reports/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || errorData.message?.err || 'Failed to update report');
  }

  const json: ApiResponse<ReportData> = await response.json();
  toast.success('Report updated successfully');
  return json.data;
};

export const deleteReport = async (id: string): Promise<void> => {
  const response = await fetch(`${baseURL}/reports/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to delete report');
  }

  toast.success('Report deleted successfully');
};

export const runReport = async (id: string): Promise<ReportData> => {
  const response = await fetch(`${baseURL}/reports/${id}/run`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || errorData.message?.err || 'Failed to run report');
  }

  const json: ApiResponse<ReportData> = await response.json();
  toast.success('Report refreshed successfully');
  return json.data;
};

export const duplicateReport = async (id: string): Promise<ReportData> => {
  const response = await fetch(`${baseURL}/reports/${id}/duplicate`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to duplicate report');
  }

  const json: ApiResponse<ReportData> = await response.json();
  toast.success('Report duplicated successfully');
  return json.data;
};

// ============ TEMPLATE API ============

export const fetchTemplates = async (): Promise<ReportTemplate[]> => {
  const response = await fetch(`${baseURL}/reports/templates`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch templates');
  }

  const json: ApiResponse<ReportTemplate[]> = await response.json();
  return json.data;
};
