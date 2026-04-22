import parse, { domToReact, HTMLReactParserOptions } from "html-react-parser";
import { cn } from "@/lib/utils";
import { WordPressGallery } from "@/components/ui/WordPressGallery";

interface BlockRendererProps {
  content: string;
}

export function BlockRenderer({ content }: BlockRendererProps) {
  const options: HTMLReactParserOptions = {
    replace: (domNode: any) => {
      // Check if it's a tag/element node
      if (domNode.type === "tag" || domNode.name) {
        const classes = domNode.attribs?.class || "";

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
              {domToReact(domNode.children, options)}
            </Tag>
          );
        }

        // Handle Paragraphs
        if (domNode.name === "p") {
          return (
            <p className="text-lg leading-relaxed text-gray-700 mb-6 last:mb-0">
              {domToReact(domNode.children, options)}
            </p>
          );
        }

        // Handle Lists
        const listClass =
          "list-inside space-y-2 mb-6 text-gray-700 marker:text-pmc-primary";
        if (domNode.name === "ul" && !classes.includes("blocks-gallery-grid")) {
          return (
            <ul className={cn("list-disc", listClass)}>
              {domToReact(domNode.children, options)}
            </ul>
          );
        }

        if (domNode.name === "ol") {
          return (
            <ol className={cn("list-decimal marker:font-bold", listClass)}>
              {domToReact(domNode.children, options)}
            </ol>
          );
        }

        // Handle Gallery (Generic check for classes)
        const isGallery =
          classes.includes("wp-block-gallery") ||
          classes.includes("blocks-gallery-grid");

        if (isGallery) {
          const images: any[] = [];

          const findImages = (nodes: any[]) => {
            if (!nodes) return;
            nodes.forEach((node) => {
              if (node.type === "tag" || node.name) {
                if (node.name === "img") {
                  // Search for closest anchor for full size URL
                  let fullSrc = node.attribs?.src;
                  let caption: any = undefined;

                  // Look up the tree for anchor or figure
                  let current: any = node.parent;
                  while (current) {
                    if (current.name === "a" && current.attribs?.href) {
                      fullSrc = current.attribs.href;
                    }
                    if (current.name === "figure") {
                      const figcaption = current.children?.find(
                        (c: any) => c.name === "figcaption",
                      );
                      if (figcaption) {
                        caption = domToReact(figcaption.children, options);
                      }
                      break; // Found the figure, stop looking up
                    }
                    current = current.parent;
                  }

                  images.push({
                    src: node.attribs?.src,
                    alt: node.attribs?.alt || "",
                    fullSrc,
                    caption,
                  });
                } else if (node.children) {
                  findImages(node.children);
                }
              }
            });
          };

          findImages(domNode.children);

          if (images.length > 0) {
            const columnsMatch = classes.match(/columns-(\d+)/);
            const columns = columnsMatch ? parseInt(columnsMatch[1]) : 3;
            return <WordPressGallery images={images} columns={columns} />;
          }
        }

        // Handle Images with Lightbox or regular Figure
        if (domNode.name === "figure") {
          const isLightbox = classes.includes("wp-lightbox-container");
          const isImage = classes.includes("wp-block-image");

          if (isLightbox || isImage) {
            const imgNode = domNode.children?.find((c: any) => {
              if (c.type !== "tag" && !c.name) return false;
              if (c.name === "img") return true;
              if (
                c.name === "a" &&
                c.children?.some((cc: any) => cc.name === "img")
              )
                return true;
              return false;
            });

            if (imgNode) {
              let actualImg: any;
              let fullSrc: string;

              if (imgNode.name === "a") {
                actualImg = imgNode.children.find((c: any) => c.name === "img");
                fullSrc = imgNode.attribs?.href;
              } else {
                actualImg = imgNode;
                fullSrc = imgNode.attribs?.src;
              }

              if (actualImg) {
                const figcaption = domNode.children?.find(
                  (c: any) => c.name === "figcaption",
                );

                if (isLightbox) {
                  console.log(
                    `[BlockRenderer] Rendering single lightbox image: ${actualImg.attribs?.src}`,
                  );
                  return (
                    <WordPressGallery
                      images={[
                        {
                          src: actualImg.attribs?.src,
                          alt: actualImg.attribs?.alt || "",
                          fullSrc: fullSrc || actualImg.attribs?.src,
                          caption: figcaption
                            ? domToReact(figcaption.children, options)
                            : undefined,
                        },
                      ]}
                      columns={1}
                    />
                  );
                }
              }
            }
          }

          return (
            <figure className={cn("my-10", classes)}>
              {domToReact(domNode.children, options)}
              {!classes.includes("wp-block-image") && (
                <figcaption className="text-center text-sm text-gray-500 mt-3 italic">
                  {domNode.attribs?.title || ""}
                </figcaption>
              )}
            </figure>
          );
        }

        // Handle Images from WordPress (outside figure or not lightbox)
        if (domNode.name === "img") {
          const { src, alt } = domNode.attribs || {};
          return (
            <span className="block my-10 overflow-hidden rounded-2xl shadow-xl transition-all hover:scale-[1.01]">
              {!src && <></>}
              {src && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={src}
                  alt={alt || ""}
                  className={cn(
                    "w-full h-auto object-cover",
                    domNode.attribs?.class,
                  )}
                  loading="lazy"
                />
              )}
            </span>
          );
        }
      }
    },
  };

  return (
    <div className="gutenberg-content pb-20">{parse(content, options)}</div>
  );
}
