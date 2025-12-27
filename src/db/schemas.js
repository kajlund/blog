import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';

export const posts = sqliteTable('posts', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  author: text().notNull().default(''),
  title: text().notNull().default(''),
  slug: text().notNull().unique(),
  description: text().notNull().default(''),
  content: text().notNull().default(''),
  imageUrl: text().notNull().default(''),
  tags: text().notNull().default(''),
  published: integer('published', { mode: 'boolean' }).default(false),
  createdAt: text('createdAt')
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text('updatedAt')
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
});
