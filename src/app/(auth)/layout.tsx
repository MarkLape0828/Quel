
import type { Metadata } from 'next';
import { APP_NAME } from '@/lib/constants';
import { Logo } from '@/components/icons'; Link
import Link from 'next/link';

export const metadata: Metadata = {
  title: `Auth | ${APP_NAME}`,
  description: `Authentication pages for ${APP_NAME}`,
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center text-center">
            <Link href="/" className="mb-6 flex items-center gap-2">
                <Logo className="h-10 w-10 text-primary" />
                <span className="text-2xl font-semibold text-primary">{APP_NAME}</span>
            </Link>
        </div>
        {children}
      </div>
    </div>
  );
}
