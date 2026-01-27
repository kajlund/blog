import { createId } from '@paralleldrive/cuid2';
import {
  boolean,
  pgTable,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

const timestamps = {
  createdAt: timestamp('createdAt', { withTimezone: true, mode: 'string' })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updatedAt', { withTimezone: true, mode: 'string' })
    .notNull()
    .defaultNow(),
};

export const posts = pgTable('posts', {
  id: varchar()
    .primaryKey()
    .$defaultFn(() => createId()),
  author: varchar({ length: 50 }).notNull().default(''),
  title: varchar({ length: 255 }).notNull().default(),
  slug: text().notNull().unique(),
  description: text().notNull().default(''),
  content: text().notNull().default(''),
  imageUrl: varchar({ length: 255 }).notNull().default(''),
  tags: text().notNull().default(''),
  published: boolean().notNull().default(false),
  featured: boolean().notNull().default(false),
  ...timestamps,
});
