
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { APP_NAME } from '@/lib/constants';

export default function HeroSection() {
  const features = ["Spacious Lots", "Luxury Amenities", "Scenic Serenity"];

  return (
    <section className="relative h-[calc(100vh-4rem)] flex items-center justify-center text-white overflow-hidden">
      <Image
        src="https://picsum.photos/1920/1080"
        alt="Modern residential area"
        layout="fill"
        objectFit="cover"
        quality={80}
        className="absolute z-0"
        data-ai-hint="modern houses residential"
      />
      <div className="absolute inset-0 bg-black/50 z-10" /> {/* Dark overlay */}
      
      <div className="relative z-20 text-center p-8 max-w-3xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold mb-4 drop-shadow-lg">
          {APP_NAME}
        </h1>
        <p className="text-xl md:text-2xl text-gray-200 mb-8 drop-shadow-md">
          A Sanctuary of Modern Living
        </p>
        
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {features.map((feature) => (
            <Badge key={feature} variant="secondary" className="text-sm px-4 py-2 bg-white/20 backdrop-blur-sm border-none text-white">
              {feature}
            </Badge>
          ))}
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg">
            Discover Homes
          </Button>
          <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10 px-8 py-3 text-lg">
            Schedule a Tour
          </Button>
        </div>
      </div>
    </section>
  );
}
