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

// Default deposit amount (in cents)
const DEPOSIT_AMOUNT_CENTS = 100000;
const CURRENCY = 'usd';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Extract bookingId and optional amount from the request body
    const { bookingId, amount } = await req.json();
    console.log('Received request body:', { bookingId, amount }); // Log received amount

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

    // Fetch the booking to verify ownership (still useful)
    const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .select('id, user_id, total_amount, payment_status') // Fetch payment_status too
        .eq('id', bookingId)
        .eq('user_id', user.id)
        .single();

    if (bookingError || !booking) {
        console.error('Booking fetch error:', bookingError);
        throw new Error(bookingError?.message || 'Booking not found or user does not have access');
    }

    // Determine the amount and product details based on whether 'amount' was passed
    const isPayingRemaining = typeof amount === 'number' && amount > 0;
    const unitAmount = isPayingRemaining ? amount : DEPOSIT_AMOUNT_CENTS;
    const productName = isPayingRemaining ? 'Remaining Training Payment' : 'Training Deposit';
    const productDescription = `Payment for Booking ID: ${bookingId}`;

    // Optional: Add server-side validation for remaining amount
    if (isPayingRemaining) {
        const calculatedRemaining = (booking.total_amount * 100) - DEPOSIT_AMOUNT_CENTS;
        if (amount !== calculatedRemaining) {
            console.warn(`Client-provided amount (${amount}) does not match server-calculated remaining (${calculatedRemaining}). Using client amount.`);
            // Decide if you want to throw an error or proceed with the client amount
            // throw new Error('Provided amount does not match calculated remaining balance.');
        }
        // Prevent paying remaining if deposit wasn't paid
        if (booking.payment_status !== 'deposit_paid') {
             throw new Error('Cannot pay remaining balance before deposit is paid.');
        }
    } else {
        // Prevent paying deposit if already paid
        if (booking.payment_status === 'deposit_paid' || booking.payment_status === 'paid') {
            throw new Error('Deposit for this booking has already been paid.');
        }
    }

    const appBaseUrl = Deno.env.get('APP_BASE_URL')
    if (!appBaseUrl) throw new Error('APP_BASE_URL environment variable not set');
    const successUrl = `${appBaseUrl}/dashboard?payment=success&session_id={CHECKOUT_SESSION_ID}`
    const cancelUrl = `${appBaseUrl}/dashboard?payment=cancel`

    // Create Stripe Checkout session using the determined amount and details
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: [{
            price_data: {
                currency: CURRENCY,
                product_data: {
                    name: productName,
                    description: productDescription,
                },
                unit_amount: unitAmount, // Use the determined amount
            },
            quantity: 1,
        }],
        success_url: successUrl,
        cancel_url: cancelUrl,
        client_reference_id: bookingId,
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