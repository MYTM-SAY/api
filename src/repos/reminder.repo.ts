import { prisma } from '../db/PrismaClient'
export const ReminderRepo = {
   // Quiz <- Classroom <- Community <- CommunityMembers <- (userId)
   // output: quizId, communityName, endDate of the quiz, quiz title  

async findRemindersForJoinedCommunities(userId: number) {
      const result = await prisma.communityMembers.findMany({
         where: {
            userId: userId,
         },
         select: {
            Community: {
               select: {
                  name: true,
                  id: true,
                  Classrooms: {
                     select: {
                        Quiz: {
                           where: {
                              active: true
                           },
                           select: {
                              id: true,
                              name: true, 
                              startDate: true,
                              endDate: true,
                           },
                        },
                     },
                  },
               },
            },
         },
      });
      
   return result
   }
}