
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { DocumentItem } from "@/lib/types";
import { addDocument, deleteDocument, getAllDocuments } from '@/lib/document-actions';
import { useToast } from '@/hooks/use-toast';
import { Download, FileText, FileArchive, FileBarChart, Trash2, PlusCircle, UserSquare2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AddDocumentSchema, type AddDocumentFormValues } from '@/lib/schemas/document-schemas';

const getIconForType = (type: DocumentItem["type"]) => {
  switch (type) {
    case "guideline": return <FileText className="h-5 w-5 text-primary" />;
    case "minutes": return <FileArchive className="h-5 w-5 text-secondary-foreground" />;
    case "form": return <FileText className="h-5 w-5 text-accent-foreground" />;
    case "report": return <FileBarChart className="h-5 w-5 text-primary" />;
    case "user-specific": return <UserSquare2 className="h-5 w-5 text-purple-600" />;
    default: return <FileText className="h-5 w-5" />;
  }
};

function AddDocumentDialog({ onDocumentAdded }: { onDocumentAdded: () => void }) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<AddDocumentFormValues>({
    resolver: zodResolver(AddDocumentSchema),
    defaultValues: {
      name: "",
      type: undefined,
      userId: "",
      url: "", // Will be auto-generated or placeholder
      size: "N/A",
    },
  });

  async function onSubmit(data: AddDocumentFormValues) {
    setIsSubmitting(true);
    const result = await addDocument(data, "admin");
    setIsSubmitting(false);

    if (result.success) {
      toast({ title: "Success!", description: result.message });
      form.reset();
      onDocumentAdded();
      setIsOpen(false);
    } else {
      toast({ title: "Error", description: result.message || "Failed to add document.", variant: "destructive" });
      if (result.errors) {
        Object.entries(result.errors).forEach(([fieldName, fieldErrors]) => {
            if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
                 form.setError(fieldName as keyof AddDocumentFormValues, { type: 'server', message: fieldErrors[0] });
            }
        });
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button><PlusCircle className="mr-2 h-4 w-4" /> Add Document</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Document</DialogTitle>
          <DialogDescription>Fill in the details for the new document.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel>Document Name</FormLabel>
                <FormControl><Input placeholder="e.g., Pool Maintenance Schedule Q3" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="type" render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Select document type" /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="guideline">Guideline</SelectItem>
                    <SelectItem value="minutes">Minutes</SelectItem>
                    <SelectItem value="form">Form</SelectItem>
                    <SelectItem value="report">Report</SelectItem>
                    <SelectItem value="user-specific">User Specific</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="userId" render={({ field }) => (
              <FormItem>
                <FormLabel>User ID / Target</FormLabel>
                <FormControl><Input placeholder="e.g., user123 or hoa_general" {...field} /></FormControl>
                <FormDescription>Enter User ID or 'hoa_general' for community-wide documents.</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
             <FormField control={form.control} name="url" render={({ field }) => (
              <FormItem>
                <FormLabel>Document URL (Optional)</FormLabel>
                <FormControl><Input placeholder="Leave blank for auto-generate or default" {...field} /></FormControl>
                <FormDescription>If blank, a placeholder URL will be used.</FormDescription>
                <FormMessage />
              </FormItem>
            )} />
            <DialogFooter>
              <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
              <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Adding..." : "Add Document"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminDocumentsPage() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchDocuments = useCallback(async () => {
    setIsLoading(true);
    const fetchedDocs = await getAllDocuments();
    setDocuments(fetchedDocs);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleDeleteDocument = async (docId: string, docName: string) => {
    if (!confirm(`Are you sure you want to delete "${docName}"? This action cannot be undone.`)) {
      return;
    }
    const result = await deleteDocument(docId);
    if (result.success) {
      toast({ title: "Success", description: result.message });
      fetchDocuments(); // Refresh list
    } else {
      toast({ title: "Error", description: result.message, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Manage Documents</CardTitle>
            <CardDescription>Oversee all HOA and user-specific documents. Add, or delete documents.</CardDescription>
          </div>
          <AddDocumentDialog onDocumentAdded={fetchDocuments} />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading documents...</p>
          ) : documents.length === 0 ? (
            <p className="text-muted-foreground">No documents found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px]">Type</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Target (User ID)</TableHead>
                  <TableHead>Uploaded</TableHead>
                  <TableHead>Uploaded By</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell>{getIconForType(doc.type)}</TableCell>
                    <TableCell className="font-medium max-w-xs truncate" title={doc.name}>{doc.name}</TableCell>
                    <TableCell>
                      <Badge variant={doc.userId === "hoa_general" ? "secondary" : "outline"}>
                        {doc.userId}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(doc.uploadDate).toLocaleDateString()}</TableCell>
                    <TableCell className="capitalize">{doc.uploadedBy}</TableCell>
                    <TableCell>{doc.size || "N/A"}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button asChild variant="outline" size="sm">
                        <a href={doc.url} download target="_blank" rel="noopener noreferrer">
                          <Download className="mr-2 h-3 w-3" /> Download
                        </a>
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteDocument(doc.id, doc.name)}>
                        <Trash2 className="mr-2 h-3 w-3" /> Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
        {documents.length > 0 && (
            <CardFooter>
                <p className="text-xs text-muted-foreground">Showing {documents.length} documents.</p>
            </CardFooter>
        )}
      </Card>
    </div>
  );
}

