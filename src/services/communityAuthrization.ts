import { Role } from "@prisma/client"
import APIError from "../errors/APIError"
import { CommunityRepo } from "../repos/community.repo"
import { CommunityMembersRepo } from "../repos/communityMember.repo"

async function getAllUsersInCommunity(communityId: number) {
    const community = await CommunityRepo.findById(communityId)

    if (!community)
        throw new APIError('Community not found', 404)

    const members = await CommunityMembersRepo.getUsersInCommunity(communityId)

    const flattenedUsers = members.map(({ User }) => ({
        id: User.id,
        fullname: User.fullname,
        email: User.email,
        profilePictureURL: User.UserProfile?.profilePictureURL ?? null,
        role: User.CommunityMembers[0]?.Role ?? null,
    }));

    return flattenedUsers
}

async function hasRoles(userId: number, communityId: number, requiredRoles: Role[]) {
    const community = await CommunityRepo.findById(communityId)
    if (!community)
        throw new APIError('Community not found', 404)

    const userRole = await CommunityMembersRepo.getUserRoleInCommunity(
        userId,
        communityId,
    );

    if (!userRole || !requiredRoles.includes(userRole)) return false;

    return true;
}

export const CommunityAuthrizationService =
{
    getAllUsersInCommunity,
    hasRoles
}