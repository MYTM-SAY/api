import { Request, Response, NextFunction } from 'express';
import { SearchService } from '../services/searchService';
import { ResponseHelper } from '../utils/responseHelper';

export const SearchController = {
  async search(req: Request, res: Response, next: NextFunction) {
    try {
      const { type, q, tags } = req.query;

      if (!q || typeof q !== 'string') {
        return res.status(400).json({ error: 'Search term (q) is required' });
      }

      const tagNames = tags
        ? Array.isArray(tags)
          ? tags.map(String).filter((t) => t.trim() !== '') // Ensure valid strings
          : [String(tags).trim()].filter((t) => t !== '')
        : [];

      const result = await SearchService.search(
        type as 'community' | 'user' | undefined,
        q,
        tagNames.length ? tagNames : undefined
      );
      res
            .status(200)
            .json(ResponseHelper.success('Search completed successfully', result))
    } catch (err) {
      next(err);
    }
  },
};