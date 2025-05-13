
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Image from "next/image";
import { APP_NAME } from "@/lib/constants";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <Card className="shadow-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-background p-8 text-center">
          <CardTitle className="text-4xl font-bold text-primary">{`About ${APP_NAME}`}</CardTitle>
          <CardDescription className="text-lg text-muted-foreground mt-2">
            Discover the vision and values behind our exceptional community.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8 space-y-8">
          <section className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Our Story</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {`${APP_NAME}`} was founded with a simple yet profound vision: to create a residential experience that harmoniously blends modern luxury with the tranquility of nature. We believe that a home is more than just a place to live; it's a sanctuary where memories are made, families grow, and communities thrive.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Our journey began with a carefully selected landscape, chosen for its natural beauty and potential to foster a serene living environment. From there, every aspect of {`${APP_NAME}`} – from architectural design to amenity planning – has been thoughtfully curated to enhance the lives of our residents.
              </p>
            </div>
            <div className="rounded-lg overflow-hidden shadow-md aspect-[3/2] relative">
              <Image
                src="https://picsum.photos/600/400?grayscale"
                alt="Founding team planning"
                fill
                style={{ objectFit: "cover" }}
                className="w-full h-full"
                data-ai-hint="neighborhood sketch"
              />
            </div>
          </section>

          <hr className="border-border" />

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4 text-center">Our Core Values</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: "Excellence", description: "We are committed to the highest standards in design, construction, and community management." },
                { title: "Community", description: "Fostering a strong, supportive, and vibrant neighborhood is at the heart of what we do." },
                { title: "Sustainability", description: "We embrace responsible development practices to preserve natural beauty for generations." },
                { title: "Innovation", description: "Continuously seeking new ways to enhance the living experience through modern amenities and services." },
                { title: "Integrity", description: "Operating with transparency, honesty, and respect for all our residents and partners." },
                { title: "Well-being", description: "Prioritizing the health, happiness, and comfort of everyone who calls The Quel home." },
              ].map((value) => (
                <Card key={value.title} className="bg-secondary/30">
                  <CardHeader>
                    <CardTitle className="text-xl text-primary">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
