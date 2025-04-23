import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'
import { createSupabaseClient } from '../_shared/supabaseClient.ts'
import Stripe from 'https://esm.sh/stripe@14.20.0?target=deno&no-check'

// Initialize Stripe configuration
const stripe = Stripe(Deno.env.get('STRIPE_SECRET_KEY'), {
  // Use the Fetch API installed globally by Deno
  httpClient: Stripe.createFetchHttpClient(),
  apiVersion: '2023-10-16', // Use a fixed API version
})

// Fixed deposit amount (in cents) and currency - adjust as needed
const DEPOSIT_AMOUNT_CENTS = 100000; // Example: 1000.00 USD/EUR
const CURRENCY = 'usd'; // Example: 'usd' or 'eur'

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { bookingId } = await req.json()

    if (!bookingId) {
      throw new Error('Missing bookingId in request body');
    }

    // --- DEBUG: Log the received Authorization header ---
    const authHeader = req.headers.get('Authorization');
    console.log('Received Auth Header in Edge Function:', authHeader);
    // --- End DEBUG ---

    // Create a Supabase client with the user's auth token
    const supabase = createSupabaseClient(authHeader)

    // Get user session
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
        console.error('User auth error:', userError);
        throw new Error('User not authenticated');
    }

    // Optional: Fetch the booking to verify ownership and get details if needed
    const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .select('id, user_id, total_amount') // Select necessary fields
        .eq('id', bookingId)
        .eq('user_id', user.id) // Ensure the user owns this booking
        .single(); // Expect only one result

    if (bookingError || !booking) {
        console.error('Booking fetch error:', bookingError);
        throw new Error(bookingError?.message || 'Booking not found or user does not have access');
    }

    // Check if deposit is already paid (optional, prevents creating unnecessary sessions)
    // Add a specific status like 'deposit_paid' to your schema for better tracking
    // if (booking.payment_status === 'deposit_paid' || booking.payment_status === 'paid') {
    //    throw new Error('Deposit for this booking has already been paid.');
    // }

    const appBaseUrl = Deno.env.get('APP_BASE_URL')
    const successUrl = `${appBaseUrl}/dashboard?payment=success&session_id={CHECKOUT_SESSION_ID}`
    const cancelUrl = `${appBaseUrl}/dashboard?payment=cancel`

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: [{
            // If using a fixed Price ID from your Stripe dashboard:
            // price: Deno.env.get('STRIPE_DEPOSIT_PRICE_ID'),
            // quantity: 1,
            // --- OR ---
            // If defining the price dynamically:
            price_data: {
                currency: CURRENCY,
                product_data: {
                    name: 'Training Deposit',
                    description: `Deposit for Booking ID: ${bookingId}`, // Optional description
                },
                unit_amount: DEPOSIT_AMOUNT_CENTS, // Use the defined deposit amount
            },
            quantity: 1,
        }],
        success_url: successUrl,
        cancel_url: cancelUrl,
        client_reference_id: bookingId, // IMPORTANT: Link the session to your booking ID
        // customer_email: user.email, // Optional: Pre-fill email
    })

    if (!session.url) {
        throw new Error('Stripe session creation failed: No URL returned.');
    }

    // Return the session URL
    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400, // Use 400 for client errors, 500 for server errors
    })
  }
}) 