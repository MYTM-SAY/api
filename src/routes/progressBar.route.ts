import express from 'express';
import { modifiedSection } from '../controllers/progressBarController';

const router = express.Router();

router.post('/change-section-status/:id', modifiedSection);

export default router;
