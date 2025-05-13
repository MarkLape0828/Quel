
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays, UserCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";

const blogPosts = [
  {
    id: "1",
    title: "The Art of Landscaping in Modern Communities",
    slug: "art-of-landscaping",
    excerpt: "Discover how thoughtful landscaping can transform a residential area into a vibrant, living ecosystem.",
    date: "2024-07-15",
    author: "Jane Gardener",
    category: "Community Living",
    imageUrl: "https://picsum.photos/seed/blog1/600/400",
    aiHint: "beautiful garden community",
  },
  {
    id: "2",
    title: "Top 5 Amenities That Enhance Property Value",
    slug: "top-amenities-property-value",
    excerpt: "We explore the most sought-after amenities in today's housing market and their impact on property value.",
    date: "2024-07-22",
    author: "John Realtor",
    category: "Real Estate",
    imageUrl: "https://picsum.photos/seed/blog2/600/400",
    aiHint: "luxury pool clubhouse",
  },
  {
    id: "3",
    title: "Building a Sustainable Future: Green Initiatives at The Quel",
    slug: "sustainable-future-the-quel",
    excerpt: `An inside look at ${APP_NAME}'s commitment to eco-friendly practices and sustainable development.`,
    date: "2024-07-28",
    author: "Eco Warrior",
    category: "Sustainability",
    imageUrl: "https://picsum.photos/seed/blog3/600/400",
    aiHint: "solar panels green-energy",
  },
];

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary">Our Blog</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Insights, news, and stories from {APP_NAME}.
        </p>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post) => (
          <Card key={post.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="relative w-full h-48">
              <Image
                src={post.imageUrl}
                alt={post.title}
                fill
                style={{ objectFit: "cover" }}
                data-ai-hint={post.aiHint}
              />
            </div>
            <CardHeader>
              <Badge variant="secondary" className="mb-2 w-fit">{post.category}</Badge>
              <CardTitle className="text-xl">
                <Link href={`/landing/blog/${post.slug}`} className="hover:text-primary transition-colors">
                  {post.title}
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-muted-foreground text-sm line-clamp-3">{post.excerpt}</p>
            </CardContent>
            <CardFooter className="text-xs text-muted-foreground flex flex-col items-start space-y-2 border-t pt-4">
              <div className="flex items-center w-full justify-between">
                <div className="flex items-center">
                  <CalendarDays className="h-3.5 w-3.5 mr-1.5" />
                  <span>{new Date(post.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center">
                  <UserCircle className="h-3.5 w-3.5 mr-1.5" />
                  <span>{post.author}</span>
                </div>
              </div>
              <Button variant="link" size="sm" asChild className="px-0 text-primary hover:text-primary/80">
                <Link href={`/landing/blog/${post.slug}`}>
                  Read More <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
