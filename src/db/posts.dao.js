import { eq, desc } from 'drizzle-orm';

import db from './index.js';
import { posts } from './schemas.js';

export function getPostsDAO(log) {
  return {
    deleteById: async function (id) {
      const [deleted] = await db
        .delete(posts)
        .where(eq(posts.id, id))
        .returning();
      log.debug(deleted, `Deleted post by id ${id}`);
      return deleted;
    },
    fetchLatestPosts: async function () {
      const result = await db
        .select()
        .from(posts)
        .orderBy(desc(posts.createdAt))
        .limit(3);
      log.debug(result, 'Found latest posts');
      return result;
    },
    findById: async function (id) {
      const [found] = await db
        .select()
        .from(posts)
        .where(eq(posts.id, id))
        .limit(1);
      log.debug(found, `Found post by id ${id}`);
      return found;
    },
    findBySlug: async function (slug) {
      const [post] = await db
        .select()
        .from(posts)
        .where(eq(posts.slug, slug))
        .limit(1);
      log.debug(post, `Found post by slug ${slug}`);
      return post;
    },
    insert: async function (data) {
      const [newPost] = await db
        .insert(posts)
        .values(data)
        .returning();
      log.debug(newPost, 'Created activity');
      return newPost;
    },
    query: async function (qry) {
      log.debug(qry, 'Querying posts');
      const result = await db
        .select()
        .from(posts)
        .orderBy(desc(posts.createdAt));
      log.debug(result, 'Found posts');
      return result;
    },
    updateById: async function (id, data) {
      const [updated] = await db
        .update(activities)
        .set(data)
        .where(eq(posts.id, id))
        .returning();
      log.debug(updated, `Updated post by id ${id}`);
      return updated;
    },
  };
}
