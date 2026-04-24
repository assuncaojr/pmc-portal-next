export interface WordPressPost {
  id: number;
  date: string;
  slug: string;
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  excerpt: {
    rendered: string;
    protected: boolean;
  };
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url: string;
    }>;
    "wp:term"?: Array<
      Array<{
        id: number;
        name: string;
        slug: string;
        taxonomy: string;
      }>
    >;
  };
}

const WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL;

export async function fetchAPI(query: string): Promise<any> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (!WORDPRESS_URL) {
    console.error(
      "[WordPress API] ERROR: NEXT_PUBLIC_WORDPRESS_URL is not defined!",
    );
  }

  if (process.env.WORDPRESS_AUTH_REFRESH_TOKEN) {
    headers[
      "Authorization"
    ] = `Bearer ${process.env.WORDPRESS_AUTH_REFRESH_TOKEN}`;
  }

  const endpoint = `${WORDPRESS_URL}/wp-json/wp/v2/${query}`;

  try {
    const res = await fetch(endpoint, {
      method: "GET",
      headers,
      cache: "force-cache",
      next: { revalidate: 60 },
    });

    const json = await res.json();
    if (json.errors || json.message) {
      console.error("[WordPress API] Response Error:", json);
      return [];
    }
    return json;
  } catch (error: any) {
    console.error(
      `[WordPress API] Fetch Failure for ${endpoint}:`,
      error.message,
    );
    throw error;
  }
}

export async function getPostBySlug(
  slug: string,
): Promise<WordPressPost | null> {
  const data = await fetchAPI(`posts?slug=${slug}&_embed`);
  return data[0] || null;
}

export interface WordPressPage {
  posts: WordPressPost[];
  totalPages: number;
  total: number;
}

export async function fetchAPIWithHeaders(
  query: string,
): Promise<{ data: any; headers: Headers }> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (!WORDPRESS_URL)
    console.error(
      "[WordPress API] ERROR: NEXT_PUBLIC_WORDPRESS_URL is not defined!",
    );
  if (process.env.WORDPRESS_AUTH_REFRESH_TOKEN) {
    headers[
      "Authorization"
    ] = `Bearer ${process.env.WORDPRESS_AUTH_REFRESH_TOKEN}`;
  }
  const endpoint = `${WORDPRESS_URL}/wp-json/wp/v2/${query}`;
  try {
    const res = await fetch(endpoint, {
      method: "GET",
      headers,
      cache: "force-cache",
      next: { revalidate: 60 },
    });
    const data = await res.json();
    if (data.errors || data.message) {
      console.error("[WordPress API] Response Error:", data);
      return { data: [], headers: res.headers };
    }
    return { data, headers: res.headers };
  } catch (error: any) {
    console.error(
      `[WordPress API] Fetch Failure for ${endpoint}:`,
      error.message,
    );
    throw error;
  }
}

export async function getAllPosts(
  page = 1,
  perPage = 12,
): Promise<WordPressPage> {
  const { data, headers } = await fetchAPIWithHeaders(
    `posts?_embed&page=${page}&per_page=${perPage}&type=post`,
  );
  return {
    posts: data,
    totalPages: Number(headers.get("X-WP-TotalPages") || 1),
    total: Number(headers.get("X-WP-Total") || 0),
  };
}

export async function searchPosts(
  query: string,
  page = 1,
  perPage = 12,
): Promise<WordPressPage> {
  const { data, headers } = await fetchAPIWithHeaders(
    `posts?search=${encodeURIComponent(
      query,
    )}&_embed&page=${page}&per_page=${perPage}`,
  );
  return {
    posts: data,
    totalPages: Number(headers.get("X-WP-TotalPages") || 1),
    total: Number(headers.get("X-WP-Total") || 0),
  };
}

export interface WordPressTag {
  id: number;
  name: string;
  slug: string;
  count: number;
}

export async function getTagBySlug(slug: string): Promise<WordPressTag | null> {
  const data = await fetchAPI(`tags?slug=${slug}`);
  return data[0] || null;
}

export async function getPostsByTag(
  tagId: number,
  page = 1,
  perPage = 12,
): Promise<WordPressPage> {
  const { data, headers } = await fetchAPIWithHeaders(
    `posts?tags=${tagId}&_embed&page=${page}&per_page=${perPage}`,
  );

  return {
    posts: data,
    totalPages: Number(headers.get("X-WP-TotalPages") || 1),
    total: Number(headers.get("X-WP-Total") || 0),
  };
}

export interface MenuItem {
  id: number;
  title: string;
  url: string;
  parent: number | string;
  target: string;
  order: number;
  children?: MenuItem[];
}

export async function getMenu(slug: string): Promise<MenuItem[]> {
  const url = `${WORDPRESS_URL}/wp-json/portal-next/v1/menu/${slug}`;
  try {
    const response = await fetch(url, {
      cache: "force-cache",
      next: { revalidate: 300 },
    });
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error(`Error fetching menu ${slug}:`, error);
    return [];
  }
}

export interface InstagramPost {
  id: string;
  type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM" | string;
  images: {
    thumbnail?: { url: string; width: number; height: number };
    standard_resolution?: { url: string; width: number; height: number };
    low_resolution?: { url: string; width: number; height: number };
  };
  media_url?: string;
  link: string;
  caption?: { text: string } | string | null;
  timestamp: string;
}

export function getInstagramImageUrl(post: InstagramPost): string {
  return (
    post.images?.standard_resolution?.url ||
    post.images?.low_resolution?.url ||
    post.images?.thumbnail?.url ||
    post.media_url ||
    "https://placehold.co/640x640/e2e8f0/475569?text=Sem+Imagem"
  );
}

export function getInstagramCaptionText(post: InstagramPost): string {
  if (!post.caption) return "";
  if (typeof post.caption === "object" && "text" in post.caption) {
    return post.caption.text ?? "";
  }
  return post.caption as string;
}

export async function getInstagramPosts(): Promise<InstagramPost[]> {
  const url = `${WORDPRESS_URL}/wp-json/portal-next/v1/instagram`;
  try {
    const response = await fetch(url, {
      cache: "force-cache",
      next: { revalidate: 3600 },
    });
    if (!response.ok) return [];
    const data = await response.json();

    for (const key in data) {
      if (key.startsWith("zoom_instagram_is_configured") && data[key]?.data) {
        return data[key].data as InstagramPost[];
      }
    }
    return [];
  } catch (error) {
    console.error("Error fetching Instagram:", error);
    return [];
  }
}

export async function getPostsByTagSlug(
  slug: string,
  page = 1,
  perPage = 12,
): Promise<WordPressPage> {
  const tag = await getTagBySlug(slug);
  if (!tag) return { posts: [], totalPages: 0, total: 0 };
  return getPostsByTag(tag.id, page, perPage);
}
