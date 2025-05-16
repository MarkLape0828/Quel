
"use server";

import { z } from "zod";
import { VehicleRegistrationSchema, type VehicleRegistrationFormValues } from "./schemas/vehicle-schema";
import type { VehicleRegistration, User } from "./types";
import { mockUsers, mockVehicleRegistrations } from "./mock-data";
import { createNotification } from "./notification-actions";

export async function registerVehicle(
  values: VehicleRegistrationFormValues,
  currentUser: User
): Promise<{ success: boolean; message: string; vehicle?: VehicleRegistration; errors?: z.ZodError['formErrors']['fieldErrors'] }> {
  try {
    const validatedData = VehicleRegistrationSchema.parse(values);

    // Check for duplicate license plate for the same user (optional, but good practice)
    const existingVehicle = mockVehicleRegistrations.find(
      v => v.userId === currentUser.id && v.licensePlate.toLowerCase() === validatedData.licensePlate.toLowerCase() && v.status !== 'inactive'
    );
    if (existingVehicle) {
        return { success: false, message: "This license plate is already registered to your account.", errors: {licensePlate: ["This license plate is already registered."]}};
    }

    const newVehicle: VehicleRegistration = {
      id: `vr${Date.now()}`,
      userId: currentUser.id,
      userName: `${currentUser.firstName} ${currentUser.lastName}`,
      ...validatedData,
      registeredAt: new Date().toISOString(),
      status: "pending_permit", // Initial status
    };

    mockVehicleRegistrations.unshift(newVehicle);

    // Notify admin (optional)
    const adminUser = mockUsers.find(u => u.role === 'admin');
    if (adminUser) {
      await createNotification({
        userId: adminUser.id,
        title: "New Vehicle Registered",
        message: `${currentUser.firstName} ${currentUser.lastName} registered a ${newVehicle.make} ${newVehicle.model}.`,
        type: "vehicle_registration",
        link: "/admin/vehicle-registrations",
      });
    }

    return { success: true, message: "Vehicle registered successfully! Awaiting permit assignment.", vehicle: newVehicle };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, message: "Validation failed.", errors: error.flatten().fieldErrors };
    }
    console.error("Error registering vehicle:", error);
    return { success: false, message: "An unexpected error occurred." };
  }
}

export async function getVehiclesForUser(userId: string): Promise<VehicleRegistration[]> {
  return Promise.resolve(
    [...mockVehicleRegistrations]
      .filter(vehicle => vehicle.userId === userId && vehicle.status !== 'inactive')
      .sort((a, b) => new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime())
  );
}

export async function getAllVehicleRegistrations(): Promise<VehicleRegistration[]> {
  // For Admin
  return Promise.resolve(
    [...mockVehicleRegistrations].sort((a, b) => new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime())
  );
}

export async function issueVehiclePermit(
  vehicleId: string,
  permitNumber: string,
  adminUserId: string
): Promise<{ success: boolean; message: string; vehicle?: VehicleRegistration }> {
  const vehicleIndex = mockVehicleRegistrations.findIndex(v => v.id === vehicleId);
  if (vehicleIndex === -1) {
    return { success: false, message: "Vehicle not found." };
  }

  const adminUser = mockUsers.find(u => u.id === adminUserId);
  if (!adminUser) {
    return { success: false, message: "Admin user not found." };
  }

  if (!permitNumber.trim()) {
    return { success: false, message: "Permit number cannot be empty." };
  }

  mockVehicleRegistrations[vehicleIndex].permitNumber = permitNumber;
  mockVehicleRegistrations[vehicleIndex].permitIssuedAt = new Date().toISOString();
  mockVehicleRegistrations[vehicleIndex].status = 'active'; // Or 'permit_issued'

  // Notify user
  await createNotification({
    userId: mockVehicleRegistrations[vehicleIndex].userId,
    title: "Vehicle Permit Issued",
    message: `Permit ${permitNumber} has been issued for your ${mockVehicleRegistrations[vehicleIndex].make} ${mockVehicleRegistrations[vehicleIndex].model}.`,
    type: "vehicle_registration",
    link: "/vehicle-registration",
  });

  return { success: true, message: `Permit ${permitNumber} issued.`, vehicle: { ...mockVehicleRegistrations[vehicleIndex] } };
}

export async function deleteVehicleRegistration(
  vehicleId: string,
  requestingUserId: string
): Promise<{ success: boolean; message: string }> {
  const vehicleIndex = mockVehicleRegistrations.findIndex(v => v.id === vehicleId);
  if (vehicleIndex === -1) {
    return { success: false, message: "Vehicle not found." };
  }

  const vehicle = mockVehicleRegistrations[vehicleIndex];
  const requester = mockUsers.find(u => u.id === requestingUserId);

  if (!requester) return { success: false, message: "Requesting user not found."};

  // User can delete their own vehicle, Admin can delete any
  if (vehicle.userId !== requestingUserId && requester.role !== 'admin') {
    return { success: false, message: "You do not have permission to delete this vehicle registration."};
  }
  
  // Instead of actually deleting, mark as inactive for history
  // mockVehicleRegistrations.splice(vehicleIndex, 1); // Actual deletion
  mockVehicleRegistrations[vehicleIndex].status = 'inactive';
  mockVehicleRegistrations[vehicleIndex].permitNumber = undefined; // Clear permit
  mockVehicleRegistrations[vehicleIndex].permitIssuedAt = undefined;

  return { success: true, message: "Vehicle registration removed successfully." };
}
