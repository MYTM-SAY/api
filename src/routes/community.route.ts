import express from 'express'
import {
	discoverCommunities,
	getCommunities,
	createCommunity,
	deleteCommunity,
	updateCommunity,
	getCommunity,
} from '../controllers/communityController'

import {
	promoteToModerator,
	demoteFromModerator,
} from '../controllers/memberRoles'

import { isAuthenticated } from '../middlewares/authMiddleware'
import validate from '../middlewares/validation'
import { z } from 'zod'
import { CommunitySchema } from '../utils'

const app = express.Router()

// public
app.get('/discover', discoverCommunities) // need revision
app.get('/:id', getCommunity) // done
app.get('/', getCommunities) // done

// authed
// TODO: app.get('/mine', isAuthenticated, getUserCommunities);
app.post('/', isAuthenticated, validate(CommunitySchema), createCommunity)
app.put('/:id', validate(CommunitySchema), updateCommunity)
app.post('/:id/remove-moderator/:userId', isAuthenticated, demoteFromModerator) // done
app.post('/:id/assign-moderator/:userId', isAuthenticated, promoteToModerator) // done

app.delete('/:id', deleteCommunity)

export default app
