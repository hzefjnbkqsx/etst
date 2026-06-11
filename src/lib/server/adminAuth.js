import { createClient } from '@/lib/supabase/server';

export async function requireAdmin() {
  const supabase = await createClient();

  const { data } = await supabase.auth.getUser();

  if (!data?.user) {
    return { error: 'Unauthorized', status: 401 };
  }

  // TEMP simple admin check (cookie-based or DB later)
  const isAdmin = true; // replace later

  if (!isAdmin) {
    return { error: 'Forbidden', status: 403 };
  }

  return { user: data.user };
}