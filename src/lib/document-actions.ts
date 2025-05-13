
"use server";

import { z } from "zod";
import type { DocumentItem, Comment } from "./types";
import { mockDocuments } from "./mock-data"; 
import type { AddDocumentFormValues } from "./schemas/document-schemas";
import { AddDocumentSchema } from "./schemas/document-schemas";
import type { AddCommentFormValues } from "./schemas/comment-schema"; // Will be created
import { AddCommentSchema } from "./schemas/comment-schema";


// In-memory store for mock documents, ensure it's mutable for actions
let documentsStore: DocumentItem[] = [...mockDocuments];


export async function getAllDocuments(): Promise<DocumentItem[]> {
  // Return a copy
  return Promise.resolve([...documentsStore].sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()));
}

export async function getDocumentsForUserOrGeneral(userId: string): Promise<DocumentItem[]> {
  const userDocs = documentsStore.filter(doc => doc.userId === userId || doc.userId === "hoa_general");
  return Promise.resolve([...userDocs].sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()));
}


export async function addDocument(
  values: AddDocumentFormValues,
  uploadedBy: DocumentItem['uploadedBy'] = "admin"
): Promise<{ success: boolean; message: string; document?: DocumentItem, errors?: z.ZodError['formErrors']['fieldErrors'] }> {
  try {
    const validatedData = AddDocumentSchema.parse(values);
    const newDocument: DocumentItem = {
      id: `doc-${Date.now()}`, 
      ...validatedData,
      url: validatedData.url || `/documents/${encodeURIComponent(validatedData.name.toLowerCase().replace(/\s+/g, '-'))}.pdf`,
      uploadDate: new Date().toISOString().split("T")[0],
      uploadedBy,
      comments: [], // Initialize comments array
    };

    documentsStore = [newDocument, ...documentsStore]; 
    console.log("New document added:", newDocument);
    return { success: true, message: "Document added successfully!", document: newDocument };

  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, message: "Validation failed.", errors: error.flatten().fieldErrors };
    }
    console.error("Error adding document:", error);
    return { success: false, message: "An unexpected error occurred while adding document." };
  }
}

export async function deleteDocument(documentId: string): Promise<{ success: boolean; message: string }> {
  try {
    const initialLength = documentsStore.length;
    documentsStore = documentsStore.filter(doc => doc.id !== documentId);

    if (documentsStore.length < initialLength) {
      console.log("Document deleted:", documentId);
      return { success: true, message: "Document deleted successfully." };
    } else {
      return { success: false, message: "Document not found." };
    }
  } catch (error) {
    console.error("Error deleting document:", error);
    return { success: false, message: "An unexpected error occurred while deleting document." };
  }
}

interface AddCommentPayload {
  text: string;
  userId: string; // ID of the user making the comment
  userName: string; // Display name of the user
  attachmentDataUri?: string; // Base64 encoded file data
  attachmentName?: string; // Original name of the file
}

export async function addCommentToDocument(
  documentId: string,
  payload: AddCommentPayload
): Promise<{ success: boolean; message: string; updatedDocument?: DocumentItem, errors?: z.ZodError['formErrors']['fieldErrors'] }> {
  try {
    // Validate comment text using the schema
    const validatedText = AddCommentSchema.parse({ text: payload.text });

    const docIndex = documentsStore.findIndex(doc => doc.id === documentId);
    if (docIndex === -1) {
      return { success: false, message: "Document not found." };
    }

    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      documentId: documentId,
      userId: payload.userId,
      userName: payload.userName,
      text: validatedText.text,
      date: new Date().toISOString(),
    };

    if (payload.attachmentDataUri && payload.attachmentName) {
      // For mock purposes, we'll just store the name and create a fake URL.
      // In a real app, you'd upload the attachmentDataUri to a storage service (e.g., Firebase Storage)
      // and get a downloadable URL.
      newComment.attachmentName = payload.attachmentName;
      newComment.attachmentUrl = `/attachments/mock-${Date.now()}-${encodeURIComponent(payload.attachmentName)}`;
      console.log(`Mock attachment received: ${payload.attachmentName}, data URI length: ${payload.attachmentDataUri.length}`);
    }

    documentsStore[docIndex].comments.push(newComment);
    // Ensure comments are sorted by date, newest first if that's the desired display order
    documentsStore[docIndex].comments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());


    console.log("Comment added to document:", documentsStore[docIndex]);
    return { success: true, message: "Comment added successfully.", updatedDocument: { ...documentsStore[docIndex] } };

  } catch (error) {
    if (error instanceof z.ZodError) {
      // This will catch validation errors from AddCommentSchema
      return { success: false, message: "Validation failed for comment.", errors: error.flatten().fieldErrors };
    }
    console.error("Error adding comment:", error);
    return { success: false, message: "An unexpected error occurred while adding comment." };
  }
}
