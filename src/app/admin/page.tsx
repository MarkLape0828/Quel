import { redirect } from 'next/navigation';

export default function RootAdminPage() {
  redirect('/admin/billing');
  return null; // Or a loading spinner, but redirect is quick
}
