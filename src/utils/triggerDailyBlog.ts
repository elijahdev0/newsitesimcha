// src/utils/triggerDailyBlog.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const edgeFunctionUrl = `${supabaseUrl}/functions/v1/daily-blog-post`;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function triggerDailyBlogIfNeeded() {
  // 1. Get the latest blog post
  const { data, error } = await supabase
    .from('posts')
    .select('id, created_at')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    // If no posts exist, trigger the function
    if (error.code === 'PGRST116' || error.message.includes('No rows')) {
      await fetch(edgeFunctionUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json',
        },
      });
      return true;
    }
    // Other errors
    return false;
  }

  // 2. Check if more than 24 hours have passed
  const lastCreated = new Date(data.created_at).getTime();
  const now = Date.now();
  if (now - lastCreated > 24 * 60 * 60 * 1000) {
    await fetch(edgeFunctionUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json',
      },
    });
    return true;
  }

  // No need to trigger
  return false;
}
