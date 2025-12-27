import { and, eq, desc, like, or, sql } from 'drizzle-orm';

import db from './index.js';
import { posts } from './schemas.js';

export function getPostsDAO(log) {
  return {
    fetchLatestPosts: async function () {
      const result = await db
        .select()
        .from(posts)
        .where(eq(posts.published, true))
        .orderBy(desc(posts.createdAt))
        .limit(3);
      log.debug(result, 'Found latest posts');
      return result;
    },
    fetchPublishedPosts: async function () {
      const result = await db
        .select()
        .from(posts)
        .where(eq(posts.published, true))
        .orderBy(desc(posts.createdAt));
      log.debug(result, 'Found published posts');
      return result;
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
    findPublishedBySlug: async function (slug) {
      const [post] = await db
        .select()
        .from(posts)
        .where(eq(posts.slug, slug), eq(posts.published, true))
        .limit(1);
      log.debug(post, `Found post by slug ${slug}`);
      return post;
    },
    findPublishedPostsByTag: async function (tag) {
      const results = await db
        .select()
        .from(posts)
        .where(
          and(
            eq(posts.published, true),
            sql`' ' || ${posts.tags} || ' ' LIKE ${'% ' + tag + ' %'}`,
          ),
        )
        .orderBy(desc(posts.createdAt));
      log.debug(results, 'Found tagged posts');
      return results;
    },
    query: async function (qry) {
      const searchTerm = `%${qry}%`;
      log.debug(qry, 'Querying posts');
      const results = await db
        .select()
        .from(posts)
        .where(
          and(
            eq(posts.published, true),
            or(
              like(posts.title, searchTerm),
              like(posts.description, searchTerm),
              like(posts.content, searchTerm),
            ),
          ),
        );
      return results;
    },
  };
}
