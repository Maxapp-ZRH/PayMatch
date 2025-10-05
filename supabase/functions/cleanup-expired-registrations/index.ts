/**
 * Cleanup Expired Registrations Edge Function
 *
 * Automatically cleans up expired pending registrations from the database.
 * This function runs on a cron schedule to maintain database hygiene.
 *
 * Cron Schedule: Every 6 hours (0 0,6,12,18 * * *)
 * Purpose: Remove expired pending registrations that are older than 24 hours
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client with service role
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Starting cleanup of expired pending registrations...');

    // Get current timestamp
    const now = new Date().toISOString();
    console.log('Current time:', now);

    // First, let's see what we're about to clean up
    const { data: expiredRegistrations, error: selectError } =
      await supabaseClient
        .from('pending_registrations')
        .select('id, email, created_at, expires_at')
        .lt('expires_at', now);

    if (selectError) {
      console.error('Error selecting expired registrations:', selectError);
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Failed to select expired registrations',
          details: selectError.message,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      );
    }

    const expiredCount = expiredRegistrations?.length || 0;
    console.log(`Found ${expiredCount} expired registrations to clean up`);

    if (expiredCount === 0) {
      console.log('No expired registrations found, cleanup complete');
      return new Response(
        JSON.stringify({
          success: true,
          message: 'No expired registrations found',
          cleanedCount: 0,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    // Log details of what we're cleaning up (for debugging)
    console.log('Expired registrations to be deleted:', expiredRegistrations);

    // Delete expired registrations
    const { data: deletedData, error: deleteError } = await supabaseClient
      .from('pending_registrations')
      .delete()
      .lt('expires_at', now)
      .select('id, email');

    if (deleteError) {
      console.error('Error deleting expired registrations:', deleteError);
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Failed to delete expired registrations',
          details: deleteError.message,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      );
    }

    const cleanedCount = deletedData?.length || 0;
    console.log(
      `Successfully cleaned up ${cleanedCount} expired registrations`
    );

    // Log success details
    if (deletedData && deletedData.length > 0) {
      console.log(
        'Deleted registrations:',
        deletedData.map((r) => ({ id: r.id, email: r.email }))
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully cleaned up ${cleanedCount} expired registrations`,
        cleanedCount,
        deletedRegistrations:
          deletedData?.map((r) => ({ id: r.id, email: r.email })) || [],
        timestamp: now,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Function error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
