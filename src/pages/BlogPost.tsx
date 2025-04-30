import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { supabase } from '../lib/supabase';
import { Post } from '../types';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { SEO } from '../components/common/SEO';

// Create a proper URL slug from a title
const createUrlSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove non-word chars
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .replace(/-+/g, '-');     // Replace multiple hyphens with single hyphen
};

// Extract keywords from content for meta tags
const extractKeywords = (content: string): string[] => {
  // Remove markdown syntax
  const plainText = content.replace(/[#*_~`>|]/g, '');
  
  // Get words from content, filter out common stop words, sort by frequency
  const words = plainText.toLowerCase().match(/\b[a-z]{4,}\b/g) || [];
  const stopWords = ['this', 'that', 'these', 'those', 'with', 'from', 'have', 'your', 'what', 'when', 'where', 'which'];
  
  const wordCount: Record<string, number> = {};
  words.forEach(word => {
    if (!stopWords.includes(word)) {
      wordCount[word] = (wordCount[word] || 0) + 1;
    }
  });
  
  // Return top 5 keywords
  return Object.entries(wordCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word]) => word);
};

// Extract a short description from content for meta description
const createMetaDescription = (content: string): string => {
  // Remove markdown syntax
  const plainText = content.replace(/[#*_~`>|]/g, '').replace(/\n+/g, ' ').trim();
  
  // Return first 160 characters as meta description
  return plainText.substring(0, 155) + '...';
};

const BlogPost: React.FC = () => {
  const { postId, slug } = useParams<{ postId: string; slug?: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) {
        navigate('/blog');
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('posts')
          .select('id, title, content, created_at')
          .eq('id', postId)
          .single();

        if (error) {
          throw error;
        }

        if (!data) {
          navigate('/blog');
          return;
        }

        setPost(data as Post);
        
        // Handle URL canonicalization for SEO - redirect to the correct URL if slug is wrong
        if (data) {
          const correctSlug = createUrlSlug(data.title);
          if (slug !== correctSlug) {
            navigate(`/blog/${postId}/${correctSlug}`, { replace: true });
          }
        }
      } catch (error) {
        console.error('Error fetching post:', error);
        setError('Failed to load the blog post. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId, slug, navigate]);

  if (loading) {
    return (
      <>
        <Header variant="dark-text" />
        <main className="min-h-screen bg-tactical-50 pt-32 pb-16">
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-tactical-700"></div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !post) {
    return (
      <>
        <SEO 
          title="Post Not Found"
          description="We couldn't find the blog post you're looking for."
        />
        <Header variant="dark-text" />
        <main className="min-h-screen bg-tactical-50 pt-32 pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto py-10">
              <div className="text-center text-red-500">
                {error || 'Blog post not found.'}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Extract meta description and keywords from post content
  const metaDescription = createMetaDescription(post.content);
  const keywords = extractKeywords(post.content);
  const canonicalUrl = `https://baldeagletactical.com/blog/${post.id}/${createUrlSlug(post.title)}`;

  // Generate article schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": canonicalUrl
    },
    "headline": post.title,
    "description": metaDescription,
    "image": "https://i.imgur.com/0jZnTpQ.png", // Default to logo, update if you have post images
    "author": {
      "@type": "Organization",
      "name": "Bald Eagle Tactical"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Bald Eagle Tactical",
      "logo": {
        "@type": "ImageObject",
        "url": "https://i.imgur.com/0jZnTpQ.png"
      }
    },
    "datePublished": post.created_at,
    "dateModified": post.created_at,
    "keywords": keywords.join(", ")
  };

  return (
    <>
      <SEO 
        title={post.title}
        description={metaDescription}
        canonical={canonicalUrl}
        type="article"
        publishedAt={post.created_at}
        schema={articleSchema}
      />
      <Header variant="dark-text" />
      <main className="min-h-screen bg-tactical-50 pt-32 pb-16">
        <article className="max-w-3xl mx-auto px-4 py-8 bg-white shadow-md rounded-lg prose lg:prose-lg">
          <header className="mb-8 pb-4 border-b border-gray-200 not-prose">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-tactical-900">{post.title}</h1>
            <p className="text-sm text-gray-500">
              Published on {format(new Date(post.created_at), 'MMMM d, yyyy')}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {keywords.map(keyword => (
                <span key={keyword} className="text-xs bg-tactical-100 text-tactical-700 px-2 py-1 rounded-full">
                  {keyword}
                </span>
              ))}
            </div>
          </header>
          
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </article>
      </main>
      <Footer />
    </>
  );
};

export default BlogPost; 