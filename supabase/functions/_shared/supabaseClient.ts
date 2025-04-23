import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Function to create a Supabase client, potentially using the user's auth token
export const createSupabaseClient = (authHeader?: string | null) => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY'); // Keep for potential unauth calls

  // --- DEBUG: Log environment variables read by the function ---
  console.log('Supabase Client Helper - Read SUPABASE_URL:', supabaseUrl);
  // WARNING: Avoid logging the full Anon key in production logs if possible
  // Log only a portion or its presence for debugging
  console.log('Supabase Client Helper - Read SUPABASE_ANON_KEY (exists?):', !!supabaseAnonKey);
  // console.log('Supabase Client Helper - Read SUPABASE_ANON_KEY (partial):', supabaseAnonKey?.substring(0, 10)); // Example: Log first 10 chars
  // --- End DEBUG ---

  if (!supabaseUrl) {
    console.error('Missing Supabase URL environment variable inside Edge Function!');
    throw new Error('Server configuration error: Missing Supabase URL.');
  }

  if (authHeader) {
    // --- Authenticated User Flow ---
    // If we have the user's auth token (Authorization: Bearer <token>),
    // create the client using it. The anon key passed as the second argument
    // is often ignored by the auth layer when a valid Authorization header is present,
    // but we explicitly pass ONLY the Authorization header in the global headers.
    console.log('Creating Supabase client WITH user Authorization header.');
    return createClient(supabaseUrl, supabaseAnonKey || 'public-anon-key-placeholder', { // Pass anon key or placeholder
        global: {
            headers: { Authorization: authHeader }, // Only include the user's token here
        },
        auth: {
            persistSession: false,
        },
    });
  } else {
    // --- Unauthenticated/Anon Flow ---
    // If no auth header, create a client using the ANON key from the environment
    // This client can only perform actions allowed by RLS policies for anon users.
    console.warn('Creating Supabase client using ANON key (no Authorization header provided).');
     if (!supabaseAnonKey) {
       console.error('Missing Supabase Anon Key environment variable for anonymous client!');
       throw new Error('Server configuration error: Missing Supabase Anon Key.');
     }
    return createClient(supabaseUrl, supabaseAnonKey, {
        // No specific global headers needed here; anon key is handled by the second arg.
        auth: {
            persistSession: false,
        },
    });
  }
}; 