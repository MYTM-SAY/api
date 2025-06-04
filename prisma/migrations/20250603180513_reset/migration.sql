-- CreateTable
CREATE TABLE "favoriteCommunities" (
    "userId" INTEGER NOT NULL,
    "communityId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favoriteCommunities_pkey" PRIMARY KEY ("userId","communityId")
);

-- AddForeignKey
ALTER TABLE "favoriteCommunities" ADD CONSTRAINT "favoriteCommunities_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "Community"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favoriteCommunities" ADD CONSTRAINT "favoriteCommunities_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
