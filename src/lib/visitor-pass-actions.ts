
"use server";

import { z } from "zod";
import { VisitorPassRequestSchema, type VisitorPassFormValues } from "./schemas/visitor-pass-schema";
import type { VisitorPassRequest, VisitorPassStatus, User } from "./types";
import { mockUsers, mockVisitorPasses } from "./mock-data"; // Assuming mockUsers is available
import { createNotification } from "./notification-actions";
import { format } from "date-fns";

export async function requestVisitorPass(
  values: VisitorPassFormValues,
  currentUser: User
): Promise<{ success: boolean; message: string; pass?: VisitorPassRequest; errors?: z.ZodError['formErrors']['fieldErrors'] }> {
  try {
    const validatedData = VisitorPassRequestSchema.parse(values);

    const newPass: VisitorPassRequest = {
      id: `vp${Date.now()}`,
      userId: currentUser.id,
      userName: `${currentUser.firstName} ${currentUser.lastName}`,
      visitorName: validatedData.visitorName,
      visitDate: format(validatedData.visitDate, "yyyy-MM-dd"),
      visitStartTime: validatedData.visitStartTime,
      durationHours: validatedData.durationHours,
      vehiclePlate: validatedData.vehiclePlate,
      status: "pending",
      requestedAt: new Date().toISOString(),
    };

    mockVisitorPasses.unshift(newPass);

    // Notify admin (optional)
    const adminUser = mockUsers.find(u => u.role === 'admin');
    if (adminUser) {
      await createNotification({
        userId: adminUser.id,
        title: "New Visitor Pass Request",
        message: `${currentUser.firstName} ${currentUser.lastName} requested a pass for ${newPass.visitorName}.`,
        type: "visitor_pass",
        link: "/admin/visitor-passes",
      });
    }

    return { success: true, message: "Visitor pass requested successfully!", pass: newPass };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, message: "Validation failed.", errors: error.flatten().fieldErrors };
    }
    console.error("Error requesting visitor pass:", error);
    return { success: false, message: "An unexpected error occurred." };
  }
}

export async function getVisitorPassesForUser(userId: string): Promise<VisitorPassRequest[]> {
  return Promise.resolve(
    [...mockVisitorPasses]
      .filter(pass => pass.userId === userId)
      .sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime())
  );
}

export async function getAllVisitorPasses(): Promise<VisitorPassRequest[]> {
  // For Admin
  return Promise.resolve(
    [...mockVisitorPasses].sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime())
  );
}

export async function updateVisitorPassStatus(
  passId: string,
  status: VisitorPassStatus,
  adminUserId: string,
  notes?: string
): Promise<{ success: boolean; message: string; pass?: VisitorPassRequest }> {
  const passIndex = mockVisitorPasses.findIndex(p => p.id === passId);
  if (passIndex === -1) {
    return { success: false, message: "Visitor pass not found." };
  }

  const adminUser = mockUsers.find(u => u.id === adminUserId);
  if (!adminUser) {
    return { success: false, message: "Admin user not found." };
  }

  mockVisitorPasses[passIndex].status = status;
  mockVisitorPasses[passIndex].processedByUserId = adminUserId;
  mockVisitorPasses[passIndex].processedAt = new Date().toISOString();
  mockVisitorPasses[passIndex].notes = notes;

  // Notify user
  await createNotification({
    userId: mockVisitorPasses[passIndex].userId,
    title: `Visitor Pass ${status.charAt(0).toUpperCase() + status.slice(1)}`,
    message: `Your visitor pass request for ${mockVisitorPasses[passIndex].visitorName} has been ${status}. ${notes ? 'Notes: ' + notes : ''}`,
    type: "visitor_pass",
    link: "/visitor-passes",
  });

  return { success: true, message: `Pass status updated to ${status}.`, pass: { ...mockVisitorPasses[passIndex] } };
}

export async function cancelVisitorPass(
  passId: string,
  userId: string
): Promise<{ success: boolean; message: string }> {
  const passIndex = mockVisitorPasses.findIndex(p => p.id === passId && p.userId === userId);
  if (passIndex === -1) {
    return { success: false, message: "Visitor pass not found or you do not have permission to cancel it." };
  }

  if (mockVisitorPasses[passIndex].status !== 'pending') {
    return { success: false, message: "Only pending visitor passes can be cancelled." };
  }

  mockVisitorPasses[passIndex].status = 'cancelled';
  // mockVisitorPasses[passIndex].notes = "Cancelled by user."; // Optional

  return { success: true, message: "Visitor pass cancelled successfully." };
}
