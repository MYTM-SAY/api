import express from 'express';
import community from './communityRouter';

const router = express.Router();
    
router.use('/communities', community);

export default router;
    