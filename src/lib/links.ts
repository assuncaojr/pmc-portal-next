import { fetchAPI } from "./wordpress";

export interface PMCLink {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
  link_url: string;
  link_start_date: string;
  link_end_date: string;
  link_is_popup: string;
  link_icon?: string;
  link_highlight?: string;
  link_section?: string;
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

export async function getActivePopups(): Promise<PMCLink[]> {
  try {
    const links = await getActiveLinks();
    return links.filter(link => link.link_is_popup === '1');
  } catch (error) {
    console.error("Error fetching popups:", error);
    return [];
  }
}

export async function getActiveLinks(): Promise<PMCLink[]> {
  try {
    // Busca até 100 links para garantir que pegamos todos os ativos cadastrados
    const links: PMCLink[] = await fetchAPI('links?_embed&per_page=100');
    const now = new Date();

    return links.filter(link => {
      const start = link.link_start_date ? new Date(link.link_start_date) : null;
      const end = link.link_end_date ? new Date(link.link_end_date) : null;

      // Se não houver data, considera ativo
      const isStarted = !start || now >= start;
      const isNotEnded = !end || now <= end;

      return isStarted && isNotEnded;
    });
  } catch (error) {
    console.error("Error fetching active links:", error);
    return [];
  }
}

export function filterLinksBySection(links: PMCLink[], section: string): PMCLink[] {
  return links.filter(link => link.link_section === section);
}
