export interface ExtractedVideo {
  type: "youtube" | "vimeo" | "native" | "iframe";
  src: string;
  id: string | null;
}

/**
 * Extrai informações de vídeo de uma string de conteúdo HTML do WordPress.
 * Suporta iframes (YouTube, Vimeo, genéricos), links brutos no texto e tags <video> nativas.
 */
export function extractVideoFromContent(content: string): ExtractedVideo | null {
  if (!content) return null;

  // 1. Procurar tag <iframe> com atributo src no HTML
  const iframeMatch = content.match(/<iframe[^>]+src="([^"]+)"/i);
  if (iframeMatch) {
    const src = iframeMatch[1];

    // Verificar se o iframe é do YouTube
    const ytMatch = src.match(
      /(?:youtube\.com|youtu\.be|youtube-nocookie\.com)\/(?:embed\/|v\/|watch\?v=)?([^"&?\/\s]{11})/i
    );
    if (ytMatch) {
      return {
        type: "youtube",
        src: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0`,
        id: ytMatch[1],
      };
    }

    // Verificar se o iframe é do Vimeo
    const vimeoMatch = src.match(
      /(?:vimeo\.com|player\.vimeo\.com\/video)\/(\d+)/i
    );
    if (vimeoMatch) {
      return {
        type: "vimeo",
        src: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`,
        id: vimeoMatch[1],
      };
    }

    // Caso seja outro iframe genérico
    return {
      type: "iframe",
      src,
      id: null,
    };
  }

  // 2. Procurar links brutos do YouTube/Vimeo no corpo do texto HTML (caso não estejam encapsulados em iframe)
  const ytLinkMatch = content.match(
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be|youtube-nocookie\.com)\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=)?([^"&?\/\s]{11})/i
  );
  if (ytLinkMatch) {
    return {
      type: "youtube",
      src: `https://www.youtube.com/embed/${ytLinkMatch[1]}?autoplay=1&rel=0`,
      id: ytLinkMatch[1],
    };
  }

  const vimeoLinkMatch = content.match(
    /(?:https?:\/\/)?(?:www\.)?(?:vimeo\.com|player\.vimeo\.com\/video)\/(\d+)/i
  );
  if (vimeoLinkMatch) {
    return {
      type: "vimeo",
      src: `https://player.vimeo.com/video/${vimeoLinkMatch[1]}?autoplay=1`,
      id: vimeoLinkMatch[1],
    };
  }

  // 3. Procurar tags <video> ou <source> nativas do HTML5
  const videoMatch = content.match(/<video[^>]+src="([^"]+)"/i);
  if (videoMatch) {
    return {
      type: "native",
      src: videoMatch[1],
      id: null,
    };
  }

  const sourceMatch = content.match(/<source[^>]+src="([^"]+)"/i);
  if (sourceMatch) {
    return {
      type: "native",
      src: sourceMatch[1],
      id: null,
    };
  }

  return null;
}
