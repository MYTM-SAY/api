import { z } from 'zod';

const socialMediaUrl = z.string().url('Invalid URL').optional();

export const UserProfileSchema = z.object({
  bio: z.string().max(500, 'Bio must be at most 500 characters').optional(),
  twitter: socialMediaUrl,
  facebook: socialMediaUrl,
  instagram: socialMediaUrl,
  linkedin: socialMediaUrl,
  youtube: socialMediaUrl,
  profilePictureURL: z.string().url('Invalid profile picture URL').optional(),
  tags: z.array(z.string().min(1)).optional(), // tag names instead of IDs
}).strict();


