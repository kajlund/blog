import express from 'express';

import { getBlogRoutes } from './blog.routes.js';

export function getRouter(cnf, log) {
  const blogRoutes = getBlogRoutes(cnf, log);

  const groups = [blogRoutes];
  const router = express.Router();

  groups.forEach(({ group, routes }) => {
    routes.forEach(({ method, path, middleware = [], handler }) => {
      log.info(`Route: ${method} ${group.prefix}${path}`);
      router[method](
        group.prefix + path,
        [...(group.middleware || []), ...middleware],
        handler,
      );
    });
  });

  return router;
}
