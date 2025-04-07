import { z } from 'zod';

export const UserSchema = z.object({
  fullname: z.string().min(1, 'Full name is required').max(100, 'Full name must be at most 100 characters'),
  username: z.string().min(3, 'Username must be at least 3 characters').max(50, 'Username must be at most 50 characters'),
  email: z.string().email('Invalid email format'),
  dob: z.date({ invalid_type_error: 'Invalid date format' }),
  lastLogin: z.date().optional(),
  hashedPassword: z.string().min(8, 'Password must be at least 8 characters'),
}).strict();

// schema for user profile without hashed password 
export const UserSchemaPublic = z.object({
  id: z.number().optional(),
  fullname: z.string().min(1, 'Full name is required').max(100, 'Full name must be at most 100 characters').optional(),
  username: z.string().min(3, 'Username must be at least 3 characters').max(50, 'Username must be at most 50 characters').optional(),
  email: z.string().email('Invalid email format').optional(),
  dob: z.date({ invalid_type_error: 'Invalid date format' }).optional(),
  lastLogin: z.date().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
}).strip(); // remove hashed password from the schema
