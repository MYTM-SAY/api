import { prisma } from '../db/PrismaClient';

export const UserProfileRepo = {

  async findByUserId(userId: number) {
    const result = await prisma.userProfile.findUnique({
      where: { userId },
      select: { Tags: true },
    });
    return result;
  },

  // get details of a user profile
  async getProfile(userId: number) {
    const result = await prisma.userProfile.findUnique({
      where: { userId },
      select: {
        bio: true,
        twitter: true,
        facebook: true,
        instagram: true,
        linkedin: true,
        youtube: true,
        profilePictureURL: true,
      },
    });
    return result;
  },
  
// model UserProfile {
//   id                Int     @id @default(autoincrement())
//   userId            Int     @unique
//   bio               String?
//   twitter           String?
//   facebook          String?
//   instagram         String?
//   linkedin          String?
//   youtube           String?
//   profilePictureURL String?

//   Tags Tag[]
//   User User  @relation(fields: [userId], references: [id])
// }
 
}; 