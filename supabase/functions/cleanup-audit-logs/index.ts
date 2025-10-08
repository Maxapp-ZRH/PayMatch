/**
 * Cleanup Audit Logs Edge Function
 *
 * Automatically cleans up old audit logs to maintain database performance.
 * Runs on a schedule to remove logs older than 1 year.
 */

// Setup type definitions for built-in Supabase Runtime APIs
import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Create Supabase client with service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify the request is authorized (optional: add API key check)
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Call the cleanup function
    const { data, error } = await supabase.rpc('cleanup_old_audit_logs');

    if (error) {
      console.error('Cleanup error:', error);
      return new Response(
        JSON.stringify({
          error: 'Failed to cleanup audit logs',
          details: error.message,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const deletedCount = data || 0;

    // Log the cleanup operation
    console.log(`Cleaned up ${deletedCount} old audit log entries`);

    return new Response(
      JSON.stringify({
        success: true,
        deletedCount,
        message: `Successfully cleaned up ${deletedCount} old audit log entries`,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        details: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/cleanup-audit-logs' \
    --header 'Authorization: Bearer YOUR_SERVICE_ROLE_KEY' \
    --header 'Content-Type: application/json'

  To invoke in production:

  curl -i --location --request POST 'https://your-project.supabase.co/functions/v1/cleanup-audit-logs' \
    --header 'Authorization: Bearer YOUR_SERVICE_ROLE_KEY' \
    --header 'Content-Type: application/json'

*/
