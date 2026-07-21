import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';

// Mock the services module before importing the router/controller
vi.mock('./reportServices.ts', () => ({
  seedDefaultFolders: vi.fn(),
  getAllFolders: vi.fn(),
  createFolder: vi.fn(),
  updateFolder: vi.fn(),
  deleteFolder: vi.fn(),
  getAllReports: vi.fn(),
  getReportById: vi.fn(),
  createReport: vi.fn(),
  updateReport: vi.fn(),
  deleteReport: vi.fn(),
  runReport: vi.fn(),
  duplicateReport: vi.fn(),
  getTemplates: vi.fn(),
}));

import * as services from './reportServices.ts';
import reportRouter from './reportRouter.ts';

// Minimal Express app wired with the report router and a simple error handler
function buildApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/reports', reportRouter);

  // Error handler matching the AppError contract used by the controllers
  app.use(
    (
      err: { status?: number; message?: string },
      _req: express.Request,
      res: express.Response,
      _next: express.NextFunction
    ) => {
      res
        .status(err.status ?? 500)
        .json({ success: false, error: err.message ?? 'Internal Server Error' });
    }
  );

  return app;
}

const app = buildApp();

const mockFolder = {
  id: 'f1',
  name: 'Patients',
  isDefault: true,
  sortOrder: 0,
  reports: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const mockReport = {
  id: 'r1',
  name: 'My Report',
  description: 'all patients',
  sqlQuery: 'SELECT * FROM "Patient" LIMIT 500',
  cachedData: [{ id: 1 }],
  cachedAt: new Date().toISOString(),
  folderId: 'f1',
  folder: mockFolder,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

beforeEach(() => {
  vi.clearAllMocks();
});

// ============ FOLDER ROUTES ============

describe('GET /api/reports/folders', () => {
  it('returns 200 with folders array', async () => {
    vi.mocked(services.seedDefaultFolders).mockResolvedValue(undefined);
    vi.mocked(services.getAllFolders).mockResolvedValue([mockFolder] as never);

    const res = await request(app).get('/api/reports/folders');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].id).toBe('f1');
  });

  it('returns 500 when getAllFolders throws', async () => {
    vi.mocked(services.seedDefaultFolders).mockResolvedValue(undefined);
    vi.mocked(services.getAllFolders).mockRejectedValue(new Error('DB error'));

    const res = await request(app).get('/api/reports/folders');

    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);
  });
});

describe('POST /api/reports/folders', () => {
  it('returns 201 with created folder', async () => {
    vi.mocked(services.createFolder).mockResolvedValue(mockFolder as never);

    const res = await request(app)
      .post('/api/reports/folders')
      .send({ name: 'Patients' });

    expect(res.status).toBe(201);
    expect(res.body.data.name).toBe('Patients');
  });

  it('returns 400 when name is missing', async () => {
    const res = await request(app).post('/api/reports/folders').send({});

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toMatch(/required/i);
  });
});

describe('PATCH /api/reports/folders/:id', () => {
  it('returns 200 with updated folder', async () => {
    const updated = { ...mockFolder, name: 'Renamed' };
    vi.mocked(services.updateFolder).mockResolvedValue(updated as never);

    const res = await request(app)
      .patch('/api/reports/folders/f1')
      .send({ name: 'Renamed' });

    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe('Renamed');
  });
});

describe('DELETE /api/reports/folders/:id', () => {
  it('returns 200 with success message when folder is deleted', async () => {
    vi.mocked(services.deleteFolder).mockResolvedValue(mockFolder as never);

    const res = await request(app).delete('/api/reports/folders/f1');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

// ============ REPORT ROUTES ============

describe('GET /api/reports', () => {
  it('returns 200 with reports array', async () => {
    vi.mocked(services.getAllReports).mockResolvedValue([mockReport] as never);

    const res = await request(app).get('/api/reports');

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].id).toBe('r1');
  });
});

describe('GET /api/reports/:id', () => {
  it('returns 200 with the report', async () => {
    vi.mocked(services.getReportById).mockResolvedValue(mockReport as never);

    const res = await request(app).get('/api/reports/r1');

    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe('r1');
  });

  it('returns 404 when report is not found', async () => {
    vi.mocked(services.getReportById).mockResolvedValue(null as never);

    const res = await request(app).get('/api/reports/unknown-id');

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toMatch(/not found/i);
  });
});

describe('POST /api/reports', () => {
  it('returns 201 with the created report', async () => {
    vi.mocked(services.createReport).mockResolvedValue(mockReport as never);

    const res = await request(app)
      .post('/api/reports')
      .send({ description: 'all patients', name: 'My Report' });

    expect(res.status).toBe(201);
    expect(res.body.data.id).toBe('r1');
  });

  it('returns 400 when description is missing', async () => {
    const res = await request(app).post('/api/reports').send({ name: 'Test' });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/description/i);
  });

  it('returns 400 when createReport throws an SQL validation error', async () => {
    vi.mocked(services.createReport).mockRejectedValue(
      new Error('Invalid query generated: Only SELECT queries are allowed')
    );

    const res = await request(app)
      .post('/api/reports')
      .send({ description: 'drop all tables' });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/Invalid query/i);
  });

  it('returns 500 for unexpected errors', async () => {
    vi.mocked(services.createReport).mockRejectedValue(new Error('Unexpected'));

    const res = await request(app)
      .post('/api/reports')
      .send({ description: 'something' });

    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);
  });
});

describe('PATCH /api/reports/:id', () => {
  it('returns 200 with the updated report', async () => {
    vi.mocked(services.updateReport).mockResolvedValue({ ...mockReport, name: 'Renamed' } as never);

    const res = await request(app)
      .patch('/api/reports/r1')
      .send({ name: 'Renamed' });

    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe('Renamed');
  });

  it('returns 404 when updateReport throws "Report not found"', async () => {
    vi.mocked(services.updateReport).mockRejectedValue(new Error('Report not found'));

    const res = await request(app)
      .patch('/api/reports/no-such-id')
      .send({ name: 'X' });

    expect(res.status).toBe(404);
    expect(res.body.error).toMatch(/not found/i);
  });
});

describe('DELETE /api/reports/:id', () => {
  it('returns 200 with success message', async () => {
    vi.mocked(services.deleteReport).mockResolvedValue(mockReport as never);

    const res = await request(app).delete('/api/reports/r1');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

describe('POST /api/reports/:id/run (refreshReport)', () => {
  it('returns 200 with the refreshed report', async () => {
    const refreshed = { ...mockReport, cachedAt: new Date().toISOString() };
    vi.mocked(services.runReport).mockResolvedValue(refreshed as never);

    const res = await request(app).post('/api/reports/r1/run');

    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe('r1');
  });

  it('returns 404 when runReport throws "Report not found"', async () => {
    vi.mocked(services.runReport).mockRejectedValue(new Error('Report not found'));

    const res = await request(app).post('/api/reports/no-such-id/run');

    expect(res.status).toBe(404);
    expect(res.body.error).toMatch(/not found/i);
  });
});

describe('POST /api/reports/:id/duplicate (cloneReport)', () => {
  it('returns 201 with the duplicated report', async () => {
    const clone = { ...mockReport, id: 'r2', name: 'My Report (Copy)' };
    vi.mocked(services.duplicateReport).mockResolvedValue(clone as never);

    const res = await request(app).post('/api/reports/r1/duplicate');

    expect(res.status).toBe(201);
    expect(res.body.data.name).toBe('My Report (Copy)');
  });

  it('returns 404 when duplicateReport throws "Report not found"', async () => {
    vi.mocked(services.duplicateReport).mockRejectedValue(new Error('Report not found'));

    const res = await request(app).post('/api/reports/no-such-id/duplicate');

    expect(res.status).toBe(404);
    expect(res.body.error).toMatch(/not found/i);
  });
});

// ============ TEMPLATE ROUTES ============

describe('GET /api/reports/templates', () => {
  it('returns 200 with templates array', async () => {
    const mockTemplates = [{ id: 'annual-recall', label: 'Annual Recall', description: '...' }];
    vi.mocked(services.getTemplates).mockReturnValue(mockTemplates as never);

    const res = await request(app).get('/api/reports/templates');

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].id).toBe('annual-recall');
  });
});
