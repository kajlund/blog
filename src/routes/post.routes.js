import { getPostController } from '../controllers/post.controller.js';

export function getPostRoutes(cnf, log) {
  const ctrl = getPostController(cnf, log);

  return {
    group: {
      prefix: '/posts',
      middleware: [],
    },
    routes: [
      {
        method: 'get',
        path: '/',
        middleware: [],
        handler: ctrl.showPosts,
      },
      {
        method: 'get',
        path: '/new',
        middleware: [],
        handler: ctrl.showAddPostView,
      },
      {
        method: 'get',
        path: '/:slug',
        middleware: [],
        handler: ctrl.showPostDetailsView,
      },
      {
        method: 'get',
        path: '/:id/edit',
        middleware: [],
        handler: ctrl.showPostEditView,
      },
      {
        method: 'post',
        path: '/create',
        middleware: [],
        handler: ctrl.createPost,
      },
      {
        method: 'post',
        path: '/:id/update',
        middleware: [],
        handler: ctrl.updatePost,
      },
      {
        method: 'post',
        path: '/:id/delete',
        middleware: [],
        handler: ctrl.deletePost,
      },
    ],
  };
}
