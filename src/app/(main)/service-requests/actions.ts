
"use server";

import { z } from "zod";
import { ServiceRequestSchema } from "./schema";
import type { ServiceRequest, Comment, StatusChange, User } from "@/lib/types";
import { AddCommentSchema } from "@/lib/schemas/comment-schema";
import { mockUsers } from "@/lib/mock-data"; // For user details

// This is a mock database. In a real application, you'd use a proper database.
// MOCK_CURRENT_USER_ID should be replaced with actual session user ID
const MOCK_CURRENT_USER_ID = "user123"; // Alice Member
const MOCK_ADMIN_USER_ID = "admin001"; // Site Admin

let mockServiceRequests: ServiceRequest[] = [
  {
    id: "sr1",
    title: "Leaky faucet in community kitchen",
    description: "The main faucet in the community kitchen sink is dripping constantly.",
    category: "maintenance",
    status: "pending",
    submittedDate: "2024-06-28",
    location: "Community Kitchen",
    submittedByUserId: "user123", 
    submittedByUserName: "Alice Member",
    assignedTo: "Maintenance Team",
    comments: [
        { id: "c1-sr1", parentId: "sr1", userId: "user123", userName: "Alice Member", text: "This is urgent, please fix ASAP!", date: "2024-06-28T10:00:00Z" }
    ],
    statusHistory: [
        { status: "pending", date: "2024-06-28T09:00:00Z", changedBy: "Alice Member" }
    ],
  },
  {
    id: "sr2",
    title: "Streetlight out on Elm Street",
    description: "The streetlight at the corner of Elm Street and Oak Avenue is not working.",
    category: "maintenance",
    status: "in-progress",
    submittedDate: "2024-06-25",
    location: "Corner of Elm St and Oak Ave",
    submittedByUserId: "user456",
    submittedByUserName: "Bob Homeowner",
    assignedTo: "City Services",
    comments: [],
    statusHistory: [
        { status: "pending", date: "2024-06-25T14:00:00Z", changedBy: "Bob Homeowner" },
        { status: "in-progress", date: "2024-06-26T10:00:00Z", changedBy: "Site Admin", notes: "Assigned to City Services for repair." }
    ],
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
    submittedByUserId: "user789", // Let's assume this user exists in mockUsers or we handle it
    submittedByUserName: "Robert Johnson",
    assignedTo: "Maintenance Team",
    comments: [],
    statusHistory: [
        { status: "pending", date: "2024-06-20T08:00:00Z", changedBy: "Robert Johnson" },
        { status: "in-progress", date: "2024-06-21T09:00:00Z", changedBy: "Maintenance Team Lead" },
        { status: "resolved", date: "2024-06-22T15:00:00Z", changedBy: "Maintenance Team Lead", notes: "Swing chain replaced and tested." }
    ],
  },
];

export async function submitServiceRequest(
  values: z.infer<typeof ServiceRequestSchema>,
  currentUser: User // Pass current user for submittedBy fields
) {
  try {
    const validatedData = ServiceRequestSchema.parse(values);
    
    const newRequest: ServiceRequest = {
      id: `sr${Date.now()}`, // Simple unique ID
      ...validatedData,
      status: "pending",
      submittedDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD
      submittedByUserId: currentUser.id,
      submittedByUserName: `${currentUser.firstName} ${currentUser.lastName}`,
      comments: [],
      statusHistory: [
        { status: "pending", date: new Date().toISOString(), changedBy: `${currentUser.firstName} ${currentUser.lastName}` }
      ],
    };
    
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

export async function getServiceRequestsForUser(userId: string): Promise<ServiceRequest[]> {
  return Promise.resolve([...mockServiceRequests].filter(req => req.submittedByUserId === userId)
    .sort((a,b) => new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime()));
}

export async function getAllServiceRequests(): Promise<ServiceRequest[]> {
  // For Admin
  return Promise.resolve([...mockServiceRequests]
    .sort((a,b) => new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime()));
}


export async function updateServiceRequestStatus(
  id: string,
  status: ServiceRequest['status'],
  changedByUserId: string, // User ID of admin making the change
  notes?: string
): Promise<{ success: boolean; message: string; request?: ServiceRequest }> {
  try {
    const requestIndex = mockServiceRequests.findIndex(req => req.id === id);
    if (requestIndex === -1) {
      return { success: false, message: "Service request not found." };
    }

    const adminUser = mockUsers.find(u => u.id === changedByUserId);
    const changedByName = adminUser ? `${adminUser.firstName} ${adminUser.lastName}` : "Admin";

    mockServiceRequests[requestIndex].status = status;
    mockServiceRequests[requestIndex].statusHistory.push({
      status,
      date: new Date().toISOString(),
      changedBy: changedByName,
      notes,
    });

    if (status === "resolved" || status === "closed") {
      mockServiceRequests[requestIndex].resolvedDate = new Date().toISOString().split('T')[0];
    } else {
      mockServiceRequests[requestIndex].resolvedDate = undefined;
    }
    
    console.log("Service request status updated:", mockServiceRequests[requestIndex]);
    return { success: true, message: "Status updated successfully.", request: { ...mockServiceRequests[requestIndex] } };
  } catch (error) {
    console.error("Error updating service request status:", error);
    return { success: false, message: "An unexpected error occurred while updating status." };
  }
}

export async function assignServiceRequest(
  requestId: string,
  assignedTo: string,
  adminUserId: string
): Promise<{ success: boolean; message: string; request?: ServiceRequest }> {
  const requestIndex = mockServiceRequests.findIndex(req => req.id === requestId);
  if (requestIndex === -1) {
    return { success: false, message: "Service request not found." };
  }
  
  const adminUser = mockUsers.find(u => u.id === adminUserId);
  const changedByName = adminUser ? `${adminUser.firstName} ${adminUser.lastName}` : "Admin";

  mockServiceRequests[requestIndex].assignedTo = assignedTo;
  // Optionally, add to status history or a separate assignment log
  mockServiceRequests[requestIndex].statusHistory.push({
    status: mockServiceRequests[requestIndex].status, // Keep current status
    date: new Date().toISOString(),
    changedBy: changedByName,
    notes: `Assigned to: ${assignedTo}`,
  });

  return { success: true, message: "Request assigned successfully.", request: { ...mockServiceRequests[requestIndex] } };
}

interface AddCommentPayload {
  text: string;
  userId: string;
  userName: string;
}

export async function addCommentToServiceRequest(
  requestId: string,
  payload: AddCommentPayload
): Promise<{ success: boolean; message: string; updatedRequest?: ServiceRequest; errors?: z.ZodError['formErrors']['fieldErrors'] }> {
  try {
    const validatedText = AddCommentSchema.parse({ text: payload.text });

    const requestIndex = mockServiceRequests.findIndex(req => req.id === requestId);
    if (requestIndex === -1) {
      return { success: false, message: "Service request not found." };
    }

    const newComment: Comment = {
      id: `comment-sr-${Date.now()}`,
      parentId: requestId,
      userId: payload.userId,
      userName: payload.userName,
      text: validatedText.text,
      date: new Date().toISOString(),
    };

    mockServiceRequests[requestIndex].comments.push(newComment);
    mockServiceRequests[requestIndex].comments.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Newest first

    return { success: true, message: "Comment added successfully.", updatedRequest: { ...mockServiceRequests[requestIndex] } };

  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, message: "Validation failed for comment.", errors: error.flatten().fieldErrors };
    }
    console.error("Error adding comment to service request:", error);
    return { success: false, message: "An unexpected error occurred." };
  }
}
