
"use client"; 
// Add "use client" if using hooks like useState, useEffect for fetching/filtering client-side
// For server-side fetching and rendering, this might be a Server Component.
// Given the current structure (direct usage of mockDocuments), it can be a server component.
// However, if we were to filter by a logged-in user's ID dynamically, it might need client-side aspects or different props.
// For simplicity with mock data, let's assume it's a server component that gets "currentUser" documents.

import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, FileText, FileArchive, FileBarChart, UserSquare2 } from "lucide-react";
import type { DocumentItem } from "@/lib/types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { getDocumentsForUserOrGeneral } from '@/lib/document-actions'; // New action

const getIconForType = (type: DocumentItem["type"]) => {
  switch (type) {
    case "guideline":
      return <FileText className="h-5 w-5 text-primary" />;
    case "minutes":
      return <FileArchive className="h-5 w-5 text-secondary-foreground" />;
    case "form":
      return <FileText className="h-5 w-5 text-accent-foreground" />; 
    case "report":
        return <FileBarChart className="h-5 w-5 text-primary" />;
    case "user-specific":
        return <UserSquare2 className="h-5 w-5 text-purple-600" />; // Example for user-specific
    default:
      return <FileText className="h-5 w-5" />;
  }
};

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Mock current user ID. In a real app, this would come from auth context.
  const currentUserId = "user123"; 

  useEffect(() => {
    async function loadDocuments() {
      setIsLoading(true);
      const fetchedDocuments = await getDocumentsForUserOrGeneral(currentUserId);
      // Sort by upload date, newest first
      fetchedDocuments.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
      setDocuments(fetchedDocuments);
      setIsLoading(false);
    }
    loadDocuments();
  }, [currentUserId]);

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Document Library</CardTitle>
          <CardDescription>Access important HOA documents, guidelines, meeting minutes, and forms relevant to you.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading documents...</p>
          ) : documents.length === 0 ? (
            <p className="text-muted-foreground">No documents available for you at this time.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Type</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Uploaded</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell>{getIconForType(doc.type)}</TableCell>
                    <TableCell className="font-medium">{doc.name}</TableCell>
                    <TableCell>{new Date(doc.uploadDate).toLocaleDateString()}</TableCell>
                    <TableCell>{doc.size || "N/A"}</TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="outline" size="sm">
                        <a href={doc.url} download target="_blank" rel="noopener noreferrer">
                          <Download className="mr-2 h-4 w-4" /> Download
                        </a>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
