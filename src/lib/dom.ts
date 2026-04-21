import { fetchAPIWithHeaders } from "./wordpress";

export interface DOMEdition {
  id: number;
  slug: string;
  title: { rendered: string };
  date_dom: string;
  file_url: string;
}

export interface DOMPage {
  editions: DOMEdition[];
  totalPages: number;
  total: number;
}

export async function getDOMEditions(options?: {
  search?: string;
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
  page?: number;
  perPage?: number;
}): Promise<DOMPage> {
  try {
    const {
      search,
      startDate,
      endDate,
      page = 1,
      perPage = 24,
    } = options ?? {};

    const params = new URLSearchParams({
      per_page: String(perPage),
      page: String(page),
      orderby: "date",
      order: "desc",
    });

    if (search) params.set("search", search);
    // A REST API do WP aceita before/after em ISO 8601
    if (startDate) params.set("after", `${startDate}T00:00:00`);
    if (endDate) params.set("before", `${endDate}T23:59:59`);

    const { data, headers } = await fetchAPIWithHeaders(
      `dom?${params.toString()}`,
    );

    return {
      editions: Array.isArray(data) ? data : [],
      totalPages: Number(headers.get("X-WP-TotalPages") || 1),
      total: Number(headers.get("X-WP-Total") || 0),
    };
  } catch (error) {
    console.error("Error fetching DOM editions:", error);
    return { editions: [], totalPages: 0, total: 0 };
  }
}

export async function getDOMBySlug(slug: string): Promise<DOMEdition | null> {
  try {
    const { data } = await fetchAPIWithHeaders(`dom?slug=${slug}`);
    return data[0] || null;
  } catch (error) {
    console.error("Error fetching DOM by slug:", error);
    return null;
  }
}
