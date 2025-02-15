import express from 'express';
import { getCommunities } from '../controllers/communityController';

const router = express.Router();

router.get('/', getCommunities);
