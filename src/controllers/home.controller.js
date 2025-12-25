import { asyncHandler } from '../utils/async-handler.js';
import { getPostService } from '../services/post.services.js';

export function getHomeController(cnf, log) {
  const svcPosts = getPostService(cnf, log);
  return {
    showHomeView: asyncHandler(async (req, res) => {
      const posts = await svcPosts.fetchLatestPosts();
      res.render('home', {
        title: 'Home',
        page: 'home',
        posts,
      });
    }),
  };
}
