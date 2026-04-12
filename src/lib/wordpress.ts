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
    "wp:term"?: Array<Array<{
      id: number;
      name: string;
      slug: string;
      taxonomy: string;
    }>>;
  };
}

const WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL;

export async function fetchAPI(query: string): Promise<any> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };

  if (!WORDPRESS_URL) {
    console.error('[WordPress API] ERROR: NEXT_PUBLIC_WORDPRESS_URL is not defined!');
  }

  if (process.env.WORDPRESS_AUTH_REFRESH_TOKEN) {
    headers['Authorization'] = `Bearer ${process.env.WORDPRESS_AUTH_REFRESH_TOKEN}`;
  }

  const endpoint = `${WORDPRESS_URL}/wp-json/wp/v2/${query}`;
  console.log(`[WordPress API] Fetching: ${endpoint}`);

  try {
    const res = await fetch(endpoint, {
      method: 'GET',
      headers,
      next: { revalidate: 60 } // Cache de 1 minuto para agilizar
    });

    const json = await res.json();
    if (json.errors || json.message) {
      console.error('[WordPress API] Response Error:', json);
      return [];
    }
    return json;
  } catch (error: any) {
    console.error(`[WordPress API] Fetch Failure for ${endpoint}:`, error.message);
    throw error;
  }
}

export async function getPostBySlug(slug: string): Promise<WordPressPost | null> {
  const data = await fetchAPI(`posts?slug=${slug}&_embed`);
  return data[0] || null;
}

export async function getAllPosts(): Promise<WordPressPost[]> {
  const data = await fetchAPI('posts?_embed');
  return data;
}
