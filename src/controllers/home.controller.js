import { asyncHandler } from '../utils/async-handler.js';
import { getPostService } from '../services/post.services.js';

// eslint-disable-next-line no-unused-vars
export function getHomeController(cnf, log) {
  const svcPosts = getPostService(cnf, log);
  return {
    showHomeView: asyncHandler(async (req, res) => {
      const posts = svcPosts.fetchLatestPosts();
      res.render('home', {
        title: 'Home',
        page: 'home',
        posts,
      });
    }),
  };
}
