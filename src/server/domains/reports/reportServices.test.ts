import { describe, it, expect, vi, beforeEach } from 'vitest';

// vi.hoisted ensures these are available when vi.mock factories run (which are
// hoisted above all variable declarations by Vitest).
const mockPrisma = vi.hoisted(() => ({
  reportFolder: {
    findMany: vi.fn(),
    findFirst: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    createMany: vi.fn(),
    update: vi.fn(),
    updateMany: vi.fn(),
    delete: vi.fn(),
    count: vi.fn(),
    aggregate: vi.fn(),
  },
  report: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    updateMany: vi.fn(),
    delete: vi.fn(),
  },
  $queryRawUnsafe: vi.fn(),
}));

// Hoist the constructor mock itself so it's ready when vi.mock('@prisma/client') runs.
// Must use `function` (not arrow fn) so vi.fn() can be called with `new`.
const MockPrismaClient = vi.hoisted(() => vi.fn(function () { return mockPrisma; }));

const mockChatCompletionsCreate = vi.hoisted(() => vi.fn());

vi.mock('@prisma/client', () => ({
  PrismaClient: MockPrismaClient,
  Prisma: { InputJsonValue: {} },
}));

vi.mock('openai', () => ({
  // Must use `function` so vi.fn() can be called with `new OpenAI(...)`.
  default: vi.fn(function () {
    return { chat: { completions: { create: mockChatCompletionsCreate } } };
  }),
}));

import {
  getAllFolders,
  createFolder,
  updateFolder,
  deleteFolder,
  seedDefaultFolders,
  getAllReports,
  getReportById,
  generateQueryFromDescription,
  createReport,
  updateReport,
  deleteReport,
  runReport,
  duplicateReport,
  getTemplates,
} from './reportServices.ts';

// Helper — build a minimal mock OpenAI response with a valid SQL JSON body
function makeAiResponse(sql: string, suggestedName: string): object {
  return {
    choices: [
      {
        message: {
          content: JSON.stringify({ sql, suggestedName }),
        },
      },
    ],
  };
}

const VALID_SQL = 'SELECT * FROM "Patient"';

beforeEach(() => {
  vi.clearAllMocks();
});

// ============ FOLDER OPERATIONS ============

describe('getAllFolders', () => {
  it('returns folders ordered by sortOrder with reports included', async () => {
    const mockFolders = [{ id: 'f1', name: 'Patients', sortOrder: 0, reports: [] }];
    mockPrisma.reportFolder.findMany.mockResolvedValue(mockFolders);

    const result = await getAllFolders();

    expect(mockPrisma.reportFolder.findMany).toHaveBeenCalledWith({
      orderBy: { sortOrder: 'asc' },
      include: { reports: { orderBy: { createdAt: 'desc' } } },
    });
    expect(result).toEqual(mockFolders);
  });
});

describe('createFolder', () => {
  it('creates a folder with the next sortOrder', async () => {
    mockPrisma.reportFolder.aggregate.mockResolvedValue({ _max: { sortOrder: 3 } });
    const created = { id: 'f2', name: 'Custom', isDefault: false, sortOrder: 4 };
    mockPrisma.reportFolder.create.mockResolvedValue(created);

    const result = await createFolder({ name: 'Custom' });

    expect(mockPrisma.reportFolder.aggregate).toHaveBeenCalled();
    expect(mockPrisma.reportFolder.create).toHaveBeenCalledWith({
      data: { name: 'Custom', isDefault: false, sortOrder: 4 },
    });
    expect(result).toEqual(created);
  });

  it('starts sortOrder at 0 when no folders exist', async () => {
    mockPrisma.reportFolder.aggregate.mockResolvedValue({ _max: { sortOrder: null } });
    mockPrisma.reportFolder.create.mockResolvedValue({ id: 'f1', sortOrder: 0 });

    await createFolder({ name: 'First' });

    expect(mockPrisma.reportFolder.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ sortOrder: 0 }) })
    );
  });
});

describe('updateFolder', () => {
  it('updates the folder by id', async () => {
    const updated = { id: 'f1', name: 'Renamed', sortOrder: 0 };
    mockPrisma.reportFolder.update.mockResolvedValue(updated);

    const result = await updateFolder('f1', { name: 'Renamed' });

    expect(mockPrisma.reportFolder.update).toHaveBeenCalledWith({
      where: { id: 'f1' },
      data: { name: 'Renamed' },
    });
    expect(result).toEqual(updated);
  });
});

describe('deleteFolder', () => {
  it('moves reports to Uncategorized and deletes the folder', async () => {
    const uncategorized = { id: 'unc', name: 'Uncategorized', isDefault: true };
    mockPrisma.reportFolder.findFirst.mockResolvedValue(uncategorized);
    mockPrisma.report.updateMany.mockResolvedValue({ count: 2 });
    const deleted = { id: 'f1', name: 'Custom' };
    mockPrisma.reportFolder.delete.mockResolvedValue(deleted);

    const result = await deleteFolder('f1');

    expect(mockPrisma.reportFolder.findFirst).toHaveBeenCalledWith({
      where: { name: 'Uncategorized', isDefault: true },
    });
    expect(mockPrisma.report.updateMany).toHaveBeenCalledWith({
      where: { folderId: 'f1' },
      data: { folderId: 'unc' },
    });
    expect(mockPrisma.reportFolder.delete).toHaveBeenCalledWith({ where: { id: 'f1' } });
    expect(result).toEqual(deleted);
  });

  it('creates Uncategorized folder if it does not exist before moving reports', async () => {
    mockPrisma.reportFolder.findFirst.mockResolvedValue(null);
    const newUncat = { id: 'new-unc', name: 'Uncategorized', isDefault: true, sortOrder: 999 };
    mockPrisma.reportFolder.create.mockResolvedValue(newUncat);
    mockPrisma.report.updateMany.mockResolvedValue({ count: 0 });
    mockPrisma.reportFolder.delete.mockResolvedValue({ id: 'f1' });

    await deleteFolder('f1');

    expect(mockPrisma.reportFolder.create).toHaveBeenCalledWith({
      data: { name: 'Uncategorized', isDefault: true, sortOrder: 999 },
    });
    expect(mockPrisma.report.updateMany).toHaveBeenCalledWith({
      where: { folderId: 'f1' },
      data: { folderId: 'new-unc' },
    });
  });
});

describe('seedDefaultFolders', () => {
  it('does nothing when folders already exist (idempotent)', async () => {
    mockPrisma.reportFolder.count.mockResolvedValue(5);

    await seedDefaultFolders();

    expect(mockPrisma.reportFolder.createMany).not.toHaveBeenCalled();
  });

  it('creates default folders when the table is empty', async () => {
    mockPrisma.reportFolder.count.mockResolvedValue(0);
    mockPrisma.reportFolder.createMany.mockResolvedValue({ count: 5 });

    await seedDefaultFolders();

    expect(mockPrisma.reportFolder.createMany).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.arrayContaining([
          expect.objectContaining({ name: 'Patients', isDefault: true }),
          expect.objectContaining({ name: 'Uncategorized', isDefault: true }),
        ]),
      })
    );
  });
});

// ============ REPORT OPERATIONS ============

describe('getAllReports', () => {
  it('returns reports ordered by createdAt desc with folder included', async () => {
    const mockReports = [{ id: 'r1', name: 'My Report', folder: { id: 'f1' } }];
    mockPrisma.report.findMany.mockResolvedValue(mockReports);

    const result = await getAllReports();

    expect(mockPrisma.report.findMany).toHaveBeenCalledWith({
      orderBy: { createdAt: 'desc' },
      include: { folder: true },
    });
    expect(result).toEqual(mockReports);
  });
});

describe('getReportById', () => {
  it('returns the report when found', async () => {
    const mockReport = { id: 'r1', name: 'Report', folder: null };
    mockPrisma.report.findUnique.mockResolvedValue(mockReport);

    const result = await getReportById('r1');

    expect(mockPrisma.report.findUnique).toHaveBeenCalledWith({
      where: { id: 'r1' },
      include: { folder: true },
    });
    expect(result).toEqual(mockReport);
  });

  it('returns null when report is not found', async () => {
    mockPrisma.report.findUnique.mockResolvedValue(null);

    const result = await getReportById('unknown-id');

    expect(result).toBeNull();
  });
});

describe('generateQueryFromDescription', () => {
  it('returns sql and suggestedName from the AI response', async () => {
    mockChatCompletionsCreate.mockResolvedValue(
      makeAiResponse(VALID_SQL, 'All Patients')
    );

    const result = await generateQueryFromDescription('list all patients');

    expect(result.sql).toContain('SELECT');
    expect(result.suggestedName).toBe('All Patients');
  });

  it('adds LIMIT 500 to the AI-generated SQL', async () => {
    mockChatCompletionsCreate.mockResolvedValue(
      makeAiResponse('SELECT * FROM "Patient"', 'All Patients')
    );

    const result = await generateQueryFromDescription('list all patients');

    expect(result.sql).toMatch(/LIMIT 500/i);
  });

  it('throws when the AI returns no content', async () => {
    mockChatCompletionsCreate.mockResolvedValue({
      choices: [{ message: { content: null } }],
    });

    await expect(generateQueryFromDescription('list all patients')).rejects.toThrow(
      'No response from AI'
    );
  });

  it('throws when the AI returns an invalid (non-SELECT) SQL', async () => {
    mockChatCompletionsCreate.mockResolvedValue(
      makeAiResponse('DROP TABLE "Patient"', 'Drop Table')
    );

    await expect(generateQueryFromDescription('drop patients')).rejects.toThrow(
      'Invalid query generated'
    );
  });
});

describe('createReport', () => {
  it('creates and returns a report with AI-generated SQL', async () => {
    mockChatCompletionsCreate.mockResolvedValue(
      makeAiResponse(VALID_SQL, 'All Patients')
    );
    mockPrisma.$queryRawUnsafe.mockResolvedValue([{ id: 1 }]);
    mockPrisma.reportFolder.findFirst.mockResolvedValue({ id: 'unc' });
    const created = { id: 'r1', name: 'My Report', folder: null };
    mockPrisma.report.create.mockResolvedValue(created);

    const result = await createReport({
      name: 'My Report',
      description: 'list all patients',
    });

    expect(mockPrisma.report.create).toHaveBeenCalled();
    expect(result).toEqual(created);
  });

  it('uses AI-suggested name when no name is provided', async () => {
    mockChatCompletionsCreate.mockResolvedValue(
      makeAiResponse(VALID_SQL, 'AI Suggested Name')
    );
    mockPrisma.$queryRawUnsafe.mockResolvedValue([]);
    mockPrisma.reportFolder.findFirst.mockResolvedValue({ id: 'unc' });
    mockPrisma.report.create.mockResolvedValue({ id: 'r1', name: 'AI Suggested Name' });

    await createReport({ name: '', description: 'something' });

    expect(mockPrisma.report.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ name: 'AI Suggested Name' }),
      })
    );
  });

  it('falls back to provided folderId without querying Uncategorized', async () => {
    mockChatCompletionsCreate.mockResolvedValue(
      makeAiResponse(VALID_SQL, 'Report')
    );
    mockPrisma.$queryRawUnsafe.mockResolvedValue([]);
    mockPrisma.report.create.mockResolvedValue({ id: 'r1' });

    await createReport({ name: 'R', description: 'desc', folderId: 'folder-123' });

    expect(mockPrisma.reportFolder.findFirst).not.toHaveBeenCalled();
    expect(mockPrisma.report.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ folderId: 'folder-123' }),
      })
    );
  });
});

describe('updateReport', () => {
  it('throws when report is not found', async () => {
    mockPrisma.report.findUnique.mockResolvedValue(null);

    await expect(updateReport('no-such-id', { name: 'New Name' })).rejects.toThrow(
      'Report not found'
    );
  });

  it('updates name without regenerating SQL when description is unchanged', async () => {
    const existing = {
      id: 'r1',
      name: 'Old',
      description: 'same description',
      sqlQuery: VALID_SQL,
      cachedData: [],
      cachedAt: new Date(),
      folderId: 'f1',
    };
    mockPrisma.report.findUnique.mockResolvedValue(existing);
    mockPrisma.report.update.mockResolvedValue({ ...existing, name: 'New' });

    await updateReport('r1', { name: 'New' });

    expect(mockChatCompletionsCreate).not.toHaveBeenCalled();
    expect(mockPrisma.report.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ name: 'New', sqlQuery: VALID_SQL }),
      })
    );
  });

  it('regenerates SQL when description changes', async () => {
    const existing = {
      id: 'r1',
      name: 'Old',
      description: 'old description',
      sqlQuery: VALID_SQL,
      cachedData: [],
      cachedAt: new Date(),
      folderId: 'f1',
    };
    mockPrisma.report.findUnique.mockResolvedValue(existing);
    const newSql = 'SELECT id FROM "Patient"';
    mockChatCompletionsCreate.mockResolvedValue(
      makeAiResponse(newSql, 'New Report')
    );
    mockPrisma.$queryRawUnsafe.mockResolvedValue([]);
    mockPrisma.report.update.mockResolvedValue({ ...existing, description: 'new description' });

    await updateReport('r1', { description: 'new description' });

    expect(mockChatCompletionsCreate).toHaveBeenCalled();
  });
});

describe('deleteReport', () => {
  it('deletes the report by id', async () => {
    mockPrisma.report.delete.mockResolvedValue({ id: 'r1' });

    const result = await deleteReport('r1');

    expect(mockPrisma.report.delete).toHaveBeenCalledWith({ where: { id: 'r1' } });
    expect(result).toEqual({ id: 'r1' });
  });
});

describe('runReport', () => {
  it('re-executes the query and updates the cache', async () => {
    const existing = {
      id: 'r1',
      sqlQuery: VALID_SQL,
      cachedData: [],
      cachedAt: new Date(),
    };
    mockPrisma.report.findUnique.mockResolvedValue(existing);
    mockPrisma.$queryRawUnsafe.mockResolvedValue([{ id: 1 }, { id: 2 }]);
    const updated = { ...existing, cachedData: [{ id: 1 }, { id: 2 }] };
    mockPrisma.report.update.mockResolvedValue(updated);

    const result = await runReport('r1');

    expect(mockPrisma.$queryRawUnsafe).toHaveBeenCalled();
    expect(mockPrisma.report.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'r1' },
        data: expect.objectContaining({ cachedData: [{ id: 1 }, { id: 2 }] }),
      })
    );
    expect(result).toEqual(updated);
  });

  it('throws when report is not found', async () => {
    mockPrisma.report.findUnique.mockResolvedValue(null);

    await expect(runReport('no-such-id')).rejects.toThrow('Report not found');
  });
});

describe('duplicateReport', () => {
  it('creates a copy with "(Copy)" appended to the name', async () => {
    const existing = {
      id: 'r1',
      name: 'My Report',
      description: 'desc',
      sqlQuery: VALID_SQL,
      cachedData: [],
      cachedAt: new Date(),
      folderId: 'f1',
    };
    mockPrisma.report.findUnique.mockResolvedValue(existing);
    const copy = { ...existing, id: 'r2', name: 'My Report (Copy)' };
    mockPrisma.report.create.mockResolvedValue(copy);

    const result = await duplicateReport('r1');

    expect(mockPrisma.report.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ name: 'My Report (Copy)' }),
      })
    );
    expect(result).toEqual(copy);
  });

  it('throws when report is not found', async () => {
    mockPrisma.report.findUnique.mockResolvedValue(null);

    await expect(duplicateReport('no-such-id')).rejects.toThrow('Report not found');
  });
});

describe('getTemplates', () => {
  it('returns the static templates array', () => {
    const templates = getTemplates();
    expect(templates).toBeInstanceOf(Array);
    expect(templates.length).toBeGreaterThan(0);
    expect(templates[0]).toHaveProperty('id');
    expect(templates[0]).toHaveProperty('label');
    expect(templates[0]).toHaveProperty('description');
  });
});
