
"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import type { DocumentItem, Comment, User } from '@/lib/types';
import { AddCommentSchema, type AddCommentFormValues } from '@/lib/schemas/comment-schema';
import { addCommentToDocument } from '@/lib/document-actions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Paperclip, Send, Download } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface DocumentCommentsProps {
  document: DocumentItem;
  currentUser: User; // Assuming a User object is available for the logged-in user
  onCommentAdded: (updatedDocument: DocumentItem) => void;
}

// Helper to convert file to Data URI
const fileToDataUri = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export function DocumentComments({ document, currentUser, onCommentAdded }: DocumentCommentsProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const form = useForm<AddCommentFormValues>({
    resolver: zodResolver(AddCommentSchema),
    defaultValues: {
      text: '',
    },
  });

  async function onSubmit(data: AddCommentFormValues) {
    setIsSubmitting(true);
    let attachmentDataUri: string | undefined;
    let attachmentName: string | undefined;

    if (selectedFile) {
      try {
        attachmentDataUri = await fileToDataUri(selectedFile);
        attachmentName = selectedFile.name;
      } catch (error) {
        console.error("Error converting file to Data URI:", error);
        toast({
          title: "File Error",
          description: "Could not process the attachment. Please try again.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
    }

    const result = await addCommentToDocument(document.id, {
      text: data.text,
      userId: currentUser.id,
      userName: `${currentUser.firstName} ${currentUser.lastName}`,
      attachmentDataUri,
      attachmentName,
    });
    setIsSubmitting(false);

    if (result.success && result.updatedDocument) {
      toast({
        title: 'Comment Added',
        description: 'Your comment has been successfully posted.',
      });
      form.reset();
      setSelectedFile(null); // Reset file input
      onCommentAdded(result.updatedDocument);
    } else {
      toast({
        title: 'Error Adding Comment',
        description: result.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
      if (result.errors) {
        Object.entries(result.errors).forEach(([fieldName, fieldErrors]) => {
            if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
                 form.setError(fieldName as keyof AddCommentFormValues, { type: 'server', message: fieldErrors[0] });
            }
        });
      }
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  return (
    <Card className="mt-4 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg">Comments ({document.comments.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={`comment-text-${document.id}`}>Add a comment</FormLabel>
                  <FormControl>
                    <Textarea
                      id={`comment-text-${document.id}`}
                      placeholder={`Commenting as ${currentUser.firstName} ${currentUser.lastName}...`}
                      {...field}
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col sm:flex-row sm:items-end gap-2">
              <div className="flex-grow">
                <FormLabel htmlFor={`comment-attachment-${document.id}`}>Attach file (optional)</FormLabel>
                <Input 
                    id={`comment-attachment-${document.id}`}
                    type="file" 
                    onChange={handleFileChange} 
                    className="mt-1"
                />
                {selectedFile && <p className="text-xs text-muted-foreground mt-1">Selected: {selectedFile.name}</p>}
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                <Send className="mr-2 h-4 w-4" />
                {isSubmitting ? 'Posting...' : 'Post Comment'}
              </Button>
            </div>
          </form>
        </Form>

        <div className="mt-6 space-y-4 max-h-96 overflow-y-auto pr-2">
          {document.comments.length === 0 && (
            <p className="text-sm text-muted-foreground">No comments yet.</p>
          )}
          {document.comments.map((comment) => (
            <div key={comment.id} className="flex items-start space-x-3 p-3 bg-secondary/30 rounded-lg">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{comment.userName.substring(0, 1)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground">{comment.userName}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(comment.date).toLocaleString()}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground mt-0.5 whitespace-pre-wrap">{comment.text}</p>
                {comment.attachmentUrl && comment.attachmentName && (
                  <div className="mt-2">
                    <Button variant="outline" size="sm" asChild>
                      <a href={comment.attachmentUrl} download={comment.attachmentName} target="_blank" rel="noopener noreferrer">
                        <Download className="mr-2 h-3.5 w-3.5" />
                        {comment.attachmentName}
                      </a>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
