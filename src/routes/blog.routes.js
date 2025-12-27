import { getBlogController } from '../controllers/blog.controller.js';

export function getBlogRoutes(cnf, log) {
  const ctrl = getBlogController(cnf, log);

  return {
    group: {
      prefix: '',
      middleware: [],
    },
    routes: [
      {
        method: 'get',
        path: '/',
        middleware: [],
        handler: ctrl.showHomeView,
      },
      {
        method: 'get',
        path: '/sitemap.xml',
        middleware: [],
        handler: ctrl.generateSiteMap,
      },
      {
        method: 'get',
        path: '/tags/:tag',
        middleware: [],
        handler: ctrl.showTaggedPosts,
      },
      {
        method: 'post',
        path: '/posts/search',
        middleware: [],
        handler: ctrl.searchPosts,
      },
      {
        method: 'get',
        path: '/posts/:slug',
        middleware: [],
        handler: ctrl.showBlogPost,
      },
      {
        method: 'get',
        path: '/preview/:slug',
        middleware: [],
        handler: ctrl.previewBlogPost,
      },
    ],
  };
}
