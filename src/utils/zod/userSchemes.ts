import { z } from 'zod';

export const UserSchema = z.object({
  fullname: z.string().min(1, 'Full name is required').max(100, 'Full name must be at most 100 characters'),
  username: z.string().min(3, 'Username must be at least 3 characters').max(50, 'Username must be at most 50 characters'),
  email: z.string().email('Invalid email format'),
  dob: z.date({ invalid_type_error: 'Invalid date format' }),
  lastLogin: z.string().optional().refine((date) => !date || !isNaN(Date.parse(date)), { message: 'Invalid date format',}),
  hashedPassword: z.string().min(8, 'Password must be at least 8 characters'),
}).strict();
