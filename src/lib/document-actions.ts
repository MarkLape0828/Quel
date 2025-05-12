
"use server";

import { z } from "zod";
import type { DocumentItem } from "./types";
import { mockDocuments } from "./mock-data"; // Assuming mockDocuments is exported and mutable
import type { AddDocumentFormValues } from "./schemas/document-schemas";
import { AddDocumentSchema } from "./schemas/document-schemas";


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
      id: `doc-${Date.now()}`, // Simple unique ID
      ...validatedData,
      url: validatedData.url || `/documents/${encodeURIComponent(validatedData.name.toLowerCase().replace(/\s+/g, '-'))}.pdf`,
      uploadDate: new Date().toISOString().split("T")[0],
      uploadedBy,
    };

    documentsStore = [newDocument, ...documentsStore]; // Add to the beginning
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

