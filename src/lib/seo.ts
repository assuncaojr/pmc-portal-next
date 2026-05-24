import type { Metadata } from 'next';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

export function generatePMCSEO({ title, description, image, url }: SEOProps): Metadata {
  const siteName = 'Prefeitura de Caxias';
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const defaultDescription = 'Portal oficial da Prefeitura de Caxias - MA. Informações, serviços e notícias para o cidadão.';

  return {
    title: fullTitle,
    description: description || defaultDescription,
    openGraph: {
      title: fullTitle,
      description: description || defaultDescription,
      url: url || '',
      siteName: siteName,
      images: image ? [{ url: image }] : [],
      locale: 'pt_BR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: description || defaultDescription,
      images: image ? [image] : [],
    },
    robots: {
      index: true,
      follow: true,
    },
    icons: {
      icon: [
        { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
        { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
        { url: '/favicon.ico', sizes: 'any' }
      ],
      apple: [
        { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
      ]
    },
    manifest: '/site.webmanifest',
  };
}
