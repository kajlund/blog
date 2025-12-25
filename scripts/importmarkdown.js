import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import matter from 'gray-matter';

import { posts } from '../src/db/schemas.js';
import db from '../src/db/index.js';

async function syncPosts() {
  const postsDirectory = join(process.cwd(), 'content');
  const filenames = readdirSync(postsDirectory);
  console.log(`Found ${filenames.length} files. Starting sync...`);

  try {
    let slug;
    for (const filename of filenames) {
      if (!filename.endsWith('.md')) continue;

      const filePath = join(postsDirectory, filename);
      const fileContent = readFileSync(filePath, 'utf-8');

      // Parse Frontmatter and Content
      const { data, content } = matter(fileContent);
      slug = filename.replace('.md', '');

      // Drizzle Upsert
      await db
        .insert(posts)
        .values({
          title: data.title || 'Untitled',
          slug: slug,
          description: data.description || '',
          content: content,
        })
        .onConflictDoUpdate({
          target: posts.slug,
          set: {
            title: data.title,
            description: data.description,
            content: content,
          },
        });
    }
    console.log(`✅ Synced: ${slug}`);
  } catch (err) {
    console.error(err);
    throw err;
  }
}

syncPosts().catch(console.error);
