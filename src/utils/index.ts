/* eslint-disable import/no-extraneous-dependencies */
import { z } from 'zod';

const MaterialTypeEnum = z.enum(['VIDEO', 'AUDIO', 'IMG', 'DOC', 'FILE'], {
});

const RoleEnum = z.enum(['ADMIN', 'OWNER', 'MODERATOR', 'MEMBER'], {
});

const UserSchema = z.object({
  id: z.number().int().positive().optional(), 
  fullname: z.string().nullable(),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  dob: z.date().nullable(),
  lastLogin: z.date().nullable(),
  createdAt: z.date().optional(), 
  updatedAt: z.date().optional(), 
}).strict();

const UserProfileSchema = z.object({
  id: z.number().int().positive().optional(), 
  userId: z.number().int().positive(),
  bio: z.string().nullable(),
  twitter: z.string().url().nullable(),
  facebook: z.string().url().nullable(),
  instagram: z.string().url().nullable(),
  linkedin: z.string().url().nullable(),
  youtube: z.string().url().nullable(),
  profilePictureURL: z.string().url().nullable(),
  createdAt: z.date().optional(), 
  updatedAt: z.date().optional(), 
}).strict();

const InstructorProfileSchema = z.object({
  id: z.number().int().positive().optional(), 
  userId: z.number().int().positive().nullable(),
  education: z.string().nullable(),
  experience: z.string().nullable(),
  certificates: z.array(z.string()),
  createdAt: z.date().optional(), 
  updatedAt: z.date().optional(), 
}).strict();

const TagSchema = z.object({
  id: z.number().int().positive().optional(), 
  name: z.string().min(1, 'Tag name is required'),
  isCommunityOnly: z.boolean(),
  communityId: z.number().int().positive().nullable(),
  createdAt: z.date().optional(), 
  updatedAt: z.date().optional(), 
}).strict();

const CommunitySchema = z.object({
  id: z.number().int().positive().optional(), 
  name: z.string().min(1, 'Community name is required'),
  description: z.string().nullable(),
  coverImgURL: z.string().url().nullable(),
  logoImgURL: z.string().url().nullable(),
  ownerId: z.number().int().positive(),
  createdAt: z.date().optional(), 
  updatedAt: z.date().optional(), 
}).strict();

const MemberRolesSchema = z.object({
  communityId: z.number().int().positive(),
  userId: z.number().int().positive(),
  Role: RoleEnum,
  createdAt: z.date().optional(), 
  updatedAt: z.date().optional(), 
}).strict();

const MaterialSchema = z.object({
  id: z.number().int().positive().optional(), 
  materialType: MaterialTypeEnum,
  fileUrl: z.string().url().nullable(),
  createdAt: z.date().optional(), 
  updatedAt: z.date().optional(), 
}).strict();

const ForumSchema = z.object({
  id: z.number().int().positive().optional(), 
  title: z.string().nullable(),
  description: z.string().nullable(),
  communityId: z.number().int().positive(),
  createdAt: z.date().optional(), 
  updatedAt: z.date().optional(), 
}).strict();

const PostSchema = z.object({
  id: z.number().int().positive().optional(), 
  title: z.string().min(1, 'Post title is required'),
  content: z.string().nullable(),
  attachments: z.array(z.string().url()).nullable(),
  forumId: z.number().int().positive(),
  authorId: z.number().int().positive(),
  createdAt: z.date().optional(), 
  updatedAt: z.date().optional(), 
}).strict();

const CommentSchema = z.object({
  id: z.number().int().positive().optional(), 
  content: z.string().nullable(),
  parentId: z.number().int().positive().nullable(),
  postId: z.number().int().positive(),
  authorId: z.number().int().positive(),
  createdAt: z.date().optional(), 
  updatedAt: z.date().optional(), 
}).strict();

const PostVoteSchema = z.object({
  type: z.boolean(),
  userId: z.number().int().positive(),
  postId: z.number().int().positive(),
}).strict();

const CommentVoteSchema = z.object({
  type: z.boolean(),
  userId: z.number().int().positive(),
  commentId: z.number().int().positive(),
}).strict();

const ClassroomSchema = z.object({
  id: z.number().int().positive().optional(), 
  name: z.string().min(1, 'Classroom name is required'),
  description: z.string().nullable(),
  coverImg: z.string().url().nullable(),
  communityId: z.number().int().positive(),
  createdAt: z.date().optional(), 
  updatedAt: z.date().optional(), 
}).strict();

const SectionSchema = z.object({
  id: z.number().int().positive().optional(), 
  name: z.string().min(1, 'Section name is required'),
  description: z.string().nullable(),
  classroomId: z.number().int().positive(),
  createdAt: z.date().optional(), 
  updatedAt: z.date().optional(), 
}).strict();

const LessonSchema = z.object({
  id: z.number().int().positive().optional(), 
  name: z.string().min(1, 'Lesson name is required'),
  notes: z.string().nullable(),
  materialId: z.number().int().positive(),
  sectionId: z.number().int().positive(),
  createdAt: z.date().optional(), 
  updatedAt: z.date().optional(), 
}).strict();

const QuestionSchema = z.object({
  id: z.number().int().positive().optional(), 
  text: z.string().nullable(),
  options: z.array(z.string()).min(1, 'At least one option is required'),
  answers: z.array(z.string()).min(1, 'At least one answer is required'),
  sectionId: z.number().int().positive(),
  createdAt: z.date().optional(), 
  updatedAt: z.date().optional(), 
}).strict();

const QuizSchema = z.object({
  id: z.number().int().positive().optional(), 
  name: z.string().min(1, 'Quiz name is required'),
  questions: z.array(QuestionSchema),
  duration: z.number().int().positive(),
  active: z.boolean(),
  classroomId: z.number().int().positive(),
  startDate: z.date(),
  endDate: z.date(),
  createdAt: z.date().optional(), 
  updatedAt: z.date().optional(), 
}).strict();

const FileSchema = z.object({
  id: z.number().int().positive().optional(), 
  name: z.string().min(1, 'File name is required'),
  url: z.string().url(),
  createdAt: z.date().optional(), 
  updatedAt: z.date().optional(), 
}).strict();

export {
  ClassroomSchema, CommentSchema, CommentVoteSchema, CommunitySchema, FileSchema, ForumSchema, InstructorProfileSchema, LessonSchema, MaterialSchema, MaterialTypeEnum, MemberRolesSchema, PostSchema, PostVoteSchema, QuestionSchema,
  QuizSchema, RoleEnum, SectionSchema, TagSchema, UserProfileSchema, UserSchema,
};
