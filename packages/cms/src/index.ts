import { Hono } from 'hono';
import type { Context } from 'hono';
import { z } from 'zod';
import { articleCreateSchema, articleSchema, idSchema } from '@into-cars/schemas';

const app = new Hono();

type Article = z.infer<typeof articleSchema>;
type CreateArticleInput = z.infer<typeof articleCreateSchema>;

const articles = new Map<string, Article>();

app.get('/', (c: Context) => c.text('CMS is running'));

app.get('/health', (c: Context) => c.json({ ok: true }));

app.get('/articles', (c: Context) => {
  return c.json(Array.from(articles.values()));
});

app.get('/articles/:id', (c: Context) => {
  const { id } = idSchema.parse(c.req.param());

  const article = articles.get(id);

  if (!article) {
    return c.json({ message: 'Article not found' }, 404);
  }

  return c.json(article);
});

app.post('/articles', async (c: Context) => {
  const body = (await c.req.json()) as unknown;
  const input: CreateArticleInput = articleCreateSchema.parse(body);
  const id = crypto.randomUUID();

  const article: Article = {
    id,
    ...input,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  articles.set(id, article);

  return c.json(article, 201);
});

app.put('/articles/:id', async (c: Context) => {
  const { id } = idSchema.parse(c.req.param());
  const existing = articles.get(id);

  if (!existing) {
    return c.json({ message: 'Article not found' }, 404);
  }

  const body = (await c.req.json()) as unknown;
  const input: CreateArticleInput = articleCreateSchema.parse(body);

  const updated: Article = {
    ...existing,
    ...input,
    id,
    updatedAt: new Date().toISOString(),
  };

  articles.set(id, updated);

  return c.json(updated);
});

app.delete('/articles/:id', (c: Context) => {
  const { id } = idSchema.parse(c.req.param());

  if (!articles.has(id)) {
    return c.json({ message: 'Article not found' }, 404);
  }

  articles.delete(id);

  return c.body(null, 204);
});

export default app;
