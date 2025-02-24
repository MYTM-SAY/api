import { Router } from 'express';
import { SectionController } from '../controllers/sectionController';
import {
  isAuthenticated,
  hasCommunityRole,
} from '../middlewares/authMiddleware';
import validateClassroomCommunity from '../middlewares/validateClassroomCommunity';

const router = Router();

router.use(
  '/:communityId/:classroomId',
  isAuthenticated,
  validateClassroomCommunity,
);

router.post(
  '/:communityId/:classroomId',
  hasCommunityRole(['OWNER', 'ADMIN']),
  SectionController.create,
);
router.get(
  '/:communityId/:classroomId/:sectionId',
  hasCommunityRole(['OWNER', 'ADMIN', 'MODERATOR', 'MEMBER']),
  SectionController.getById,
);
router.put(
  '/:communityId/:classroomId/:sectionId',
  hasCommunityRole(['OWNER', 'ADMIN']),
  SectionController.update,
);
router.delete(
  '/:communityId/:classroomId/:sectionId',
  hasCommunityRole(['OWNER', 'ADMIN']),
  SectionController.delete,
);
router.get(
  '/:communityId/:classroomId',
  hasCommunityRole(['OWNER', 'ADMIN', 'MODERATOR', 'MEMBER']),
  SectionController.getByClassroom,
);

export default router;
