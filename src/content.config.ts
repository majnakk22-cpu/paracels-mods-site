import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const link = z.object({ label: z.string(), url: z.string() });

const version = z.object({
  version: z.string(),
  date: z.coerce.date().optional(),
  mc: z.string().optional(),
  type: z.enum(['release', 'beta', 'alpha']).default('release'),
  url: z.string().optional(), // ссылка на .jar или на страницу релиза
  changelog: z.string().optional(),
});

const theme = z
  .object({
    accent: z.string().default('#f2b33d'), // главный цвет: кнопки, ссылки
    accent2: z.string().optional(), // второй цвет для узоров и градиентов
    bg: z.string().default('#111316'), // фон страницы
    surface: z.string().default('#1a1d22'), // фон карточек
    text: z.string().default('#e8e6e3'),
    muted: z.string().default('#9aa0a6'),
    border: z.string().optional(),
    onAccent: z.string().default('#111'), // цвет текста на кнопке
    font: z.string().optional(), // Google Font для текста, например "Inter"
    headingFont: z.string().optional(), // Google Font для заголовков
    pattern: z
      .enum(['none', 'grid', 'hazard', 'organic', 'scanlines', 'paper', 'static', 'veins', 'radiation'])
      .default('none'),
    banner: z.string().optional(), // картинка шапки, путь от public/
    css: z.string().optional(), // свой CSS-файл, путь от public/
  })
  .default({});

const mods = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/mods' }),
  schema: z.object({
    name: z.string(),
    summary: z.string(),
    icon: z.string().optional(), // путь от public/, например /mods/parasites/icon.svg
    status: z.enum(['release', 'beta', 'alpha', 'wip']).default('wip'),
    categories: z.array(z.string()).default([]),
    loader: z.string().default('Forge'),
    mcVersions: z.array(z.string()).default(['1.20.1']),
    modid: z.string().optional(),
    license: z.string().optional(),
    updated: z.coerce.date().optional(),
    order: z.number().default(100),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    repo: z.string().optional(), // "user/repo" — версии и скачивания подтянутся из GitHub Releases
    links: z.array(link).default([]),
    requires: z.array(z.string()).default([]), // slug других модов на сайте или просто название
    optional: z.array(z.string()).default([]),
    versions: z.array(version).default([]),
    gallery: z.array(z.object({ src: z.string(), caption: z.string().optional() })).default([]),
    theme,
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: '*/*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    order: z.number().default(100),
    description: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { mods, pages };
