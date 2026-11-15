import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

// Keep the client unavailable when local/deployment env is not configured so the page can render its ErrorState.
export const supabase = url && publishableKey ? createClient(url, publishableKey) : null;
