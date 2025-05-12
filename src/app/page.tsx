import { redirect } from 'next/navigation';

export default function RootPage() {
  redirect('/community-feed');
  return null; // Or a loading spinner, but redirect is quick
}
