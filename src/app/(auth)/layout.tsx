
import type { Metadata } from 'next';
import { APP_NAME } from '@/lib/constants';
import { Logo } from '@/components/icons';
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary/5 via-background to-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center text-center">
            <Link href="/" className="mb-8 flex items-center gap-3">
                <Logo className="h-14 w-14 text-primary" />
                <span className="text-4xl font-bold text-primary">{APP_NAME}</span>
            </Link>
        </div>
        {children}
      </div>
    </div>
  );
}

