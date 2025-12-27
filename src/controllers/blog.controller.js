import { asyncHandler } from '../utils/async-handler.js';
import { getBlogService } from '../services/blog.service.js';
import { AppError } from '../utils/errors.js';

export function getBlogController(cnf, log) {
  const svc = getBlogService(cnf, log);

  return {
    generateSiteMap: asyncHandler(async (req, res) => {
      const xml = await svc.generateSiteMap();
      res.header('Content-Type', 'application/xml');
      res.send(xml);
    }),
    previewBlogPost: asyncHandler(async (req, res) => {
      const result = await svc.getAnyPostBySlug(req.params.slug);
      if (!result) throw new AppError(404, 'Not Found');
      res.render('post', {
        title: 'Post',
        page: 'blog',
        post: result.post,
        content: result.content,
        isPreview: true,
      });
    }),
    searchPosts: asyncHandler(async (req, res) => {
      const { qry } = req.body;
      const posts = await svc.queryPosts(qry);
      log.info(posts.length);
      res.render('search', {
        title: 'Search',
        page: 'home',
        posts,
        query: qry,
      });
    }),
    showHomeView: asyncHandler(async (req, res) => {
      const tags = await svc.getAllTags();
      const posts = await svc.fetchLatestPosts();
      res.render('home', {
        title: 'Home',
        page: 'home',
        posts,
        tags,
      });
    }),
    showBlogPost: asyncHandler(async (req, res) => {
      const result = await svc.getPublishedPostBySlug(req.params.slug);
      if (!result) throw new AppError(404, 'Not Found');
      res.render('post', {
        title: 'Post',
        page: 'blog',
        post: result.post,
        content: result.content,
      });
    }),
    showTaggedPosts: asyncHandler(async (req, res) => {
      const { tag } = req.params;
      const posts = await svc.getPublishedPostsByTag(tag);
      res.render('tagged', {
        title: 'Home',
        page: 'tags',
        posts,
        tag,
      });
    }),
  };
}
