import { prisma } from '../db/PrismaClient'

export async function upsertUserContribution(userId: number, customDate?: Date) {
  if (!userId || isNaN(userId)) {
    throw new Error('Invalid userId');
  }

  let dateToUse = customDate ? new Date(customDate) : new Date();
  dateToUse = new Date(Date.UTC(dateToUse.getFullYear(), dateToUse.getMonth(), dateToUse.getDate()));
  
  
  const result = await prisma.userContributions.upsert({
    where: {
      userId_dateOnly: { 
        userId, 
        dateOnly: dateToUse,
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

  console.log('Upsert result:', result);
  return result;
}
