import { Helmet } from 'react-helmet-async';
import defaultSocialImage from '../assets/group-photo.jpg';

type BreadcrumbItem = {
  name: string;
  path: string;
};

type SeoSchema = Record<string, unknown>;

type SeoProps = {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: 'website' | 'article';
  noindex?: boolean;
  keywords?: string[];
  breadcrumbs?: BreadcrumbItem[];
  schema?: SeoSchema | SeoSchema[];
};

export const siteConfig = {
  brandName: 'Vocal U',
  siteName: 'Vocal U A Cappella',
  siteUrl: 'https://vocalu.org',
  defaultDescription:
    'Vocal U is a gender-inclusive a cappella group at the University of Minnesota performing throughout Minneapolis and the Twin Cities.',
  defaultKeywords: [
    'Vocal U',
    'Vocal U A Cappella',
    'University of Minnesota a cappella',
    'UMN a cappella',
    'Minnesota a cappella',
    'Minneapolis a cappella',
    'Twin Cities a cappella',
  ],
  twitterHandle: '@vocal_u',
};

export function toAbsoluteUrl(path: string) {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return new URL(path.startsWith('/') ? path : `/${path}`, siteConfig.siteUrl).toString();
}

function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
  if (items.length === 0) {
    return null;
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: toAbsoluteUrl(item.path),
    })),
  };
}

export function Seo({
  title,
  description,
  path = '/',
  image,
  type = 'website',
  noindex = false,
  keywords = [],
  breadcrumbs = [],
  schema,
}: SeoProps) {
  const pageTitle =
    title.includes(siteConfig.siteName) || title.includes(siteConfig.brandName)
      ? title
      : `${title} | ${siteConfig.siteName}`;
  const canonicalUrl = toAbsoluteUrl(path);
  const socialImage = toAbsoluteUrl(image || defaultSocialImage);
  const robotsContent = noindex
    ? 'noindex, nofollow'
    : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
  const metaKeywords = Array.from(new Set([...siteConfig.defaultKeywords, ...keywords])).join(', ');
  const schemas = [
    ...(Array.isArray(schema) ? schema : schema ? [schema] : []),
    ...(breadcrumbs.length > 0 ? [buildBreadcrumbSchema(breadcrumbs)] : []),
  ].filter(Boolean) as SeoSchema[];

  return (
    <Helmet prioritizeSeoTags>
      <title>{pageTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={metaKeywords} />
      <meta name="author" content={siteConfig.siteName} />
      <meta name="robots" content={robotsContent} />
      <meta name="theme-color" content="#8FA8C8" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:site_name" content={siteConfig.siteName} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={socialImage} />
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:site" content={siteConfig.twitterHandle} />
      <meta property="twitter:title" content={pageTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={socialImage} />
      <link rel="canonical" href={canonicalUrl} />
      {schemas.map((entry, index) => (
        <script key={`${canonicalUrl}-schema-${index}`} type="application/ld+json">
          {JSON.stringify(entry)}
        </script>
      ))}
    </Helmet>
  );
}
