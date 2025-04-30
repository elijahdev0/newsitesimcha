import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { supabase } from '../lib/supabase';
import { Post } from '../types';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';

const BlogPost: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
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
      } catch (error) {
        console.error('Error fetching post:', error);
        setError('Failed to load the blog post. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId, navigate]);

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

  return (
    <>
      <Header variant="dark-text" />
      <main className="min-h-screen bg-tactical-50 pt-32 pb-16">
        <article className="max-w-3xl mx-auto px-4 py-8 bg-white shadow-md rounded-lg prose lg:prose-lg">
          <header className="mb-8 pb-4 border-b border-gray-200 not-prose">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-tactical-900">{post.title}</h1>
            <p className="text-sm text-gray-500">
              Published on {format(new Date(post.created_at), 'MMMM d, yyyy')}
            </p>
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