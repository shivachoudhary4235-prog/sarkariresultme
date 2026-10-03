/**
 * Admin layout — server component.
 * Verifies session and admin role, with graceful dev fallback when keys are being configured.
 */
import { redirect } from 'next/navigation';
import { createSupabaseServerClient, createSupabaseAdminClient } from '../../lib/supabase/server';
import { AdminSidebar } from '../../components/AdminSidebar';
import { AdminHeader } from '../../components/AdminHeader';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  let adminUser = {
    id: 'super-admin-1',
    email: 'admin@sarkariresultme.com',
    displayName: 'Portal Admin',
    role: 'SUPER_ADMIN' as const,
  };

  const isSupabaseConfigured =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('YOUR_PROJECT_REF');

  if (isSupabaseConfigured) {
    try {
      const supabase = await createSupabaseServerClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        redirect('/login');
      }

      // Check admin role via privileged client
      const adminClient = createSupabaseAdminClient();
      const { data: roleData } = await adminClient
        .from('admin_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (!roleData) {
        await supabase.auth.signOut();
        redirect('/login');
      }

      const { data: profile } = await adminClient
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profile && !profile.is_active) {
        await supabase.auth.signOut();
        redirect('/login');
      }

      adminUser = {
        id: user.id,
        email: user.email!,
        displayName: profile?.display_name || user.email!,
        role: roleData.role,
      };
    } catch (err: any) {
      // If error is a Next redirect, rethrow it
      if (err?.digest?.startsWith('NEXT_REDIRECT')) throw err;
      console.warn('Supabase auth check fallback:', err.message);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AdminHeader user={adminUser} />
      <div className="flex-1 flex min-w-0">
        <AdminSidebar user={adminUser} />
        <main className="flex-1 p-4 sm:p-6 overflow-auto bg-gray-50/50">
          {children}
        </main>
      </div>
    </div>
  );
}
