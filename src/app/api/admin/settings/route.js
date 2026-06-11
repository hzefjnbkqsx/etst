import { getAdminClient } from '@/lib/supabase/admin';
import { requireAdmin } from '@/lib/server/adminAuth';
import { jsonOk, jsonError } from '@/lib/server/api-response';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) return jsonError(auth.error, auth.status);
  const admin = getAdminClient();
  const { data, error } = await admin.from('settings').select('*');
  if (error) return jsonError(error.message, 500);
  return jsonOk({ settings: data ?? [] }, { headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(request) {
  const auth = await requireAdmin();
  if (auth.error) return jsonError(auth.error, auth.status);
  const { settings } = await request.json();
  if (!Array.isArray(settings)) return jsonError('Invalid settings', 400);
  const admin = getAdminClient();

  for (const { key, value, category } of settings) {
    const { data: existing } = await admin.from('settings').select('id').eq('key', key).maybeSingle();
    if (existing) {
      await admin.from('settings').update({ value: String(value), category: category || 'general' }).eq('key', key);
    } else {
      await admin.from('settings').insert({ key, value: String(value), category: category || 'general' });
    }
  }

  const { data, error } = await admin.from('settings').select('*');
  if (error) return jsonError(error.message, 500);

  return jsonOk({ settings: data ?? [] }, { headers: { 'Cache-Control': 'no-store' } });
}
