import { SearchRepo } from '../repos/search.repo';

export const SearchService = {
  async search(type: 'community' | 'user' | undefined, q: string, tagNames?: string[]) {
    if (!q || typeof q !== 'string') {
      throw new Error('Search term (q) is required');
    }

    if (type === 'community') {
      return await SearchRepo.searchCommunities(q, tagNames);
    } else if (type === 'user') {
      return await SearchRepo.searchUsers(q);
    } else if (!type) {
      const [users, communities] = await Promise.all([
        SearchRepo.searchUsers(q),
        SearchRepo.searchCommunities(q, tagNames),
      ]);
      return { users, communities };
    } else {
      throw new Error("Invalid search type. Use 'community', 'user', or omit for both.");
    }
  },
};