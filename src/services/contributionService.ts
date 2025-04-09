import { prisma } from '../db/PrismaClient'

export async function upsertUserContribution(userId: number, customDate?: Date) {

  let dateToUse = customDate ? new Date(customDate) : new Date();

  dateToUse.setHours(0, 0, 0, 0);
  dateToUse.toISOString();
//    currentDate.setDate(currentDate.getDate() + 1); that's for me if i wanna test another day
 
  return await prisma.userContributions.upsert({
    where: {
      userId_dateOnly: { 
        userId, 
        dateOnly: dateToUse
      },
    },
    update: {
      count: { increment: 1 },
    },
    create: { 
      userId,
      count: 1,
      dateOnly: dateToUse,
    },
  });
}
