import { UserRepo } from '../repos/user.repo'
import { UserProfileRepo } from '../repos/userProfile.repo'
import { MemberRolesRepo } from '../repos/memberRoles.repo'
import APIError from '../errors/APIError'
import { z } from 'zod'
import { UserSchema } from '../utils/zod/userSchemes'
import { UserProfileSchema } from '../utils/zod/userProfileSchemes'
import { validate } from 'uuid'
import { UserSchemaPublic } from '../utils/zod/userSchemes'

// get by id
async function getUserById( id: number | null ) {

   if(!id || isNaN(id)) throw new APIError('Invalid User ID', 400)

   const user = await UserRepo.findById(id)
   if(!user) throw new APIError('User not found', 404)
   const safeUser = await UserSchemaPublic.parse(user);

   return safeUser
   
}

// get by username
async function getUserByUsername(username: string) {

   // Check that the username does not contain any spaces
   if (/\s/.test(username)) {
     throw new APIError('Username cannot contain spaces', 400);
   }
 
   const user = await UserRepo.findByUsername(username);
   if (!user) {
     throw new APIError('User not found', 404);
   }
 
   return user;
 }
 
//create user
async function createUser(
   data: Omit<z.infer<typeof UserSchema>, 'id'>,
) {
   const validatedData = await UserSchema.parseAsync(data)
   return UserRepo.createUser(validatedData)
}

// update user, fullname and dob only
async function updateUser(
   userId: number,
   data: Omit<z.infer<typeof UserSchema>, 'id'>,
) {
   const validatedData = await UserSchema.parseAsync(data)
   return UserRepo.updateUser(userId, validatedData.fullname, validatedData.dob)
}


// update last login  
async function updateLastLogin(
   userId: number
) {
   // vaildate user
   if(!userId || isNaN(userId)) throw new APIError('Invalid User ID', 400)
   const user = await UserRepo.findById(userId)
   if(!user) throw new APIError('User not found', 404)
   return UserRepo.updateLastLogin(userId)
}

// get user contributions
async function getUserContributions(
   userId: number
) {
   // validate userId
   if(!userId || isNaN(userId)) throw new APIError('Invalid User ID', 400)

   const user = await UserRepo.findById(userId)
   if(!user) throw new APIError('User not found', 404)

   const contributions = await UserRepo.getContributionsByUserId(userId)
   if(!contributions) throw new APIError('Contributions not found', 404)
   // validate contributions

   return contributions
}



export const UserService = {
   getUserById,
   getUserByUsername,
   createUser,
   updateUser,
   updateLastLogin,
   getUserContributions,
   // add more functions as needed
}