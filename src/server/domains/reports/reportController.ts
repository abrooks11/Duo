import { Request, Response, NextFunction } from 'express';
import {
  getAllFolders,
  createFolder,
  updateFolder,
  deleteFolder,
  seedDefaultFolders,
  getAllReports,
  getReportById,
  createReport,
  updateReport,
  deleteReport,
  runReport,
  duplicateReport,
  getTemplates,
} from './reportServices.ts';
import { AppError, handleControllerError } from '../../shared/errorHandlers.js';

// ============ FOLDER CONTROLLERS ============

export const getFolders = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    await seedDefaultFolders();
    const folders = await getAllFolders();
    res.locals.folders = folders;
    return next();
  } catch (error) {
    handleControllerError(error, 'getFolders', next, 'Error fetching folders');
  }
};

export const postFolder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name } = req.body;
    if (!name) {
      return next(new AppError('Folder name is required', 400, 'Missing folder name in request body'));
    }

    const folder = await createFolder({ name });
    res.locals.folder = folder;
    return next();
  } catch (error) {
    handleControllerError(error, 'postFolder', next, 'Error creating folder');
  }
};

export const patchFolder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, sortOrder } = req.body;

    const folder = await updateFolder(id, { name, sortOrder });
    res.locals.folder = folder;
    return next();
  } catch (error) {
    handleControllerError(error, 'patchFolder', next, 'Error updating folder');
  }
};

export const removeFolder = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await deleteFolder(id);
    return next();
  } catch (error) {
    handleControllerError(error, 'removeFolder', next, 'Error deleting folder');
  }
};

// ============ REPORT CONTROLLERS ============

export const getReports = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const reports = await getAllReports();
    res.locals.reports = reports;
    return next();
  } catch (error) {
    handleControllerError(error, 'getReports', next, 'Error fetching reports');
  }
};

export const getReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const report = await getReportById(id);

    if (!report) {
      return next(new AppError('Report not found', 404, `Report not found: ${id}`));
    }

    res.locals.report = report;
    return next();
  } catch (error) {
    handleControllerError(error, 'getReport', next, 'Error fetching report');
  }
};

export const postReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description, folderId } = req.body;

    if (!description) {
      return next(new AppError('Report description is required', 400, 'Missing description in request body'));
    }

    const report = await createReport({ name, description, folderId });
    res.locals.report = report;
    return next();
  } catch (error: any) {
    if (error.message?.includes('Invalid query') || error.message?.includes('Query validation')) {
      return next(new AppError(error.message, 400, `SQL validation error: ${error.message}`));
    }

    handleControllerError(error, 'postReport', next, 'Error creating report');
  }
};

export const patchReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, description, folderId } = req.body;

    const report = await updateReport(id, { name, description, folderId });
    res.locals.report = report;
    return next();
  } catch (error: any) {
    if (error.message === 'Report not found') {
      return next(new AppError('Report not found', 404, `Report not found: ${req.params.id}`));
    }

    handleControllerError(error, 'patchReport', next, 'Error updating report');
  }
};

export const removeReport = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await deleteReport(id);
    return next();
  } catch (error) {
    handleControllerError(error, 'removeReport', next, 'Error deleting report');
  }
};

export const refreshReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const report = await runReport(id);
    res.locals.report = report;
    return next();
  } catch (error: any) {
    if (error.message === 'Report not found') {
      return next(new AppError('Report not found', 404, `Report not found: ${req.params.id}`));
    }

    handleControllerError(error, 'refreshReport', next, 'Error refreshing report');
  }
};

export const cloneReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const report = await duplicateReport(id);
    res.locals.report = report;
    return next();
  } catch (error: any) {
    if (error.message === 'Report not found') {
      return next(new AppError('Report not found', 404, `Report not found: ${req.params.id}`));
    }

    handleControllerError(error, 'cloneReport', next, 'Error duplicating report');
  }
};

// ============ TEMPLATE CONTROLLERS ============

export const getReportTemplates = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const templates = getTemplates();
    res.locals.templates = templates;
    return next();
  } catch (error) {
    handleControllerError(error, 'getReportTemplates', next, 'Error fetching templates');
  }
};
