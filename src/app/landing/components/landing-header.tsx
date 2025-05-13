
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { APP_NAME } from '@/lib/constants';

interface LandingHeaderProps {
  onSignInClick: () => void;
}

export default function LandingHeader({ onSignInClick }: LandingHeaderProps) {
  const navItems = [
    { name: 'Home', href: '/landing' },
    { name: 'About', href: '#' },
    { name: 'Blog', href: '#' },
    { name: 'Listings', href: '#' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/landing" className="flex items-center">
            <span className="text-2xl font-bold text-primary">{APP_NAME}</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>
          <Button onClick={onSignInClick} variant="default" size="sm">
            Sign In
          </Button>
        </div>
      </div>
    </header>
  );
}
