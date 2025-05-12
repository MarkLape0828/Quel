"use server";

import { z } from "zod";
import { ServiceRequestSchema } from "./schema";
import type { ServiceRequest } from "@/lib/types";

// This is a mock database. In a real application, you'd use a proper database.
const mockServiceRequests: ServiceRequest[] = [
  {
    id: "sr1",
    title: "Leaky faucet in community kitchen",
    description: "The main faucet in the community kitchen sink is dripping constantly.",
    category: "maintenance",
    status: "pending",
    submittedDate: "2024-06-28",
    location: "Community Kitchen",
    submittedBy: "Jane Doe",
  },
  {
    id: "sr2",
    title: "Streetlight out on Elm Street",
    description: "The streetlight at the corner of Elm Street and Oak Avenue is not working.",
    category: "maintenance",
    status: "in-progress",
    submittedDate: "2024-06-25",
    location: "Corner of Elm St and Oak Ave",
    submittedBy: "John Smith",
  },
];

export async function submitServiceRequest(
  values: z.infer<typeof ServiceRequestSchema>
) {
  try {
    const validatedData = ServiceRequestSchema.parse(values);
    
    const newRequest: ServiceRequest = {
      id: `sr${Date.now()}`, // Simple unique ID
      ...validatedData,
      status: "pending",
      submittedDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD
      submittedBy: "Current User (Placeholder)", // Replace with actual user later
    };
    
    mockServiceRequests.unshift(newRequest); // Add to the beginning of the list

    console.log("New service request submitted:", newRequest);
    return { success: true, message: "Service request submitted successfully!", request: newRequest };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, message: "Validation failed.", errors: error.flatten().fieldErrors };
    }
    console.error("Error submitting service request:", error);
    return { success: false, message: "An unexpected error occurred." };
  }
}

export async function getServiceRequests(): Promise<ServiceRequest[]> {
  // In a real app, fetch from a database
  return Promise.resolve(mockServiceRequests);
}
