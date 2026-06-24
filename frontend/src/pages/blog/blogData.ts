import { marked } from "marked";

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  author: {
    name: string;
    role: string;
    avatarInitials: string;
  };
  category: string;
  imageUrl: string;
}

// ─── Simple frontmatter parser (browser-safe, no Node.js deps) ───────────────
function parseFrontmatter(raw: string): { data: Record<string, string>; body: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { data: {}, body: raw };

  const data: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    const value = line.slice(colonIdx + 1).trim().replace(/^["']|["']$/g, "");
    data[key] = value;
  }
  // Parse nested author fields
  const authorMatch = match[1].match(/author:\r?\n((?:\s{2}.+\r?\n?)+)/);
  if (authorMatch) {
    for (const line of authorMatch[1].split(/\r?\n/)) {
      const m = line.match(/^\s{2}(\w+):\s*(.+)$/);
      if (m) data[`author.${m[1]}`] = m[2].replace(/^["']|["']$/g, "");
    }
  }

  return { data, body: match[2] };
}

function estimateReadTime(text: string): string {
  const words = text.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

// ─── Load all .md files via Vite glob (raw strings) ──────────────────────────
const rawModules = import.meta.glob("./articles/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

// ─── Parse each file into a BlogPost ─────────────────────────────────────────
function parsePost(pathKey: string, rawContent: string): BlogPost {
  const { data, body } = parseFrontmatter(rawContent);
  const slug =
    data["slug"] ||
    pathKey.replace("./articles/", "").replace(".md", "");

  const html = marked(body) as string;

  return {
    slug,
    title: data["title"] || slug.replace(/-/g, " "),
    excerpt:
      data["description"] ||
      body.replace(/#{1,6}\s+.*/g, "").replace(/[*_`[\]]/g, "").slice(0, 200).trim() + "…",
    content: html,
    date: data["date"] || new Date().toISOString().split("T")[0],
    readTime: data["readTime"] || estimateReadTime(body),
    author: {
      name: data["author.name"] || "James Whitfield",
      role: data["author.role"] || "STR Compliance Specialist",
      avatarInitials: data["author.avatarInitials"] || "JW",
    },
    category: data["category"] || "Compliance",
    imageUrl:
      data["imageUrl"] ||
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80",
  };
}

// ─── Export sorted posts (newest first) ──────────────────────────────────────
export const blogPosts: BlogPost[] = Object.entries(rawModules)
  .map(([path, raw]) => parsePost(path, raw))
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}
