import Link from "next/link";
import Image from "next/image";
import { shouldUnoptimizeImage } from "@/lib/utils";

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
      className={`block group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 ${className}`}
    >
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={displayImage}
          alt={title.replace(/<[^>]*>/g, "")}
          fill
          unoptimized={shouldUnoptimizeImage(displayImage)}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-4">
        <span className="inline-block self-start px-2 py-0.5 bg-blue-50 text-blue-600 text-[9px] font-black rounded mb-2 uppercase tracking-wider">
          {tag}
        </span>
        <h3 
          className="text-sm md:text-base font-black text-pmc-dark leading-snug group-hover:text-pmc-primary transition-colors line-clamp-2"
          dangerouslySetInnerHTML={{ __html: title }}
        />
      </div>
    </Link>
  );
}
