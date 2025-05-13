
"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';
import type { DirectoryContact, SocialMediaLink } from '@/lib/types';
import { getDirectoryContacts } from '@/lib/contact-directory-actions'; // Will create this action
import { Phone, Mail, Globe, Briefcase, Info, Facebook, Twitter, Instagram, Linkedin, ExternalLink } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const getSocialIcon = (platform: string) => {
  switch (platform.toLowerCase()) {
    case 'facebook': return <Facebook className="h-5 w-5" />;
    case 'twitter': return <Twitter className="h-5 w-5" />;
    case 'instagram': return <Instagram className="h-5 w-5" />;
    case 'linkedin': return <Linkedin className="h-5 w-5" />;
    case 'website': return <Globe className="h-5 w-5" />;
    default: return <ExternalLink className="h-5 w-5" />;
  }
};

export default function ContactDirectoryPage() {
  const [contacts, setContacts] = useState<DirectoryContact[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadContacts() {
      setIsLoading(true);
      const fetchedContacts = await getDirectoryContacts();
      setContacts(fetchedContacts);
      setIsLoading(false);
    }
    loadContacts();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="shadow-lg">
          <CardHeader>
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-4 w-3/4" />
          </CardHeader>
        </Card>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="shadow-md">
              <CardHeader className="flex flex-row items-center space-x-4 pb-3">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-10 w-1/2" />
              </CardContent>
              <CardFooter>
                 <Skeleton className="h-4 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Contact Directory</CardTitle>
          <CardDescription>
            Find important contact information for The Quel services and administration.
          </CardDescription>
        </CardHeader>
      </Card>

      {contacts.length === 0 && !isLoading && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-center">
              No contacts are currently listed in the directory.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {contacts.map((contact) => (
          <Card key={contact.id} className="shadow-md flex flex-col">
            <CardHeader className="flex flex-row items-center space-x-4 pb-3 bg-secondary/30">
              <Avatar className="h-12 w-12 border">
                <AvatarFallback className="text-lg bg-primary/20 text-primary">
                  {contact.department.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-xl">{contact.name}</CardTitle>
                <CardDescription className="flex items-center text-sm">
                  <Briefcase className="mr-1.5 h-4 w-4 text-muted-foreground" /> {contact.department}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pt-4 flex-grow">
              {contact.phoneNumber && (
                <div className="flex items-center text-sm">
                  <Phone className="mr-2 h-4 w-4 text-primary" />
                  <a href={`tel:${contact.phoneNumber.replace(/\D/g, '')}`} className="hover:underline">
                    {contact.phoneNumber}
                  </a>
                </div>
              )}
              {contact.email && (
                <div className="flex items-center text-sm">
                  <Mail className="mr-2 h-4 w-4 text-primary" />
                  <a href={`mailto:${contact.email}`} className="hover:underline truncate">
                    {contact.email}
                  </a>
                </div>
              )}
              {contact.socialMediaLinks && contact.socialMediaLinks.length > 0 && (
                <div className="space-y-1 pt-2">
                  {contact.socialMediaLinks.map((link) => (
                    <a 
                      key={link.url} 
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center text-sm text-primary hover:underline"
                    >
                      {getSocialIcon(link.platform)}
                      <span className="ml-2">{link.displayText || link.platform.charAt(0).toUpperCase() + link.platform.slice(1)}</span>
                    </a>
                  ))}
                </div>
              )}
            </CardContent>
            {contact.notes && (
              <CardFooter className="text-xs text-muted-foreground border-t pt-3 mt-auto">
                <Info className="mr-1.5 h-3.5 w-3.5 flex-shrink-0" /> {contact.notes}
              </CardFooter>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
