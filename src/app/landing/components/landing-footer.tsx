
import { APP_NAME } from '@/lib/constants';
import { Mail, Phone } from 'lucide-react';

export default function LandingFooter() {
  const currentYear = new Date().getFullYear();
  const contactEmail = "info@thequel.com";
  const contactPhone = "(555) 123-4567";

  return (
    <footer className="bg-secondary/50 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-muted-foreground">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-foreground">{APP_NAME}</h3>
          <div className="flex justify-center items-center space-x-6 mt-2">
            <a href={`mailto:${contactEmail}`} className="flex items-center hover:text-primary transition-colors">
              <Mail className="h-5 w-5 mr-2" />
              {contactEmail}
            </a>
            <a href={`tel:${contactPhone.replace(/\D/g, '')}`} className="flex items-center hover:text-primary transition-colors">
              <Phone className="h-5 w-5 mr-2" />
              {contactPhone}
            </a>
          </div>
        </div>
        <p className="text-sm">
          &copy; {currentYear} {APP_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
