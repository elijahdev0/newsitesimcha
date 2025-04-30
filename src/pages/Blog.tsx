import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { supabase } from '../lib/supabase';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { SEO } from '../components/common/SEO';

// Define a simplified Post type for the blog listing that doesn't include content
interface BlogPostListing {
  id: string;
  title: string;
  created_at: string;
}

// Create a proper URL slug from a title, used for SEO
const createUrlSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove non-word chars
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .replace(/-+/g, '-');     // Replace multiple hyphens with single hyphen
};

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPostListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('posts')
          .select('id, title, created_at')
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        setPosts(data || []);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setError('Failed to load blog posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Generate blog list schema
  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Training Insights Blog",
    "url": "https://baldeagletactical.com/blog",
    "description": "Expert insights and guides on tactical training, firearms proficiency, and military readiness.",
    "publisher": {
      "@type": "Organization",
      "name": "Bald Eagle Tactical",
      "logo": {
        "@type": "ImageObject",
        "url": "https://i.imgur.com/0jZnTpQ.png"
      }
    },
    "blogPost": posts.map(post => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "datePublished": post.created_at,
      "url": `https://baldeagletactical.com/blog/${post.id}/${createUrlSlug(post.title)}`
    }))
  };

  return (
    <>
      <SEO 
        title="Training Insights Blog"
        description="Expert insights and guides on tactical training, firearms proficiency, and military readiness. Stay current with our latest articles."
        canonical="https://baldeagletactical.com/blog"
        schema={blogSchema}
      />
      <Header variant="dark-text" />
      <main className="min-h-screen bg-tactical-50 pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-8 text-center">Training Insights Blog</h1>

          {loading && (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-tactical-700"></div>
            </div>
          )}

          {error && (
            <div className="text-center text-red-500 py-8">{error}</div>
          )}

          {!loading && !error && posts.length === 0 && (
            <p className="text-center text-gray-500 py-8">No blog posts yet. Check back later!</p>
          )}

          {!loading && !error && posts.length > 0 && (
            <div className="space-y-6">
              {posts.map((post) => (
                <Link 
                  key={post.id} 
                  to={`/blog/${post.id}/${createUrlSlug(post.title)}`} 
                  className="block p-6 bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-shadow duration-200"
                >
                  <h2 className="text-2xl font-semibold mb-2">{post.title}</h2>
                  <p className="text-sm text-gray-500">
                    Published on {format(new Date(post.created_at), 'MMMM d, yyyy')}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Blog; 