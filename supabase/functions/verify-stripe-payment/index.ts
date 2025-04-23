import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'
import { createSupabaseClient } from '../_shared/supabaseClient.ts'
import Stripe from 'https://esm.sh/stripe@14.20.0?target=deno&no-check'

// Initialize Stripe
const stripe = Stripe(Deno.env.get('STRIPE_SECRET_KEY'), {
  httpClient: Stripe.createFetchHttpClient(),
  apiVersion: '2023-10-16',
})

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { session_id } = await req.json()

    if (!session_id) {
      throw new Error('Missing session_id in request body');
    }

    // Create a Supabase client potentially using the user's auth token for RLS if needed for the update
    // Or create a service role client if updates need to bypass RLS
    const supabase = createSupabaseClient(req.headers.get('Authorization'))
    // const supabaseAdmin = createSupabaseClient(); // Or init with service role key if needed

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id)

    if (!session) {
        throw new Error('Stripe session not found.');
    }

    // Check if payment was successful
    if (session.payment_status === 'paid') {
      const bookingId = session.client_reference_id

      if (!bookingId) {
          console.error('Missing client_reference_id (bookingId) in Stripe session:', session.id);
          throw new Error('Could not identify booking from Stripe session.')
      }

      // Update the booking status in your database
      // Recommendation: Use a more specific status like 'deposit_paid'
      // You might also want to store the session.id in your booking table
      const { error: updateError } = await supabase
        .from('bookings')
        .update({
          payment_status: 'deposit_paid', // Changed from 'paid' to 'deposit_paid'
          // stripe_checkout_session_id: session.id, // Optional: Add this column to your table
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId)
        // Optional: Add check for current status to prevent double updates
        // .neq('payment_status', 'paid') 

      if (updateError) {
        console.error('Supabase booking update error:', updateError);
        throw new Error('Failed to update booking status after payment confirmation.');
      }

      console.log(`Booking ${bookingId} marked as deposit paid successfully.`);
      return new Response(JSON.stringify({ success: true, bookingId: bookingId, status: 'deposit_paid' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })

    } else {
      // Payment not successful (or status is unpaid, no_payment_required)
      console.log(`Stripe session ${session_id} payment status: ${session.payment_status}`);
      return new Response(JSON.stringify({ success: false, status: session.payment_status }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200, // Still a successful request, just payment wasn't 'paid'
      })
    }

  } catch (error) {
    console.error('Stripe verification error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
}) 