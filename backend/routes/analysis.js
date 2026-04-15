import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import {
  analyzeRepo,
  getAnalysisList,
  getAnalysis,
  getFileContent,
  explainFile
} from '../controllers/analysisController.js';

const router = express.Router();

router.post('/analyze', authMiddleware, analyzeRepo);
router.get('/', authMiddleware, getAnalysisList);
router.get('/:id', authMiddleware, getAnalysis);
router.get('/:id/file', authMiddleware, getFileContent);
router.post('/:id/explain-file', authMiddleware, explainFile);

export default router;
