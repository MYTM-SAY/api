/* eslint-disable import/no-extraneous-dependencies */
import { z } from 'zod'

const MaterialTypeEnum = z.enum(['VIDEO', 'AUDIO', 'IMG', 'DOC', 'FILE'], {})

const RoleEnum = z.enum(['ADMIN', 'OWNER', 'MODERATOR', 'MEMBER'], {})

export const UserSchema = z
  .object({
    id: z.number().int().positive().optional(),
    fullname: z.string().nullable(),
    username: z
      .string()
      .min(3, 'Username must be at least 3 characters')
      .max(255, 'Username must be at most 255 characters'),
    email: z.string().email('Invalid email address'),
    dob: z.date().nullable(),
    lastLogin: z.date().nullable(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
  })
  .strict()

export const UserProfileSchema = z
  .object({
    id: z.number().int().positive().optional(),
    userId: z.number().int().positive(),
    bio: z.string().max(50, 'Bio must be at most 50 characters').nullable(),
    twitter: z.string().url().nullable(),
    facebook: z.string().url().nullable(),
    instagram: z.string().url().nullable(),
    linkedin: z.string().url().nullable(),
    youtube: z.string().url().nullable(),
    profilePictureURL: z.string().url().nullable(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
  })
  .strict()

export const InstructorProfileSchema = z
  .object({
    id: z.number().int().positive().optional(),
    userId: z.number().int().positive().nullable(),
    education: z
      .string()
      .max(100, 'Education must be at most 100 characters')
      .nullable(),
    experience: z
      .string()
      .max(1000, 'Experience must be at most 1000 characters')
      .nullable(),
    certificates: z.array(z.string()),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
  })
  .strict()

export const TagSchema = z
  .object({
    id: z.number().int().positive().optional(),
    name: z
      .string()
      .min(1, 'Tag name is required')
      .max(50, 'Tag name must be at most 50 characters'),
    isCommunityOnly: z.boolean(),
    communityId: z.number().int().positive().nullable(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
  })
  .strict()

export const CommunitySchema = z.object({
  id: z.number().int().positive().optional(),
  name: z
    .string()
    .min(1, 'Community name is required')
    .max(100, 'Community name must be at most 100 characters'),
  description: z
    .string()
    .max(500, 'Description must be at most 500 characters')
    .optional(),
  coverImgURL: z.string().url().optional(),
  logoImgURL: z.string().url().optional(),
  ownerId: z.number().int().positive().optional(),
})

export const MemberRolesSchema = z
  .object({
    communityId: z.number().int().positive(),
    userId: z.number().int().positive(),
    Role: RoleEnum,
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
  })
  .strict()

export const MaterialSchema = z
  .object({
    id: z.number().int().positive().optional(),
    materialType: MaterialTypeEnum,
    fileUrl: z.string().url().nullable(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
  })
  .strict()

export const ForumSchema = z
  .object({
    id: z.number().int().positive().optional(),
    title: z
      .string()
      .min(1, 'Title is required')
      .max(200, 'Title must be at most 200 characters')
      .nullable(),
    description: z
      .string()
      .max(1000, 'Description must be at most 1000 characters')
      .nullable(),
    communityId: z.number().int().positive(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
  })
  .strict()

export const PostSchema = z
  .object({
    id: z.number().int().positive().optional(),
    title: z
      .string()
      .min(1, 'Post title is required')
      .max(200, 'Post title must be at most 200 characters'),
    content: z
      .string()
      .max(5000, 'Content must be at most 5000 characters')
      .nullable(),
    attachments: z.array(z.string().url()).nullable(),
    forumId: z.number().int().positive(),
    authorId: z.number().int().positive(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
  })
  .strict()

export const CommentSchema = z
  .object({
    id: z.number().int().positive().optional(),
    content: z
      .string()
      .max(1000, 'Content must be at most 1000 characters')
      .nullable(),
    parentId: z.number().int().positive().nullable().optional(),
    postId: z.number().int().positive(),
    authorId: z.number().int().positive(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
  })
  .strict()

export const PostVoteSchema = z
  .object({
    type: z.boolean(),
    userId: z.number().int().positive(),
    postId: z.number().int().positive(),
  })
  .strict()

export const CommentVoteSchema = z
  .object({
    type: z.boolean(),
    userId: z.number().int().positive(),
    commentId: z.number().int().positive(),
  })
  .strict()

export const ClassroomSchema = z
  .object({
    id: z.number().int().positive().optional(),
    name: z
      .string()
      .min(1, 'Classroom name is required')
      .max(100, 'Classroom name must be at most 100 characters'),
    description: z
      .string()
      .max(500, 'Description must be at most 500 characters')
      .nullable(),
    coverImg: z.string().url().nullable(),
    communityId: z.number().int().positive(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
  })
  .strict()

export const SectionSchema = z
  .object({
    id: z.number().int().positive().optional(),
    name: z
      .string()
      .min(1, 'Section name is required')
      .max(100, 'Section name must be at most 100 characters'),
    description: z
      .string()
      .max(500, 'Description must be at most 500 characters')
      .nullable(),
    classroomId: z.number().int().positive(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
  })
  .strict()

export const LessonSchema = z
  .object({
    id: z.number().int().positive().optional(),
    name: z
      .string()
      .min(1, 'Lesson name is required')
      .max(100, 'Lesson name must be at most 100 characters'),
    notes: z
      .string()
      .max(5000, 'Notes must be at most 5000 characters')
      .nullable(),
    materialId: z.number().int().positive(),
    sectionId: z.number().int().positive(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
  })
  .strict()

export const QuestionSchema = z
  .object({
    id: z.number().int().positive().optional(),
    text: z
      .string()
      .max(500, 'Question text must be at most 500 characters')
      .nullable(),
    options: z
      .array(z.string().max(200, 'Option must be at most 200 characters'))
      .min(1, 'At least one option is required'),
    answers: z
      .array(z.string().max(200, 'Answer must be at most 200 characters'))
      .min(1, 'At least one answer is required'),
    sectionId: z.number().int().positive(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
  })
  .strict()

export const QuizSchema = z
  .object({
    id: z.number().int().positive().optional(),
    name: z
      .string()
      .min(1, 'Quiz name is required')
      .max(100, 'Quiz name must be at most 100 characters'),
    questions: z.array(QuestionSchema),
    duration: z.number().int().positive(),
    active: z.boolean(),
    classroomId: z.number().int().positive(),
    startDate: z.date(),
    endDate: z.date(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
  })
  .strict()

export const FileSchema = z
  .object({
    id: z.number().int().positive().optional(),
    name: z
      .string()
      .min(1, 'File name is required')
      .max(200, 'File name must be at most 200 characters'),
    url: z.string().url(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
  })
  .strict()
