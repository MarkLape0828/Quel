
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
import type { DirectoryContact } from "@/lib/types";
import { getDirectoryContacts, deleteDirectoryContact } from "@/lib/contact-directory-actions";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Edit3, Trash2, Phone, Mail, BookUser } from "lucide-react";
import { DirectoryContactForm } from './components/directory-contact-form'; // Will create this
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminContactDirectoryPage() {
  const [contacts, setContacts] = useState<DirectoryContact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<DirectoryContact | null>(null);

  const fetchContacts = useCallback(async () => {
    setIsLoading(true);
    const fetchedContacts = await getDirectoryContacts();
    setContacts(fetchedContacts);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const handleFormSuccess = (updatedContact: DirectoryContact) => {
    if (editingContact) {
      setContacts(prev => prev.map(c => c.id === updatedContact.id ? updatedContact : c));
    } else {
      setContacts(prev => [updatedContact, ...prev]);
    }
    setIsModalOpen(false);
    setEditingContact(null);
    // Re-sort after adding/editing
    setContacts(prev => [...prev].sort((a,b) => a.department.localeCompare(b.department) || a.name.localeCompare(b.name)));
  };

  const handleEdit = (contact: DirectoryContact) => {
    setEditingContact(contact);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingContact(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (contactId: string, contactName: string) => {
    if (!confirm(`Are you sure you want to delete the contact "${contactName}"? This action cannot be undone.`)) {
      return;
    }
    const result = await deleteDirectoryContact(contactId);
    if (result.success) {
      toast({ title: "Success", description: result.message });
      fetchContacts(); 
    } else {
      toast({ title: "Error", description: result.message, variant: "destructive" });
    }
  };
  
  const renderSkeletons = (count: number) => (
    Array.from({ length: count }).map((_, i) => (
      <TableRow key={`skeleton-${i}`}>
        <TableCell><Skeleton className="h-5 w-32" /></TableCell>
        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
        <TableCell><Skeleton className="h-5 w-32" /></TableCell>
        <TableCell><Skeleton className="h-5 w-40" /></TableCell>
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
            <CardTitle className="flex items-center"><BookUser className="mr-2 h-6 w-6 text-primary" /> Manage Contact Directory</CardTitle>
            <CardDescription>Add, edit, or delete important community contacts.</CardDescription>
          </div>
          <Button onClick={handleAddNew}><PlusCircle className="mr-2 h-4 w-4"/>Add New Contact</Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {renderSkeletons(3)}
                </TableBody>
            </Table>
          ) : contacts.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No contacts found. Add one to get started!</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Social Links</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contacts.map((contact) => (
                    <TableRow key={contact.id}>
                      <TableCell className="font-medium">{contact.name}</TableCell>
                      <TableCell><Badge variant="secondary">{contact.department}</Badge></TableCell>
                      <TableCell>{contact.phoneNumber || "N/A"}</TableCell>
                      <TableCell>{contact.email || "N/A"}</TableCell>
                      <TableCell>{contact.socialMediaLinks?.length || 0}</TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(contact)} title="Edit Contact">
                          <Edit3 className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(contact.id, contact.name)} title="Delete Contact">
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        {!isLoading && contacts.length > 0 && (
            <CardFooter>
                <p className="text-xs text-muted-foreground">Displaying {contacts.length} contacts.</p>
            </CardFooter>
        )}
      </Card>

      <Dialog open={isModalOpen} onOpenChange={(isOpen) => {
          setIsModalOpen(isOpen);
          if (!isOpen) setEditingContact(null);
      }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingContact ? "Edit Contact" : "Add New Contact"}</DialogTitle>
            <DialogDescription>
              {editingContact ? "Update the details for this contact." : "Fill in the details for the new contact."}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 max-h-[70vh] overflow-y-auto pr-2">
            <DirectoryContactForm 
                contact={editingContact || undefined} 
                onSuccess={handleFormSuccess}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
