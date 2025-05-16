
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { Announcement, User } from "@/lib/types";
import { getAnnouncements, deleteAnnouncement } from "@/lib/announcement-actions";
import { mockUsers } from '@/lib/mock-data';
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Edit3, Trash2, Megaphone, CalendarDays } from "lucide-react";
import { AnnouncementForm } from './components/announcement-form';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);

  // MOCK ADMIN USER - In a real app, get this from auth context
  const currentAdminUser = mockUsers.find(u => u.role === 'admin') || mockUsers[0];


  const fetchAnnouncements = useCallback(async () => {
    setIsLoading(true);
    const fetchedAnnouncements = await getAnnouncements();
    setAnnouncements(fetchedAnnouncements);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  const handleFormSuccess = (updatedAnnouncement: Announcement) => {
    if (editingAnnouncement) {
      setAnnouncements(prev => prev.map(a => a.id === updatedAnnouncement.id ? updatedAnnouncement : a));
    } else {
      setAnnouncements(prev => [updatedAnnouncement, ...prev]);
    }
    setIsModalOpen(false);
    setEditingAnnouncement(null);
    // Re-sort after adding/editing
    setAnnouncements(prev => [...prev].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  const handleEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingAnnouncement(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (announcementId: string, announcementTitle: string) => {
    if (!confirm(`Are you sure you want to delete the announcement "${announcementTitle}"? This action cannot be undone.`)) {
      return;
    }
    const result = await deleteAnnouncement(announcementId, currentAdminUser.id);
    if (result.success) {
      toast({ title: "Success", description: result.message });
      fetchAnnouncements(); 
    } else {
      toast({ title: "Error", description: result.message, variant: "destructive" });
    }
  };
  
  const renderSkeletons = (count: number) => (
    Array.from({ length: count }).map((_, i) => (
      <TableRow key={`skeleton-${i}`}>
        <TableCell><Skeleton className="h-5 w-32" /></TableCell>
        <TableCell><Skeleton className="h-5 w-48" /></TableCell>
        <TableCell><Skeleton className="h-5 w-20" /></TableCell>
        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
        <TableCell className="text-right space-x-1">
          <Skeleton className="h-8 w-8 inline-block" />
          <Skeleton className="h-8 w-8 inline-block" />
        </TableCell>
      </TableRow>
    ))
  );

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center"><Megaphone className="mr-2 h-6 w-6 text-primary" /> Manage Announcements</CardTitle>
            <CardDescription>Add, edit, or delete community announcements and events.</CardDescription>
          </div>
          <Button onClick={handleAddNew}><PlusCircle className="mr-2 h-4 w-4"/>Add New Announcement</Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Author</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {renderSkeletons(3)}
                </TableBody>
            </Table>
          ) : announcements.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No announcements found. Add one to get started!</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Image</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {announcements.map((announcement) => (
                    <TableRow key={announcement.id}>
                      <TableCell className="font-medium max-w-xs truncate" title={announcement.title}>{announcement.title}</TableCell>
                      <TableCell>
                        <Badge variant={announcement.type === 'event' ? "default" : "secondary"} className="capitalize">
                            {announcement.type === 'event' ? <CalendarDays className="mr-1 h-3.5 w-3.5" /> : <Megaphone className="mr-1 h-3.5 w-3.5" />}
                            {announcement.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(announcement.date + 'T00:00:00').toLocaleDateString()}</TableCell>
                      <TableCell>{announcement.author || "N/A"}</TableCell>
                      <TableCell>
                        {announcement.type === 'event' && announcement.imageUrl && (
                            <Image src={announcement.imageUrl} alt={announcement.title} width={50} height={30} className="rounded object-cover aspect-video" data-ai-hint={announcement.aiHint || "event image"}/>
                        )}
                      </TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button variant="outline" size="icon" onClick={() => handleEdit(announcement)} title="Edit Announcement">
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="icon" onClick={() => handleDelete(announcement.id, announcement.title)} title="Delete Announcement">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        {!isLoading && announcements.length > 0 && (
            <CardFooter>
                <p className="text-xs text-muted-foreground">Displaying {announcements.length} announcements.</p>
            </CardFooter>
        )}
      </Card>

      <Dialog open={isModalOpen} onOpenChange={(isOpen) => {
          setIsModalOpen(isOpen);
          if (!isOpen) setEditingAnnouncement(null);
      }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingAnnouncement ? "Edit Announcement" : "Add New Announcement"}</DialogTitle>
            <DialogDescription>
              {editingAnnouncement ? "Update the details for this announcement." : "Fill in the details for the new announcement."}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 max-h-[70vh] overflow-y-auto pr-2">
            <AnnouncementForm 
                announcement={editingAnnouncement || undefined} 
                adminUserId={currentAdminUser.id}
                onSuccess={handleFormSuccess}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
