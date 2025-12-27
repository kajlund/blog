import { marked } from 'marked';

import { getPostsDAO } from '../db/posts.dao.js';

function generateTagList(posts) {
  // Create a unique set of tags
  const tagSet = new Set();
  posts.forEach((p) => {
    if (p.tags) {
      p.tags.split(' ').forEach((t) => tagSet.add(t));
    }
  });
  return Array.from(tagSet).sort();
}

export function getBlogService(cnf, log) {
  const dao = getPostsDAO(log);

  return {
    fetchLatestPosts: async () => {
      const posts = await dao.fetchLatestPosts();
      return posts;
    },
    generateSiteMap: async () => {
      const posts = await dao.fetchPublishedPosts();
      let xml = `<?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
          <url><loc>https://kajlund.com/blog</loc></url>`;
      posts.forEach((post) => {
        xml += `
          <url>
            <loc>https://kajlund.com/blog/${post.slug}</loc>
            <lastmod>${post.updatedAt.split(' ')[0]}</lastmod>
          </url>`;
      });
      xml += '</urlset>';
      return xml;
    },
    getAllTags: async () => {
      const posts = await dao.fetchPublishedPosts();
      const tags = generateTagList(posts);
      return tags;
    },
    getAnyPostBySlug: async (slug) => {
      const post = await dao.findBySlug(slug);
      const content = marked.parse(post.content);
      return {
        post,
        content,
      };
    },
    getPublishedPostBySlug: async (slug) => {
      const post = await dao.findPublishedBySlug(slug);
      log.info(post);
      if (!post) return null;
      const content = marked.parse(post.content);
      return {
        post,
        content,
      };
    },
    getPublishedPostsByTag: async (tag) => {
      const posts = await dao.findPublishedPostsByTag(tag);
      return posts;
    },
    queryPosts: async (qry) => {
      const query = qry?.toLowerCase();
      const data = await dao.query(query);
      return data;
    },
  };
}
