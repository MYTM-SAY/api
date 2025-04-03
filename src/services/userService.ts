import { UserRepo } from '../repos/user.repo'
import { UserProfileRepo } from '../repos/userProfile.repo'
import { MemberRolesRepo } from '../repos/memberRoles.repo'
import APIError from '../errors/APIError'
import { z } from 'zod'
import { UserSchema } from '../utils/zod/userSchemes'
import { UserProfileSchema } from '../utils/zod/userProfileSchemes'
import { validate } from 'uuid'
import { UserSchemaPublic } from '../utils/zod/userSchemes'


async function getUserById(
   id: number | null,

) {
   if(!id || isNaN(id)) throw new APIError('Invalid User ID', 400)

   if(id) {
      const user = await UserRepo.findById(id)
      if(!user) throw new APIError('User not found', 404)
      const safeUser = await UserSchemaPublic.parse(user);

      return safeUser
   }
}


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
 

async function createUser(
   data: Omit<z.infer<typeof UserSchema>, 'id'>,
) {
   const validatedData = await UserSchema.parseAsync(data)
   return UserRepo.createUser(validatedData)
}

// user can update the fullname and the dob only
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



export const UserService = {
   getUserById,
   getUserByUsername,
   createUser,
   updateUser,
   updateLastLogin,
   // add more functions as needed
}