import { getCollection, type CollectionEntry } from 'astro:content';
import { SITE } from '../site.config';

export type Mod = CollectionEntry<'mods'>;
export type ModPage = CollectionEntry<'pages'>;

export type Version = {
  version: string;
  name?: string;
  date?: Date;
  mc?: string;
  type: 'release' | 'beta' | 'alpha';
  url?: string;
  pageUrl?: string;
  changelog?: string;
  downloads?: number;
  fileName?: string;
  size?: number;
};

export type Status = 'release' | 'beta' | 'alpha' | 'wip';

export type ModInfo = {
  mod: Mod;
  slug: string;
  status: Status;
  reactions?: number; // реакции в GitHub Discussions (giscus)
  comments?: number;
  versions: Version[];
  latest?: Version;
  downloads?: number;
  updated?: Date;
  pages: ModPage[];
};

// ---------- GitHub Releases (во время сборки) ----------
const cache = new Map<string, Promise<Version[] | null>>();

async function fetchReleases(repo: string): Promise<Version[] | null> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'mods-site-builder',
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 8000);
    const res = await fetch(`https://api.github.com/repos/${repo}/releases?per_page=50`, {
      headers,
      signal: ctrl.signal,
    });
    clearTimeout(t);
    if (!res.ok) {
      console.warn(`[mods] GitHub ${repo}: HTTP ${res.status} — беру версии из Markdown`);
      return null;
    }
    const data: any[] = await res.json();
    return data
      .filter((r) => !r.draft)
      .map((r) => {
        const jar = (r.assets || []).find((a: any) => /\.jar$/i.test(a.name)) || r.assets?.[0];
        const tag: string = r.tag_name || '';
        const low = (tag + ' ' + (r.name || '')).toLowerCase();
        const type: Version['type'] = low.includes('alpha') ? 'alpha' : r.prerelease || low.includes('beta') ? 'beta' : 'release';
        return {
          version: tag.replace(/^v/i, ''),
          name: r.name || tag,
          date: r.published_at ? new Date(r.published_at) : undefined,
          type,
          url: jar?.browser_download_url || r.html_url,
          pageUrl: r.html_url,
          changelog: r.body || undefined,
          downloads: (r.assets || []).reduce((s: number, a: any) => s + (a.download_count || 0), 0),
          fileName: jar?.name,
          size: jar?.size,
        } satisfies Version;
      });
  } catch (e) {
    console.warn(`[mods] GitHub ${repo}: ${(e as Error).message} — беру версии из Markdown`);
    return null;
  }
}

function releasesFor(repo: string) {
  if (!cache.has(repo)) cache.set(repo, fetchReleases(repo));
  return cache.get(repo)!;
}

// ---------- Реакции giscus (GitHub Discussions) ----------
type Feedback = { reactions: number; comments: number };
let feedback: Promise<Map<string, Feedback> | null> | undefined;

export function giscusEnabled() {
  return Boolean(SITE.repo && SITE.giscus.repoId && SITE.giscus.categoryId);
}

async function fetchFeedback(): Promise<Map<string, Feedback> | null> {
  const token = process.env.GITHUB_TOKEN;
  if (!giscusEnabled() || !token) return null;
  const [owner, name] = SITE.repo.split('/');
  const query = `query($owner:String!,$name:String!,$cat:ID!){repository(owner:$owner,name:$name){discussions(first:100,categoryId:$cat){nodes{title comments{totalCount} reactionGroups{reactors{totalCount}}}}}}`;
  try {
    const res = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', 'User-Agent': 'mods-site-builder' },
      body: JSON.stringify({ query, variables: { owner, name, cat: SITE.giscus.categoryId } }),
    });
    const json: any = await res.json();
    const nodes: any[] = json?.data?.repository?.discussions?.nodes;
    if (!nodes) {
      console.warn('[mods] giscus: не удалось получить реакции', JSON.stringify(json?.errors ?? res.status));
      return null;
    }
    const map = new Map<string, Feedback>();
    for (const n of nodes) {
      map.set(String(n.title).trim(), {
        reactions: (n.reactionGroups || []).reduce((s: number, g: any) => s + (g.reactors?.totalCount || 0), 0),
        comments: n.comments?.totalCount || 0,
      });
    }
    return map;
  } catch (e) {
    console.warn('[mods] giscus:', (e as Error).message);
    return null;
  }
}

export function giscusTerm(slug: string) {
  return slug; // заголовок обсуждения мода в GitHub Discussions
}

// ---------- Сборка данных ----------
let all: Promise<ModInfo[]> | undefined;

export function getMods(): Promise<ModInfo[]> {
  if (!all) all = load();
  return all;
}

async function load(): Promise<ModInfo[]> {
  const mods = (await getCollection('mods')).filter((m) => !m.data.draft);
  const pages = (await getCollection('pages')).filter((p) => !p.data.draft);

  if (!feedback) feedback = fetchFeedback();
  const fb = await feedback;

  const infos = await Promise.all(
    mods.map(async (mod): Promise<ModInfo> => {
      const slug = mod.id;
      const fromGh = mod.data.repo ? await releasesFor(mod.data.repo) : null;
      const versions: Version[] =
        fromGh && fromGh.length
          ? fromGh
          : mod.data.versions.map((v) => ({ ...v, mc: v.mc ?? mod.data.mcVersions[0] }));
      versions.sort((a, b) => (b.date?.getTime() ?? 0) - (a.date?.getTime() ?? 0));
      const latest = versions.find((v) => v.type === 'release' && v.url) || versions.find((v) => v.url) || versions[0];
      const dl = fromGh ? versions.reduce((s, v) => s + (v.downloads || 0), 0) : undefined;
      const modPages = pages
        .filter((p) => p.id.startsWith(slug + '/'))
        .sort((a, b) => a.data.order - b.data.order || a.data.title.localeCompare(b.data.title));
      const status: Status = mod.data.status ?? (versions[0]?.type as Status | undefined) ?? 'wip';
      const f = fb ? fb.get(giscusTerm(slug)) ?? { reactions: 0, comments: 0 } : undefined;
      return {
        mod,
        slug,
        status,
        reactions: f?.reactions,
        comments: f?.comments,
        versions,
        latest,
        downloads: dl,
        updated: mod.data.updated ?? versions[0]?.date,
        pages: modPages,
      };
    }),
  );
  return infos.sort((a, b) => a.mod.data.order - b.mod.data.order || a.mod.data.name.localeCompare(b.mod.data.name));
}

export function pageSlug(p: ModPage) {
  return p.id.split('/').slice(1).join('/');
}

export async function resolveDeps(list: string[]) {
  const mods = await getMods();
  return list.map((name) => {
    const found = mods.find((m) => m.slug === name || m.mod.data.modid === name);
    return found ? { name: found.mod.data.name, info: found } : { name, info: undefined };
  });
}
