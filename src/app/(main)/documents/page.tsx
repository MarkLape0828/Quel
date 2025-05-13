"use client"; 

import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, FileText, FileArchive, FileBarChart, UserSquare2, MessageSquare, ChevronDown } from "lucide-react"; // Added ChevronDown
import type { DocumentItem, User } from "@/lib/types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { getDocumentsForUserOrGeneral } from '@/lib/document-actions'; 
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { DocumentComments } from './components/document-comments';
import { mockUsers } from '@/lib/mock-data'; // For mock current user

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
        return <UserSquare2 className="h-5 w-5 text-purple-600" />; 
    default:
      return <FileText className="h-5 w-5" />;
  }
};

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Mock current user ID and user object. In a real app, this would come from auth context.
  const currentUserId = "user123"; 
  const currentUser = mockUsers.find(u => u.id === currentUserId) || mockUsers[0]; // Fallback to first mock user

  useEffect(() => {
    async function loadDocuments() {
      setIsLoading(true);
      const fetchedDocuments = await getDocumentsForUserOrGeneral(currentUserId);
      fetchedDocuments.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
      setDocuments(fetchedDocuments);
      setIsLoading(false);
    }
    loadDocuments();
  }, [currentUserId]);

  const handleCommentAdded = (updatedDocument: DocumentItem) => {
    setDocuments(prevDocs => 
      prevDocs.map(doc => doc.id === updatedDocument.id ? updatedDocument : doc)
    );
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Document Library</CardTitle>
          <CardDescription>Access important HOA documents, guidelines, meeting minutes, and forms relevant to you. Add comments and attachments.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading documents...</p>
          ) : documents.length === 0 ? (
            <p className="text-muted-foreground">No documents available for you at this time.</p>
          ) : (
            <Accordion type="single" collapsible className="w-full">
              {documents.map((doc) => (
                <AccordionItem value={doc.id} key={doc.id} className="border-b-0">
                  <Card className="mb-2 overflow-hidden">
                    <Table>
                      <TableHeader className="sr-only">
                        <TableRow>
                          <TableHead className="w-[60px]">Icon</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Uploaded</TableHead>
                          <TableHead>Size</TableHead>
                          <TableHead className="w-[200px] text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow className="border-b-0 hover:bg-transparent data-[state=selected]:bg-transparent">
                          <TableCell className="w-[60px] p-3">{getIconForType(doc.type)}</TableCell>
                          <TableCell className="font-medium p-3">{doc.name}</TableCell>
                          <TableCell className="p-3">{new Date(doc.uploadDate).toLocaleDateString()}</TableCell>
                          <TableCell className="p-3">{doc.size || "N/A"}</TableCell>
                          <TableCell className="text-right space-x-2 p-3 w-[200px]">
                            <Button asChild variant="outline" size="sm">
                              <a href={doc.url} download target="_blank" rel="noopener noreferrer">
                                <Download className="mr-2 h-4 w-4" /> Download
                              </a>
                            </Button>
                            <AccordionTrigger asChild>
                               <Button variant="outline" size="sm" className="justify-between"> {/* Ensure Button can layout children */}
                                <span className="flex items-center">
                                  <MessageSquare className="mr-2 h-4 w-4" /> Comments ({doc.comments.length})
                                </span>
                                <ChevronDown className="h-4 w-4 shrink-0" /> {/* Add ChevronDown icon here */}
                               </Button>
                            </AccordionTrigger>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                    <AccordionContent className="p-0">
                        <div className="px-4 pb-4">
                         <DocumentComments 
                            document={doc} 
                            currentUser={currentUser} 
                            onCommentAdded={handleCommentAdded} 
                         />
                        </div>
                    </AccordionContent>
                  </Card>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </CardContent>
        {documents.length > 0 && !isLoading && (
          <CardFooter>
            <p className="text-xs text-muted-foreground">Displaying {documents.length} documents.</p>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
