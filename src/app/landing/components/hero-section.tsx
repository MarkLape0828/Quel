
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { APP_NAME } from '@/lib/constants';
import Link from 'next/link';

interface HeroSectionProps {
  onScheduleTourClick: () => void;
}

export default function HeroSection({ onScheduleTourClick }: HeroSectionProps) {
  const features = ["Spacious Lots", "Luxury Amenities", "Scenic Serenity"];

  return (
    <section className="relative w-full h-[calc(100vh-4rem)] flex items-center justify-center text-white overflow-hidden">
      <Image
        src="https://picsum.photos/1920/1080?grayscale&blur=2"
        alt="Modern residential area with calm waters"
        fill
        style={{ objectFit: 'cover' }}
        quality={80}
        className="absolute z-0"
        data-ai-hint="luxury estate sunset"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent z-10" /> {/* Gradient overlay */}
      
      <div className="relative z-20 text-center p-8 max-w-3xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold mb-4 drop-shadow-lg">
          {APP_NAME}
        </h1>
        <p className="text-xl md:text-2xl text-gray-200 mb-8 drop-shadow-md">
          A Sanctuary of Modern Living
        </p>
        
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {features.map((feature) => (
            <Badge key={feature} variant="secondary" className="text-sm px-4 py-2 bg-white/20 backdrop-blur-sm border-none text-white shadow-md">
              {feature}
            </Badge>
          ))}
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg shadow-lg" asChild>
            <Link href="/landing/listings">Discover Homes</Link>
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="border-white text-white bg-transparent hover:bg-white/10 hover:text-white px-8 py-3 text-lg shadow-lg backdrop-blur-sm"
            onClick={onScheduleTourClick}
          >
            Schedule a Tour
          </Button>
        </div>
      </div>
    </section>
  );
}
