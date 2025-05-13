
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from '@/components/ui/badge';
import { IdCard, Home, Mail, UserCircle, Phone } from "lucide-react";
import type { User } from "@/lib/types";
import { getCurrentUserData } from "./actions";
import { ProfileForm } from "./components/profile-form";
import { Skeleton } from '@/components/ui/skeleton';

export default function ProfilePage() {
  // MOCK: In a real app, get userId from auth context/session
  const MOCK_USER_ID = "user123"; 
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      setIsLoading(true);
      const user = await getCurrentUserData(MOCK_USER_ID);
      setCurrentUser(user);
      setIsLoading(false);
    }
    loadUser();
  }, []);

  const handleProfileUpdate = (updatedUser: User) => {
    setCurrentUser(updatedUser);
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

  if (!currentUser) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Profile Not Found</CardTitle>
          <CardDescription>Could not load user profile.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const avatarFallback = `${currentUser.firstName?.charAt(0) ?? ''}${currentUser.lastName?.charAt(0) ?? ''}`.toUpperCase();

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
                {currentUser.firstName} {currentUser.lastName}
              </CardTitle>
              <CardDescription className="text-lg text-muted-foreground capitalize">
                {currentUser.role} Profile
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
                <p className="font-medium">{currentUser.firstName} {currentUser.lastName}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">Email Address</p>
                <p className="font-medium flex items-center">
                  <Mail className="mr-2 h-4 w-4 text-muted-foreground" /> {currentUser.email}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">Contact Number</p>
                <p className="font-medium flex items-center">
                  <Phone className="mr-2 h-4 w-4 text-muted-foreground" /> {currentUser.contactNumber || "Not provided"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">Role</p>
                <p className="font-medium">
                  <Badge variant="secondary" className="capitalize">{currentUser.role}</Badge>
                </p>
              </div>
            </div>
          </section>

          {currentUser.role === 'hoa' && (currentUser.propertyId || currentUser.propertyAddress) && (
            <>
            <hr className="border-border" />
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
                <Home className="mr-2 h-5 w-5 text-primary" /> Property Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {currentUser.propertyId && (
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Property ID</p>
                    <p className="font-medium">{currentUser.propertyId}</p>
                  </div>
                )}
                {currentUser.propertyAddress && (
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Property Address</p>
                    <p className="font-medium">{currentUser.propertyAddress}</p>
                  </div>
                )}
              </div>
            </section>
            </>
          )}
          
          <hr className="border-border" />

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">Edit Profile</h2>
            <ProfileForm user={currentUser} onProfileUpdate={handleProfileUpdate} />
          </section>

        </CardContent>
      </Card>
    </div>
  );
}
