import express from 'express';
import tebraController from './tebraController.ts';

const {testTebraApi} = tebraController

const tebraRouter = express.Router();

tebraRouter.post('/test', testTebraApi, (req, res) => {
  return res.status(200).json({message: "api working"});
});



export default tebraRouter;
