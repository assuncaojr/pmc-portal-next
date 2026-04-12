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
  };
}

const WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL;

export async function fetchAPI(query: string): Promise<any> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };

  if (process.env.WORDPRESS_AUTH_REFRESH_TOKEN) {
    headers['Authorization'] = `Bearer ${process.env.WORDPRESS_AUTH_REFRESH_TOKEN}`;
  }

  const res = await fetch(`${WORDPRESS_URL}/wp-json/wp/v2/${query}`, {
    method: 'GET',
    headers,
  });

  const json = await res.json();
  if (json.errors) {
    console.error(json.errors);
    throw new Error('Failed to fetch API');
  }
  return json;
}

export async function getPostBySlug(slug: string): Promise<WordPressPost | null> {
  const data = await fetchAPI(`posts?slug=${slug}&_embed`);
  return data[0] || null;
}

export async function getAllPosts(): Promise<WordPressPost[]> {
  const data = await fetchAPI('posts?_embed');
  return data;
}
