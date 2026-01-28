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

const reportRouter = express.Router();

// ============ TEMPLATE ROUTES ============
reportRouter.get('/templates', getReportTemplates, (req, res) => {
  return res.status(200).json({ data: res.locals.templates });
});

// ============ FOLDER ROUTES ============
reportRouter.get('/folders', getFolders, (req, res) => {
  return res.status(200).json({ data: res.locals.folders });
});

reportRouter.post('/folders', postFolder, (req, res) => {
  return res.status(201).json({ data: res.locals.folder });
});

reportRouter.patch('/folders/:id', patchFolder, (req, res) => {
  return res.status(200).json({ data: res.locals.folder });
});

reportRouter.delete('/folders/:id', removeFolder, (req, res) => {
  return res.status(200).json({ message: 'Folder deleted successfully' });
});

// ============ REPORT ROUTES ============
reportRouter.get('/', getReports, (req, res) => {
  return res.status(200).json({ data: res.locals.reports });
});

reportRouter.get('/:id', getReport, (req, res) => {
  return res.status(200).json({ data: res.locals.report });
});

reportRouter.post('/', postReport, (req, res) => {
  return res.status(201).json({ data: res.locals.report });
});

reportRouter.patch('/:id', patchReport, (req, res) => {
  return res.status(200).json({ data: res.locals.report });
});

reportRouter.delete('/:id', removeReport, (req, res) => {
  return res.status(200).json({ message: 'Report deleted successfully' });
});

// ============ REPORT ACTIONS ============
reportRouter.post('/:id/run', refreshReport, (req, res) => {
  return res.status(200).json({ data: res.locals.report });
});

reportRouter.post('/:id/duplicate', cloneReport, (req, res) => {
  return res.status(201).json({ data: res.locals.report });
});

export default reportRouter;
