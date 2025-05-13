
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { MapPin, BedDouble, Bath, Car, Home as HomeIcon, DollarSign, Filter } from "lucide-react"; // Renamed Home to HomeIcon
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { APP_NAME } from "@/lib/constants";

const listings = [
  {
    id: "1",
    title: "Modern Family Villa",
    address: "123 Willow Creek Dr, The Quel",
    price: 750000,
    bedrooms: 4,
    bathrooms: 3,
    garage: 2,
    sqft: 2800,
    status: "For Sale",
    imageUrl: "https://picsum.photos/seed/listing1/600/400",
    aiHint: "villa exterior",
    tags: ["Family Friendly", "New Construction", "Luxury"],
  },
  {
    id: "2",
    title: "Serene Lakeside Retreat",
    address: "45 Lakeview Terrace, The Quel",
    price: 920000,
    bedrooms: 3,
    bathrooms: 2.5,
    garage: 1,
    sqft: 2200,
    status: "For Sale",
    imageUrl: "https://picsum.photos/seed/listing2/600/400",
    aiHint: "lakeside home",
    tags: ["Waterfront", "Quiet Location", "Scenic Views"],
  },
  {
    id: "3",
    title: "Contemporary Townhouse",
    address: "789 Urban Way, The Quel",
    price: 550000,
    bedrooms: 3,
    bathrooms: 2,
    garage: 1,
    sqft: 1800,
    status: "Pending",
    imageUrl: "https://picsum.photos/seed/listing3/600/400",
    aiHint: "urban townhome",
    tags: ["Urban Living", "Low Maintenance", "Community Pool"],
  },
  {
    id: "4",
    title: "Spacious Garden Home",
    address: "10 Rosebud Lane, The Quel",
    price: 810000,
    bedrooms: 5,
    bathrooms: 4,
    garage: 3,
    sqft: 3500,
    status: "Sold",
    imageUrl: "https://picsum.photos/seed/listing4/600/400",
    aiHint: "home garden",
    tags: ["Large Lot", "Mature Garden", "Renovated"],
  },
];

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(price);
}

export default function ListingsPage() {
  // Placeholder for filter state management
  // const [filters, setFilters] = useState({});

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary">Available Listings</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Find your dream home in {APP_NAME}.
        </p>
      </header>

      {/* Filter Section - Placeholder */}
      <Card className="mb-8 shadow-md">
        <CardHeader>
          <CardTitle className="text-xl flex items-center"><Filter className="mr-2 h-5 w-5"/>Filter Listings</CardTitle>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Select>
            <SelectTrigger><SelectValue placeholder="Property Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="villa">Villa</SelectItem>
              <SelectItem value="townhouse">Townhouse</SelectItem>
              <SelectItem value="retreat">Retreat</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger><SelectValue placeholder="Bedrooms" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any Bedrooms</SelectItem>
              <SelectItem value="2">2+</SelectItem>
              <SelectItem value="3">3+</SelectItem>
              <SelectItem value="4">4+</SelectItem>
              <SelectItem value="5">5+</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger><SelectValue placeholder="Price Range" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any Price</SelectItem>
              <SelectItem value="<500k">&lt; $500,000</SelectItem>
              <SelectItem value="500k-750k">$500,000 - $750,000</SelectItem>
              <SelectItem value="750k-1m">$750,000 - $1M</SelectItem>
              <SelectItem value=">1m">&gt; $1,000,000</SelectItem>
            </SelectContent>
          </Select>
          <Button className="w-full md:w-auto">Apply Filters</Button>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {listings.map((listing) => (
          <Card key={listing.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="relative w-full h-56">
              <Image
                src={listing.imageUrl}
                alt={listing.title}
                fill
                style={{ objectFit: "cover" }}
                data-ai-hint={listing.aiHint}
              />
              <Badge 
                className={`absolute top-2 right-2 ${listing.status === 'Sold' ? 'bg-destructive' : listing.status === 'Pending' ? 'bg-yellow-500 text-black' : 'bg-primary text-primary-foreground'}`}
              >
                {listing.status}
              </Badge>
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl hover:text-primary transition-colors">
                <Link href={`/landing/listings/${listing.id}`}>{listing.title}</Link>
              </CardTitle>
              <CardDescription className="flex items-center text-sm pt-1">
                <MapPin className="h-4 w-4 mr-1.5 text-muted-foreground" />
                {listing.address}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-3 pt-2">
              <div className="text-2xl font-bold text-primary flex items-center">
                 <DollarSign className="h-5 w-5 mr-1" /> {formatPrice(listing.price)}
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span className="flex items-center"><BedDouble className="h-4 w-4 mr-1.5 text-primary/70"/>{listing.bedrooms} Beds</span>
                <span className="flex items-center"><Bath className="h-4 w-4 mr-1.5 text-primary/70"/>{listing.bathrooms} Baths</span>
                <span className="flex items-center"><Car className="h-4 w-4 mr-1.5 text-primary/70"/>{listing.garage} Garage</span>
                <span className="flex items-center"><HomeIcon className="h-4 w-4 mr-1.5 text-primary/70"/>{listing.sqft} sqft</span>
              </div>
              <div className="flex flex-wrap gap-1 pt-1">
                {listing.tags.map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button asChild className="w-full">
                <Link href={`/landing/listings/${listing.id}`}>View Details</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
