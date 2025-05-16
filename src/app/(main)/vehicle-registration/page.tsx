
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { VehicleRegistration, User, VehicleStatus } from "@/lib/types";
import { RegisterVehicleForm } from "./components/register-vehicle-form";
import { getVehiclesForUser, deleteVehicleRegistration } from "@/lib/vehicle-actions";
import { mockUsers } from '@/lib/mock-data'; 
import { CarFront, Trash2, ShieldCheck, AlertTriangle, Hourglass } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const getStatusBadge = (status: VehicleStatus, permitNumber?: string) => {
  switch (status) {
    case 'pending_permit': return <Badge variant="outline" className="text-orange-500 border-orange-500"><Hourglass className="mr-1 h-3 w-3" />Pending Permit</Badge>;
    case 'active': return <Badge className="bg-green-500 hover:bg-green-600 text-primary-foreground"><ShieldCheck className="mr-1 h-3 w-3" />Active ({permitNumber || 'N/A'})</Badge>;
    case 'permit_issued': return <Badge className="bg-blue-500 hover:bg-blue-600 text-primary-foreground"><ShieldCheck className="mr-1 h-3 w-3" />Permit Issued ({permitNumber || 'N/A'})</Badge>;
    case 'inactive': return <Badge variant="secondary"><AlertTriangle className="mr-1 h-3 w-3" />Inactive</Badge>;
    default: return <Badge>{status}</Badge>;
  }
};

export default function VehicleRegistrationPage() {
  const [vehicles, setVehicles] = useState<VehicleRegistration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  const currentUserId = "user123"; // Alice Member
  const currentUser = mockUsers.find(u => u.id === currentUserId) || mockUsers[0];

  const fetchVehicles = useCallback(async () => {
    if (!currentUser) return;
    setIsLoading(true);
    const fetchedVehicles = await getVehiclesForUser(currentUser.id);
    setVehicles(fetchedVehicles);
    setIsLoading(false);
  }, [currentUser]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const handleNewVehicleRegistered = (newVehicle: VehicleRegistration) => {
    setVehicles(prevVehicles => [newVehicle, ...prevVehicles].sort((a,b) => new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime()));
  };
  
  const handleDeleteVehicle = async (vehicleId: string) => {
    if (!confirm("Are you sure you want to remove this vehicle registration?")) return;
    const result = await deleteVehicleRegistration(vehicleId, currentUser.id);
    if (result.success) {
      toast({ title: "Vehicle Removed", description: result.message });
      fetchVehicles(); // Refresh list
    } else {
      toast({ title: "Error", description: result.message, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><CarFront className="mr-2 h-6 w-6 text-primary" /> Register a New Vehicle</CardTitle>
          <CardDescription>Add your vehicle details to the HOA registry.</CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterVehicleForm currentUser={currentUser} onVehicleRegistered={handleNewVehicleRegistered} />
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>My Registered Vehicles</CardTitle>
          <CardDescription>Manage your registered vehicles and their permit status.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading vehicles...</p>
          ) : vehicles.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">You have not registered any vehicles yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Make & Model</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>Color</TableHead>
                    <TableHead>License Plate</TableHead>
                    <TableHead>Status / Permit</TableHead>
                    <TableHead>Registered On</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vehicles.map((vehicle) => (
                    <TableRow key={vehicle.id}>
                      <TableCell className="font-medium">{vehicle.make} {vehicle.model}</TableCell>
                      <TableCell>{vehicle.year}</TableCell>
                      <TableCell>{vehicle.color}</TableCell>
                      <TableCell>{vehicle.licensePlate}</TableCell>
                      <TableCell>{getStatusBadge(vehicle.status, vehicle.permitNumber)}</TableCell>
                      <TableCell>{format(new Date(vehicle.registeredAt), "PPp")}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => handleDeleteVehicle(vehicle.id)} title="Remove Vehicle">
                           <Trash2 className="mr-1 h-3.5 w-3.5" /> Remove
                        </Button>
                        {/* Edit functionality can be added here */}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        {vehicles.length > 0 && (
          <CardFooter>
            <p className="text-xs text-muted-foreground">Displaying {vehicles.length} registered vehicles.</p>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
