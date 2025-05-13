
"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import type { ServiceRequest, Comment, User } from '@/lib/types';
import { AddCommentSchema, type AddCommentFormValues } from '@/lib/schemas/comment-schema';
import { addCommentToServiceRequest } from '../actions';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface ServiceRequestCommentsProps {
  serviceRequest: ServiceRequest;
  currentUser: User; 
  onCommentAdded: (updatedRequest: ServiceRequest) => void;
}

export function ServiceRequestComments({ serviceRequest, currentUser, onCommentAdded }: ServiceRequestCommentsProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AddCommentFormValues>({
    resolver: zodResolver(AddCommentSchema),
    defaultValues: {
      text: '',
    },
  });

  async function onSubmit(data: AddCommentFormValues) {
    setIsSubmitting(true);
    
    const result = await addCommentToServiceRequest(serviceRequest.id, {
      text: data.text,
      userId: currentUser.id,
      userName: `${currentUser.firstName} ${currentUser.lastName}`,
    });
    setIsSubmitting(false);

    if (result.success && result.updatedRequest) {
      toast({
        title: 'Comment Added',
        description: 'Your comment has been successfully posted.',
      });
      form.reset();
      onCommentAdded(result.updatedRequest);
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

  return (
    <Card className="mt-4 shadow-sm border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Comments ({serviceRequest.comments.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2.5">
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={`comment-text-sr-${serviceRequest.id}`} className="sr-only">Add a comment</FormLabel>
                  <FormControl>
                    <Textarea
                      id={`comment-text-sr-${serviceRequest.id}`}
                      placeholder={`Commenting as ${currentUser.firstName} ${currentUser.lastName}...`}
                      {...field}
                      rows={2}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting} size="sm">
              <Send className="mr-2 h-4 w-4" />
              {isSubmitting ? 'Posting...' : 'Post Comment'}
            </Button>
          </form>
        </Form>

        <div className="mt-4 space-y-3 max-h-72 overflow-y-auto pr-1">
          {serviceRequest.comments.length === 0 && (
            <p className="text-xs text-muted-foreground">No comments yet for this request.</p>
          )}
          {serviceRequest.comments.map((comment) => (
            <div key={comment.id} className="flex items-start space-x-2.5 p-2.5 bg-secondary/40 rounded-md">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="text-xs">{comment.userName.substring(0, 1)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-foreground">{comment.userName}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {new Date(comment.date).toLocaleString()}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 whitespace-pre-wrap">{comment.text}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
