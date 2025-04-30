// Simple sitemap generator for Supabase blogs
// Run this script with: node scripts/generate-sitemap.js > public/sitemap.xml

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Configure Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://ooswtfgykyyatgasdgqz.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Create a URL slug from a title
const createUrlSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove non-word chars
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .replace(/-+/g, '-');     // Replace multiple hyphens with single hyphen
};

// Format date for sitemap
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toISOString();
};

async function generateSitemap() {
  // Base URL of your website
  const baseUrl = 'https://baldeagletactical.com';
  
  // Get all blog posts
  const { data: posts, error } = await supabase
    .from('posts')
    .select('id, title, created_at')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching posts:', error);
    process.exit(1);
  }
  
  // Start building the sitemap XML
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Static pages -->
  <url>
    <loc>${baseUrl}</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/about</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/courses</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/contact</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/blog</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  
  <!-- Blog posts -->`;
  
  // Add each blog post to the sitemap
  for (const post of posts) {
    const slug = createUrlSlug(post.title);
    const formattedDate = formatDate(post.created_at);
    
    sitemap += `
  <url>
    <loc>${baseUrl}/blog/${post.id}/${slug}</loc>
    <lastmod>${formattedDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
  }
  
  // Close the sitemap XML
  sitemap += `
</urlset>`;
  
  return sitemap;
}

// Main execution
generateSitemap()
  .then(sitemap => {
    // Output to console (can be redirected to a file)
    console.log(sitemap);
    
    // Also write to public directory
    fs.writeFileSync('public/sitemap.xml', sitemap);
    console.error('Sitemap written to public/sitemap.xml');
  })
  .catch(error => {
    console.error('Error generating sitemap:', error);
    process.exit(1);
  }); 