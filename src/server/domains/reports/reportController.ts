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

// ============ FOLDER CONTROLLERS ============

export const getFolders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Ensure default folders exist
    await seedDefaultFolders();

    const folders = await getAllFolders();
    res.locals.folders = folders;
    return next();
  } catch (error) {
    next({
      status: 500,
      message: { err: 'Error fetching folders' },
      log: `Error in reportController.getFolders: ${error}`,
    });
  }
};

export const postFolder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name } = req.body;
    if (!name) {
      return next({
        status: 400,
        message: { err: 'Folder name is required' },
        log: 'Missing folder name in request body',
      });
    }

    const folder = await createFolder({ name });
    res.locals.folder = folder;
    return next();
  } catch (error) {
    next({
      status: 500,
      message: { err: 'Error creating folder' },
      log: `Error in reportController.postFolder: ${error}`,
    });
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
    next({
      status: 500,
      message: { err: 'Error updating folder' },
      log: `Error in reportController.patchFolder: ${error}`,
    });
  }
};

export const removeFolder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await deleteFolder(id);
    return next();
  } catch (error) {
    next({
      status: 500,
      message: { err: 'Error deleting folder' },
      log: `Error in reportController.removeFolder: ${error}`,
    });
  }
};

// ============ REPORT CONTROLLERS ============

export const getReports = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reports = await getAllReports();
    res.locals.reports = reports;
    return next();
  } catch (error) {
    next({
      status: 500,
      message: { err: 'Error fetching reports' },
      log: `Error in reportController.getReports: ${error}`,
    });
  }
};

export const getReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const report = await getReportById(id);

    if (!report) {
      return next({
        status: 404,
        message: { err: 'Report not found' },
        log: `Report not found: ${id}`,
      });
    }

    res.locals.report = report;
    return next();
  } catch (error) {
    next({
      status: 500,
      message: { err: 'Error fetching report' },
      log: `Error in reportController.getReport: ${error}`,
    });
  }
};

export const postReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description, folderId } = req.body;

    if (!description) {
      return next({
        status: 400,
        message: { err: 'Report description is required' },
        log: 'Missing description in request body',
      });
    }

    const report = await createReport({ name, description, folderId });
    res.locals.report = report;
    return next();
  } catch (error: any) {
    // Check if it's a validation error from SQL
    if (error.message?.includes('Invalid query') || error.message?.includes('Query validation')) {
      return next({
        status: 400,
        message: { err: error.message },
        log: `SQL validation error: ${error.message}`,
      });
    }

    next({
      status: 500,
      message: { err: 'Error creating report' },
      log: `Error in reportController.postReport: ${error}`,
    });
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
      return next({
        status: 404,
        message: { err: 'Report not found' },
        log: `Report not found: ${req.params.id}`,
      });
    }

    next({
      status: 500,
      message: { err: 'Error updating report' },
      log: `Error in reportController.patchReport: ${error}`,
    });
  }
};

export const removeReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await deleteReport(id);
    return next();
  } catch (error) {
    next({
      status: 500,
      message: { err: 'Error deleting report' },
      log: `Error in reportController.removeReport: ${error}`,
    });
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
      return next({
        status: 404,
        message: { err: 'Report not found' },
        log: `Report not found: ${req.params.id}`,
      });
    }

    next({
      status: 500,
      message: { err: 'Error refreshing report' },
      log: `Error in reportController.refreshReport: ${error}`,
    });
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
      return next({
        status: 404,
        message: { err: 'Report not found' },
        log: `Report not found: ${req.params.id}`,
      });
    }

    next({
      status: 500,
      message: { err: 'Error duplicating report' },
      log: `Error in reportController.cloneReport: ${error}`,
    });
  }
};

// ============ TEMPLATE CONTROLLERS ============

export const getReportTemplates = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const templates = getTemplates();
    res.locals.templates = templates;
    return next();
  } catch (error) {
    next({
      status: 500,
      message: { err: 'Error fetching templates' },
      log: `Error in reportController.getReportTemplates: ${error}`,
    });
  }
};
