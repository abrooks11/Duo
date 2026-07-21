import express from 'express';
import {
  getFolders,
  postFolder,
  patchFolder,
  removeFolder,
  getReports,
  getReport,
  postReport,
  patchReport,
  removeReport,
  refreshReport,
  cloneReport,
  getReportTemplates,
} from './reportController.ts';
import { sendSuccess } from '../../shared/errorHandlers.js';

const reportRouter = express.Router();

// ============ TEMPLATE ROUTES ============
reportRouter.get('/templates', getReportTemplates, (_req, res) => {
  return sendSuccess(res, res.locals.templates);
});

// ============ FOLDER ROUTES ============
reportRouter.get('/folders', getFolders, (_req, res) => {
  return sendSuccess(res, res.locals.folders);
});

reportRouter.post('/folders', postFolder, (_req, res) => {
  return sendSuccess(res, res.locals.folder, undefined, 201);
});

reportRouter.patch('/folders/:id', patchFolder, (_req, res) => {
  return sendSuccess(res, res.locals.folder);
});

reportRouter.delete('/folders/:id', removeFolder, (_req, res) => {
  return sendSuccess(res, null, 'Folder deleted successfully');
});

// ============ REPORT ROUTES ============
reportRouter.get('/', getReports, (_req, res) => {
  return sendSuccess(res, res.locals.reports);
});

reportRouter.get('/:id', getReport, (_req, res) => {
  return sendSuccess(res, res.locals.report);
});

reportRouter.post('/', postReport, (_req, res) => {
  return sendSuccess(res, res.locals.report, undefined, 201);
});

reportRouter.patch('/:id', patchReport, (_req, res) => {
  return sendSuccess(res, res.locals.report);
});

reportRouter.delete('/:id', removeReport, (_req, res) => {
  return sendSuccess(res, null, 'Report deleted successfully');
});

// ============ REPORT ACTIONS ============
reportRouter.post('/:id/run', refreshReport, (_req, res) => {
  return sendSuccess(res, res.locals.report);
});

reportRouter.post('/:id/duplicate', cloneReport, (_req, res) => {
  return sendSuccess(res, res.locals.report, undefined, 201);
});

export default reportRouter;
