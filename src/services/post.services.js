import { z } from 'zod';

import { getPostsDAO } from '../db/posts.dao.js';
import { generateErrrorObject } from '../utils/helpers.js';

const PostSchema = z
  .object({
    title: z.string().trim().default(''),
    slug: z.string().trim().min(2).max(150),
    description: z.string().trim().default(''),
    content: z.string().default(''),
    imageUrl: z.string().trim().default(''),
    tags: z.optional().array(z.string().trim()).default(''),
  })
  .strict();

export function getPostService(cnf, log) {
  const dao = getPostsDAO(log);

  return {
    createPost: async (payload) => {
      const result = PostSchema.safeParse(payload);
      if (!result.success) {
        return {
          data: undefined,
          error: generateErrrorObject(result.error),
        };
      }

      // Check for duplicate slug
      const post = await dao.findBySlug(payload.slug);
      if (post) {
        return {
          data: undefined,
          error: { slug: 'A post with this slug already exists' },
        };
      }

      const created = await dao.insert(result.data);
      return {
        data: created,
        error: undefined,
      };
    },
    deletePost: async (id) => {
      const deleted = await dao.deleteById(id);
      return deleted;
    },
    fetchLatestPosts: async () => {
      const latest = await dao.fetchLatestPosts();
      return latest;
    },
    getPostById: async (id) => {
      const found = await dao.findById(id);
      found.tagArray = JSON.parse(found.tags || '[]');
      return found;
    },
    getPostBySlug: async (slug) => {
      const found = await dao.findBySlug(slug);
      found.tagArray = found.tags ? found.tags.split(',') : [];
      return found;
    },
    queryPosts: async (qry) => {
      const data = await dao.query(qry);
      return data;
    },
    updatePost: async (id, payload) => {
      const result = PostSchema.safeParse(payload);
      if (!result.success) {
        return {
          error: generateErrrorObject(result.error),
        };
      }
      // Verify slug is unique
      const post = await dao.findBySlug(result.data.slug);
      if (post && post.id !== id) {
        return {
          data: undefined,
          error: { name: 'A post with this slug already exists' },
        };
      }
      const updated = await dao.updateById(id, result.data);
      return updated;
    },
  };
}
