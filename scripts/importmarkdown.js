import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

import matter from 'gray-matter';

import { getConfig } from '../src/utils/config.js';
import { posts } from '../src/db/schemas.js';
import db from '../src/db/index.js';

async function rebuildDatabase() {
  const cnf = getConfig();
  const postsDir = path.normalize(cnf.importPath);
  const files = readdirSync(postsDir).filter((f) => f.endsWith('.md'));

  db.delete(posts).run();
  console.log(`Rebuilding blog from ${files.length} files...`);

  for (const file of files) {
    const filePath = path.join(postsDir, file);
    const fileContent = readFileSync(filePath, 'utf-8');
    // Parse Frontmatter and Content
    const { data, content } = matter(fileContent);

    // Ensure tags are a clean space-separated string: "tag1 tag2 tag3"
    const cleanTags = Array.isArray(data.tags)
      ? data.tags.join(' ').trim()
      : (data.tags || '').toString().trim().replace(/\s+/g, ' ');

    // Use the filename (minus .md) as the slug
    const slug = file.replace('.md', '');

    await db.insert(posts).values({
      author: data.author,
      title: data.title || 'Untitled',
      slug,
      description: data.description || '',
      content,
      tags: cleanTags,
      imageUrl: data.imageUrl,
      published: data.published == true,
      featured: data.featured === true,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }
  console.log('✅ Blog data refreshed.');
}

rebuildDatabase().catch(console.error);
