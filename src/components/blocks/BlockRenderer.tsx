import parse, { domToReact, HTMLReactParserOptions, Element } from "html-react-parser";
import { cn } from "@/lib/utils";

interface BlockRendererProps {
  content: string;
}

export function BlockRenderer({ content }: BlockRendererProps) {
  const options: HTMLReactParserOptions = {
    replace: (domNode) => {
      if (domNode instanceof Element) {
        // Handle Headings
        if (/^h[1-6]$/.test(domNode.name)) {
          const Tag = domNode.name as keyof JSX.IntrinsicElements;
          const levelClasses: Record<string, string> = {
            h1: "text-4xl md:text-5xl font-bold mb-6 mt-10 text-pmc-dark",
            h2: "text-3xl md:text-4xl font-bold mb-5 mt-8 text-pmc-dark border-b-2 border-pmc-primary inline-block pb-1",
            h3: "text-2xl md:text-3xl font-bold mb-4 mt-6 text-pmc-dark",
            h4: "text-xl md:text-2xl font-bold mb-4 mt-4 text-pmc-dark",
          };
          
          return (
            <Tag className={cn(levelClasses[domNode.name] || "font-bold mb-4")}>
              {domToReact(domNode.children as any[], options)}
            </Tag>
          );
        }

        // Handle Paragraphs
        if (domNode.name === "p") {
          return (
            <p className="text-lg leading-relaxed text-gray-700 mb-6 last:mb-0">
              {domToReact(domNode.children as any[], options)}
            </p>
          );
        }

        // Handle Lists
        if (domNode.name === "ul") {
          return (
            <ul className="list-disc list-inside space-y-2 mb-6 text-gray-700 marker:text-pmc-primary">
              {domToReact(domNode.children as any[], options)}
            </ul>
          );
        }

        if (domNode.name === "ol") {
          return (
            <ol className="list-decimal list-inside space-y-2 mb-6 text-gray-700 marker:text-pmc-primary marker:font-bold">
              {domToReact(domNode.children as any[], options)}
            </ol>
          );
        }

        // Handle Images from WordPress
        if (domNode.name === "img") {
          const { src, alt, className } = domNode.attribs;
          return (
            <span className="block my-10 overflow-hidden rounded-2xl shadow-xl transition-all hover:scale-[1.01]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={src} 
                alt={alt || ""} 
                className={cn("w-full h-auto object-cover", className)} 
                loading="lazy"
              />
            </span>
          );
        }

        // Handle Figures (standard Gutenberg wrapper for images/embeds)
        if (domNode.name === "figure") {
          return (
            <figure className="my-10">
              {domToReact(domNode.children as any[], options)}
              {domNode.attribs.class?.includes('wp-block-image') === false && (
                <figcaption className="text-center text-sm text-gray-500 mt-3 italic">
                  {domNode.attribs.title || ""}
                </figcaption>
              )}
            </figure>
          );
        }
      }
    },
  };

  return (
    <div className="gutenberg-content pb-20">
      {parse(content, options)}
    </div>
  );
}
