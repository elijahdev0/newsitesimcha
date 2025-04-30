import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  type?: 'website' | 'article';
  image?: string;
  publishedAt?: string;
  updatedAt?: string;
  author?: string;
  schema?: Record<string, any>;
}

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Bald Eagle Tactical",
  "url": "https://baldeagletactical.com"
};

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  canonical,
  type = 'website',
  image = 'https://i.imgur.com/0jZnTpQ.png', // Default to your logo
  publishedAt,
  updatedAt,
  author = 'Bald Eagle Tactical',
  schema
}) => {
  const siteUrl = 'https://baldeagletactical.com'; // Replace with your actual domain
  const fullTitle = `${title} | Bald Eagle Tactical`;
  const url = canonical || (typeof window !== 'undefined' ? window.location.href : '');
  const fullImageUrl = image.startsWith('http') ? image : `${siteUrl}${image}`;
  
  // Generate article schema if type is article
  const articleSchema = type === 'article' ? {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "image": fullImageUrl,
    "author": {
      "@type": "Organization",
      "name": author
    },
    "publisher": {
      "@type": "Organization",
      "name": "Bald Eagle Tactical",
      "logo": {
        "@type": "ImageObject",
        "url": "https://i.imgur.com/0jZnTpQ.png"
      }
    },
    "datePublished": publishedAt,
    "dateModified": updatedAt || publishedAt
  } : null;

  const schemaData = schema || (type === 'article' ? articleSchema : websiteSchema);

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* Open Graph Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:site_name" content="Bald Eagle Tactical" />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />

      {/* Article-specific Meta Tags */}
      {type === 'article' && publishedAt && (
        <>
          <meta property="article:published_time" content={publishedAt} />
          {updatedAt && <meta property="article:modified_time" content={updatedAt} />}
          <meta property="article:author" content={author} />
          <meta property="article:section" content="Military Training" />
          <meta property="article:tag" content="tactical training" />
          <meta property="article:tag" content="military training" />
          <meta property="article:tag" content="elite training" />
        </>
      )}

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>
    </Helmet>
  );
}; 