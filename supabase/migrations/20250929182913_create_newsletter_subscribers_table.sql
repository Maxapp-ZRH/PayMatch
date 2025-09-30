-- Create newsletter subscribers table
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE,
  unsubscribe_token TEXT UNIQUE DEFAULT gen_random_uuid()::TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add table description
COMMENT ON TABLE public.newsletter_subscribers IS 'Newsletter subscribers with unsubscribe functionality';

-- Add column descriptions
COMMENT ON COLUMN public.newsletter_subscribers.first_name IS 'Subscriber first name';
COMMENT ON COLUMN public.newsletter_subscribers.last_name IS 'Subscriber last name';
COMMENT ON COLUMN public.newsletter_subscribers.email IS 'Subscriber email address (unique)';
COMMENT ON COLUMN public.newsletter_subscribers.subscribed_at IS 'When the user subscribed to the newsletter';
COMMENT ON COLUMN public.newsletter_subscribers.unsubscribed_at IS 'When the user unsubscribed (if applicable)';
COMMENT ON COLUMN public.newsletter_subscribers.is_active IS 'Whether the subscription is currently active';
COMMENT ON COLUMN public.newsletter_subscribers.unsubscribe_token IS 'Unique token for unsubscribe links';
COMMENT ON COLUMN public.newsletter_subscribers.created_at IS 'Record creation timestamp';
COMMENT ON COLUMN public.newsletter_subscribers.updated_at IS 'Record last update timestamp';

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON public.newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_is_active ON public.newsletter_subscribers(is_active);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_unsubscribe_token ON public.newsletter_subscribers(unsubscribe_token);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_newsletter_subscribers_updated_at
  BEFORE UPDATE ON public.newsletter_subscribers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Allow service role to manage all newsletter subscribers
CREATE POLICY "Service role can manage newsletter subscribers" ON public.newsletter_subscribers
  FOR ALL USING (auth.role() = 'service_role');

-- Allow users to read their own subscription status (for unsubscribe page)
CREATE POLICY "Users can read own subscription" ON public.newsletter_subscribers
  FOR SELECT USING (email = auth.jwt() ->> 'email');

-- Allow anonymous users to subscribe (for newsletter signup)
CREATE POLICY "Anonymous users can subscribe" ON public.newsletter_subscribers
  FOR INSERT WITH CHECK (true);

-- Allow users to unsubscribe using their token
CREATE POLICY "Users can unsubscribe with token" ON public.newsletter_subscribers
  FOR UPDATE USING (unsubscribe_token = current_setting('request.jwt.claims', true)::json ->> 'unsubscribe_token');
