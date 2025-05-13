
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from '@/components/ui/badge';
import { IdCard, Mail, ShieldCheck, UserCircle, Phone } from "lucide-react"; // ShieldCheck for admin role
import type { User } from "@/lib/types";
import { getCurrentUserData } from "@/app/(main)/profile/actions"; // Reuse user action
import { ProfileForm } from "@/app/(main)/profile/components/profile-form"; // Reuse profile form
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminProfilePage() {
  // MOCK: In a real app, get userId from auth context/session
  const MOCK_ADMIN_ID = "admin001"; 
  const [currentAdmin, setCurrentAdmin] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadAdminUser() {
      setIsLoading(true);
      const user = await getCurrentUserData(MOCK_ADMIN_ID);
      setCurrentAdmin(user);
      setIsLoading(false);
    }
    loadAdminUser();
  }, []);

  const handleProfileUpdate = (updatedUser: User) => {
    setCurrentAdmin(updatedUser);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="shadow-lg">
          <CardHeader>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-72" />
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-1 flex flex-col items-center space-y-4">
              <Skeleton className="h-24 w-24 rounded-full" />
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="md:col-span-2 space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentAdmin) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Admin Profile Not Found</CardTitle>
          <CardDescription>Could not load admin user profile.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const avatarFallback = `${currentAdmin.firstName?.charAt(0) ?? ''}${currentAdmin.lastName?.charAt(0) ?? ''}`.toUpperCase();

  return (
    <div className="space-y-6">
      <Card className="shadow-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-background p-8">
          <div className="flex items-center space-x-4">
             <Avatar className="h-20 w-20 border-2 border-primary shadow-md">
              {/* <AvatarImage src={currentUser.avatarUrl} alt={`${currentUser.firstName} ${currentUser.lastName}`} /> */}
              <AvatarFallback className="text-2xl bg-primary/20 text-primary font-semibold">
                {avatarFallback || <UserCircle className="h-10 w-10"/>}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-3xl font-bold text-foreground">
                {currentAdmin.firstName} {currentAdmin.lastName}
              </CardTitle>
              <CardDescription className="text-lg text-muted-foreground capitalize flex items-center">
                <ShieldCheck className="mr-2 h-5 w-5 text-primary" />
                {currentAdmin.role} Profile
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
              <IdCard className="mr-2 h-5 w-5 text-primary" /> Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <p className="text-muted-foreground">Full Name</p>
                <p className="font-medium">{currentAdmin.firstName} {currentAdmin.lastName}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">Email Address</p>
                <p className="font-medium flex items-center">
                  <Mail className="mr-2 h-4 w-4 text-muted-foreground" /> {currentAdmin.email}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">Contact Number</p>
                <p className="font-medium flex items-center">
                  <Phone className="mr-2 h-4 w-4 text-muted-foreground" /> {currentAdmin.contactNumber || "Not provided"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">Role</p>
                <p className="font-medium">
                  <Badge variant="default" className="capitalize bg-primary hover:bg-primary/90">
                    <ShieldCheck className="mr-1 h-3.5 w-3.5" />
                    {currentAdmin.role}
                  </Badge>
                </p>
              </div>
            </div>
          </section>
          
          <hr className="border-border" />

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">Edit Profile</h2>
            {/* Reusing the same ProfileForm. Pass currentAdmin as user. */}
            <ProfileForm user={currentAdmin} onProfileUpdate={handleProfileUpdate} />
          </section>

        </CardContent>
      </Card>
    </div>
  );
}
