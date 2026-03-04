export interface ReportFolder {
  id: string;
  name: string;
  isDefault: boolean;
  sortOrder: number;
  reports: Report[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Report {
  id: string;
  name: string;
  description: string;
  sqlQuery: string;
  cachedData: any[] | null;
  cachedAt: Date | null;
  folderId: string | null;
  folder?: ReportFolder | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateReportInput {
  name: string;
  description: string;
  folderId?: string;
}

export interface UpdateReportInput {
  name?: string;
  description?: string;
  folderId?: string;
}

export interface CreateFolderInput {
  name: string;
}

export interface UpdateFolderInput {
  name?: string;
  sortOrder?: number;
}

export interface GeneratedQuery {
  sql: string;
  suggestedName: string;
}
