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
      next: { revalidate: 60 }, // Cache de 1 minuto para agilizar
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
    `posts?_embed&page=${page}&per_page=${perPage}`,
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
    const response = await fetch(url, { next: { revalidate: 60 } });
    if (!response.ok) return [];
    const r = await response.json();
    console.log({ menu: r });
    return r;
  } catch (error) {
    console.error(`Error fetching menu ${slug}:`, error);
    return [];
  }
}
