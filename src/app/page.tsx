
import { redirect } from 'next/navigation';

export default function RootPage() {
  redirect('/login'); // Redirect to login page
  return null; 
}
