import { fetchAPI } from "./wordpress";

export interface DOMEdition {
  id: number;
  slug: string;
  title: { rendered: string };
  date_dom: string;
  file_url: string;
}

// TODO: implement date range filter
export async function getDOMEditions(
  search?: string,
  // startDate?: string,
  // endDate?: string,
): Promise<DOMEdition[]> {
  try {
    let query = `dom?_embed&per_page=24`;
    if (search) query += `&search=${search}`;
    // A API do WP padrão não filtra por meta range sem filtros customizados,
    // mas o plugin DOM já tem pre_get_posts.
    // Se passarmos os params via GET, eles serão pegos no backend se mapearmos corretamente.

    return await fetchAPI(query);
  } catch (error) {
    console.error("Error fetching DOM editions:", error);
    return [];
  }
}

export async function getDOMBySlug(slug: string): Promise<DOMEdition | null> {
  try {
    const data = await fetchAPI(`dom?slug=${slug}`);
    return data[0] || null;
  } catch (error) {
    console.error("Error fetching DOM by slug:", error);
    return null;
  }
}
