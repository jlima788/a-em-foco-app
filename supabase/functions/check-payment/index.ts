
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-PAYMENT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    
    // First, try to find customer by email
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    
    if (customers.data.length === 0) {
      logStep("No customer found by email, checking payment sessions directly");
      
      // If no customer found, check for any successful payment sessions
      // This handles cases where payments were made without creating a customer record
      const allSessions = await stripe.checkout.sessions.list({
        limit: 100,
      });
      
      const userSessions = allSessions.data.filter(session => 
        session.customer_details?.email === user.email ||
        session.customer_email === user.email
      );
      
      const hasSuccessfulPayment = userSessions.some(session => 
        session.payment_status === "paid" && session.mode === "payment"
      );
      
      if (hasSuccessfulPayment) {
        logStep("Found successful payment session without customer record", { 
          sessionCount: userSessions.length,
          userEmail: user.email 
        });
        
        await supabaseClient.from("subscribers").upsert({
          email: user.email,
          user_id: user.id,
          stripe_customer_id: null,
          subscribed: true,
          subscription_tier: "Premium",
          subscription_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year from now
          updated_at: new Date().toISOString(),
        }, { onConflict: 'email' });
        
        return new Response(JSON.stringify({
          subscribed: true,
          subscription_tier: "Premium",
          subscription_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }
      
      logStep("No customer and no successful payment sessions found, updating unpaid state");
      await supabaseClient.from("subscribers").upsert({
        email: user.email,
        user_id: user.id,
        stripe_customer_id: null,
        subscribed: false,
        subscription_tier: null,
        subscription_end: null,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'email' });
      return new Response(JSON.stringify({ subscribed: false }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const customerId = customers.data[0].id;
    logStep("Found Stripe customer", { customerId });

    // Check for successful payment sessions for this customer
    const sessions = await stripe.checkout.sessions.list({
      customer: customerId,
      limit: 10,
    });
    
    logStep("Retrieved customer sessions", { sessionCount: sessions.data.length });
    
    const hasSuccessfulPayment = sessions.data.some(session => {
      const isSuccess = session.payment_status === "paid" && session.mode === "payment";
      logStep("Checking session", { 
        sessionId: session.id, 
        paymentStatus: session.payment_status, 
        mode: session.mode,
        isSuccess 
      });
      return isSuccess;
    });

    let subscriptionTier = null;
    let subscriptionEnd = null;

    if (hasSuccessfulPayment) {
      subscriptionTier = "Premium";
      // For one-time payments, we can set a long expiration or make it permanent
      // Here setting it for 1 year from the payment date
      const latestPayment = sessions.data.find(s => s.payment_status === "paid" && s.mode === "payment");
      subscriptionEnd = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(); // 1 year from now
      logStep("Successful payment found", { sessionId: latestPayment?.id, endDate: subscriptionEnd });
    } else {
      logStep("No successful payment found");
    }

    await supabaseClient.from("subscribers").upsert({
      email: user.email,
      user_id: user.id,
      stripe_customer_id: customerId,
      subscribed: hasSuccessfulPayment,
      subscription_tier: subscriptionTier,
      subscription_end: subscriptionEnd,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'email' });

    logStep("Updated database with payment info", { subscribed: hasSuccessfulPayment, subscriptionTier });
    return new Response(JSON.stringify({
      subscribed: hasSuccessfulPayment,
      subscription_tier: subscriptionTier,
      subscription_end: subscriptionEnd
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in check-payment", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
