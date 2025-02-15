import express from 'express';
import community from './communityRouter';

import post from './post.route';
import community from './community.route';

const router = express.Router();
    
router.use('/products', product);

export default router;
