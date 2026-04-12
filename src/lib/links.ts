import { fetchAPI } from "./wordpress";

export interface PMCLink {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
  link_url: string;
  link_start_date: string;
  link_end_date: string;
  link_is_popup: string;
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url: string;
    }>;
  };
}

export async function getActivePopups(): Promise<PMCLink[]> {
  try {
    const links: PMCLink[] = await fetchAPI('links?_embed');
    const now = new Date();

    return links.filter(link => {
      if (link.link_is_popup !== '1') return false;

      const start = link.link_start_date ? new Date(link.link_start_date) : null;
      const end = link.link_end_date ? new Date(link.link_end_date) : null;

      // Se não houver data, considera ativo
      const isStarted = !start || now >= start;
      const isNotEnded = !end || now <= end;

      return isStarted && isNotEnded;
    });
  } catch (error) {
    console.error("Error fetching popups:", error);
    return [];
  }
}
