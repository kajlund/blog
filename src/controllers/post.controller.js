import { marked } from 'marked';

import { asyncHandler } from '../utils/async-handler.js';
import { getPostService } from '../services/post.services.js';
import { AppError } from '../utils/errors.js';

export function getPostController(cnf, log) {
  const svcPosts = getPostService(cnf, log);

  return {
    showPosts: asyncHandler(async (req, res) => {
      const posts = await svcPosts.fetchLatestPosts();
      res.render('home', { title: 'Home', page: 'home', posts });
    }),
    showAddPostView: asyncHandler(async (req, res) => {
      const posts = svcPosts.fetchLatestPosts();
      res.render('blog', { title: 'Blog', page: 'blog', posts });
    }),
    showPostDetailsView: asyncHandler(async (req, res) => {
      const post = await svcPosts.getPostBySlug(req.params.slug);
      if (!post) throw new AppError(404, 'Not Found');

      const htmlContent = marked.parse(post.content);
      res.render('post', { title: 'Post', page: 'blog', post, htmlContent });
    }),
    showPostEditView: asyncHandler(async (req, res) => {
      const posts = svcPosts.fetchLatestPosts();
      res.render('home', { title: 'Home', page: 'home', posts });
    }),
    createPost: asyncHandler(async (req, res) => {
      const posts = svcPosts.fetchLatestPosts();
      res.render('home', { title: 'Home', page: 'home', posts });
    }),
    updatePost: asyncHandler(async (req, res) => {
      const posts = svcPosts.fetchLatestPosts();
      res.render('home', { title: 'Home', page: 'home', posts });
    }),
    deletePost: asyncHandler(async (req, res) => {
      const posts = svcPosts.fetchLatestPosts();
      res.render('home', { title: 'Home', page: 'home', posts });
    }),
  }
}
