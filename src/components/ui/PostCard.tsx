import Link from "next/link";

interface PostCardProps {
  tag?: string;
  title: string;
  slug: string;
  date?: string;
  image?: string;
  className?: string;
}

export function PostCard({
  tag = "Notícia",
  title,
  slug,
  date,
  image,
  className,
}: PostCardProps) {
  // Gerar o link cronológico se a data estiver presente
  let newsHref = `/${slug}`;
  
  if (date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    newsHref = `/${year}/${month}/${day}/${slug}`;
  }

  // Fallback para imagem caso não exista
  const displayImage = image || "https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=1000";

  return (
    <Link
      href={newsHref}
      className={`block group relative overflow-hidden rounded-2xl aspect-square shadow-lg shadow-gray-200/50 bg-white ${className}`}
    >
      <img
        src={displayImage}
        alt={title}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-5 flex flex-col justify-end text-left">
        <span className="inline-block self-start px-2 py-0.5 bg-pmc-primary text-[9px] font-bold text-white rounded mb-3 uppercase tracking-wider">
          {tag}
        </span>
        <h3 
          className="text-sm md:text-base font-bold text-white leading-tight group-hover:text-pmc-warning transition-colors line-clamp-3"
          dangerouslySetInnerHTML={{ __html: title }}
        />
      </div>
    </Link>
  );
}
