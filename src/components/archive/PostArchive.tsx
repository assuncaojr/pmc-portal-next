import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Badge } from "@/components/ui/Badge";
import { PostCard } from "@/components/ui/PostCard";
import { Pagination } from "@/components/ui/Pagination";
import {
  getAllPosts,
  getTagBySlug,
  getPostsByTag,
  WordPressPost,
  WordPressPage,
} from "@/lib/wordpress";
import { Tag, X } from "lucide-react";
import Link from "next/link";

interface PostArchiveProps {
  /** Slug base desta listagem, sem barra (ex: "noticias") */
  basePath: string;
  /** Título principal do arquivo */
  title: string;
  /** Subtítulo na listagem geral, sem filtro ativo */
  description?: string;
  /** searchParams já resolvidos pelo Server Component pai */
  searchParams?: { tag?: string; page?: string };
  /**
   * Função customizada de busca de posts.
   * Deve retornar WordPressPage com posts, totalPages e total.
   * Se omitida, usa getAllPosts().
   */
  fetchPosts?: (page: number, perPage: number) => Promise<WordPressPage>;
  fetchPostsByTag?: (tagId: number, page: number, perPage: number) => Promise<WordPressPage>;
}

const PER_PAGE = 12;

export async function PostArchive({
  basePath,
  title,
  description,
  searchParams,
  fetchPosts = getAllPosts,
  fetchPostsByTag = getPostsByTag,
}: PostArchiveProps) {
  const tagSlug = searchParams?.tag;
  const currentPage = Math.max(1, Number(searchParams?.page || 1));

  let result: WordPressPage;
  let activeTag = null;

  if (tagSlug) {
    activeTag = await getTagBySlug(tagSlug);
    result = activeTag
      ? await fetchPostsByTag(activeTag.id, currentPage, PER_PAGE)
      : { posts: [], totalPages: 0, total: 0 };
  } else {
    result = await fetchPosts(currentPage, PER_PAGE);
  }

  const { posts, totalPages, total } = result;

  return (
    <Container>
      {/* Cabeçalho */}
      <div className="mb-10 text-left">
        <Heading level={1} variant="page" className="mb-4">
          {title}
        </Heading>

        {activeTag ? (
          <div className="flex flex-wrap items-center gap-3 mt-2">
            <p className="text-gray-600">Exibindo notícias com a tag:</p>
            <Badge
              variant="primary"
              className="text-sm px-3 py-1 gap-1.5 flex items-center"
            >
              <Tag className="w-3.5 h-3.5" />
              {activeTag.name}
              <Link
                href={`/${basePath}`}
                className="ml-1 hover:opacity-70 transition-opacity"
                aria-label="Remover filtro de tag"
              >
                <X className="w-3.5 h-3.5" />
              </Link>
            </Badge>
            <span className="text-gray-400 text-sm">
              ({total} {total === 1 ? "resultado" : "resultados"})
            </span>
          </div>
        ) : (
          description && (
            <p className="text-gray-600 max-w-2xl">{description}</p>
          )
        )}
      </div>

      {/* Grid */}
      {posts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {posts.map((post: WordPressPost) => (
              <PostCard
                key={post.id}
                title={post.title.rendered}
                slug={post.slug}
                date={post.date}
                image={post._embedded?.["wp:featuredmedia"]?.[0]?.source_url}
              />
            ))}
          </div>
          <Pagination currentPage={currentPage} totalPages={totalPages} />
        </>
      ) : (
        /* Estado vazio */
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
          <Tag className="w-10 h-10 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-medium mb-4">
            {activeTag
              ? `Nenhuma publicação encontrada com a tag "${activeTag.name}".`
              : "Nenhuma publicação encontrada no momento."}
          </p>
          {activeTag && (
            <Link
              href={`/${basePath}`}
              className="inline-block text-pmc-primary font-bold hover:underline"
            >
              Ver todas as publicações
            </Link>
          )}
        </div>
      )}
    </Container>
  );
}
