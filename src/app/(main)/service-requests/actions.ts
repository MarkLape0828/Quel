
"use server";

import { z } from "zod";
import { ServiceRequestSchema } from "./schema";
import type { ServiceRequest } from "@/lib/types";

// This is a mock database. In a real application, you'd use a proper database.
let mockServiceRequests: ServiceRequest[] = [
  {
    id: "sr1",
    title: "Leaky faucet in community kitchen",
    description: "The main faucet in the community kitchen sink is dripping constantly.",
    category: "maintenance",
    status: "pending",
    submittedDate: "2024-06-28",
    location: "Community Kitchen",
    submittedBy: "Jane Doe (user123)", // Assuming Jane Doe is user123
    assignedTo: "Maintenance Team",
  },
  {
    id: "sr2",
    title: "Streetlight out on Elm Street",
    description: "The streetlight at the corner of Elm Street and Oak Avenue is not working.",
    category: "maintenance",
    status: "in-progress",
    submittedDate: "2024-06-25",
    location: "Corner of Elm St and Oak Ave",
    submittedBy: "John Smith (user456)", // Assuming John Smith is user456
    assignedTo: "City Services",
  },
  {
    id: "sr3",
    title: "Broken swing in playground",
    description: "One of the swings in the main playground has a broken chain.",
    category: "maintenance",
    status: "resolved",
    submittedDate: "2024-06-20",
    resolvedDate: "2024-06-22",
    location: "Main Playground",
    submittedBy: "Alice Brown (user789)",
    assignedTo: "Maintenance Team",
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
    
    // Add to the beginning of the list to show newest first
    mockServiceRequests = [newRequest, ...mockServiceRequests];

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

export async function getServiceRequests(userId?: string): Promise<ServiceRequest[]> {
  // In a real app, fetch from a database
  // Return a copy to prevent direct modification of the mock array outside actions
  if (userId) {
    return Promise.resolve([...mockServiceRequests].filter(req => req.submittedBy?.includes(userId)));
  }
  return Promise.resolve([...mockServiceRequests]);
}

export async function updateServiceRequestStatus(
  id: string,
  status: ServiceRequest['status']
): Promise<{ success: boolean; message: string; request?: ServiceRequest }> {
  try {
    const requestIndex = mockServiceRequests.findIndex(req => req.id === id);
    if (requestIndex === -1) {
      return { success: false, message: "Service request not found." };
    }

    mockServiceRequests[requestIndex].status = status;
    if (status === "resolved" || status === "closed") {
      mockServiceRequests[requestIndex].resolvedDate = new Date().toISOString().split('T')[0];
    } else {
      mockServiceRequests[requestIndex].resolvedDate = undefined;
    }
    
    console.log("Service request status updated:", mockServiceRequests[requestIndex]);
    return { success: true, message: "Status updated successfully.", request: mockServiceRequests[requestIndex] };
  } catch (error) {
    console.error("Error updating service request status:", error);
    return { success: false, message: "An unexpected error occurred while updating status." };
  }
}
