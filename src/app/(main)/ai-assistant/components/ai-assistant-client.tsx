"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { getAIResponse } from '../actions';
import type { DocumentFAQGeneratorOutput } from '@/ai/flows/document-faq-generator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FileUp, Loader2, MessageSquare, Sparkles } from 'lucide-react';

export function AiAssistantClient() {
  const [file, setFile] = useState<File | null>(null);
  const [documentDataUri, setDocumentDataUri] = useState<string | null>(null);
  const [question, setQuestion] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<DocumentFAQGeneratorOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<any | null>(null);

  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      // Basic validation for PDF and TXT files
      if (selectedFile.type === "application/pdf" || selectedFile.type === "text/plain") {
        setFile(selectedFile);
        setError(null); 
        setFieldErrors(null);
        
        const reader = new FileReader();
        reader.onloadend = () => {
          setDocumentDataUri(reader.result as string);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        toast({
          title: "Invalid File Type",
          description: "Please upload a PDF or TXT file.",
          variant: "destructive",
        });
        setFile(null);
        setDocumentDataUri(null);
        event.target.value = ""; // Reset file input
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setResult(null);
    setFieldErrors(null);

    if (!documentDataUri) {
      setFieldErrors({ documentDataUri: ["Please upload a document."] });
      toast({ title: "Error", description: "Please upload a document.", variant: "destructive" });
      return;
    }
    if (!question.trim()) {
      setFieldErrors({ question: ["Please enter a question."] });
      toast({ title: "Error", description: "Please enter a question.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    const response = await getAIResponse({ documentDataUri, question });
    setIsLoading(false);

    if (response.success && response.data) {
      setResult(response.data);
      toast({ title: "Success", description: "Answer generated!" });
    } else {
      setError(response.error || "Failed to get answer.");
      setFieldErrors(response.fieldErrors || null);
      toast({ title: "Error", description: response.error || "Failed to get answer.", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><Sparkles className="mr-2 h-6 w-6 text-primary" /> AI Document Assistant</CardTitle>
          <CardDescription>
            Upload an HOA document (PDF or TXT) and ask questions to get summarized answers.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="document" className="mb-2 block text-sm font-medium">Upload Document</Label>
              <Input id="document" type="file" accept=".pdf,.txt" onChange={handleFileChange} className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"/>
              {file && <p className="mt-2 text-sm text-muted-foreground">Selected: {file.name}</p>}
              {fieldErrors?.documentDataUri && <p className="text-sm font-medium text-destructive mt-1">{fieldErrors.documentDataUri[0]}</p>}
            </div>
            <div>
              <Label htmlFor="question" className="mb-2 block text-sm font-medium">Your Question</Label>
              <Textarea
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="e.g., What are the rules for pets?"
                rows={3}
                className="resize-none"
              />
              {fieldErrors?.question && <p className="text-sm font-medium text-destructive mt-1">{fieldErrors.question[0]}</p>}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading || !file} className="w-full sm:w-auto">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Answer...
                </>
              ) : (
                <>
                  <MessageSquare className="mr-2 h-4 w-4" /> Get Answer
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {error && !fieldErrors && ( // Show general error only if not field-specific
        <Alert variant="destructive" className="shadow">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Generated Answer</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{result.answer}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
