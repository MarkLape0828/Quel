
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { VehicleRegistration, User, VehicleStatus } from "@/lib/types";
import { getAllVehicleRegistrations, issueVehiclePermit, deleteVehicleRegistration } from "@/lib/vehicle-actions";
import { mockUsers } from '@/lib/mock-data';
import { Car, ScrollText, ShieldCheck, AlertTriangle, Hourglass, Trash2 } from "lucide-react";
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

export default function AdminVehicleRegistrationsPage() {
  const [vehicles, setVehicles] = useState<VehicleRegistration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleRegistration | null>(null);
  const [permitNumberInput, setPermitNumberInput] = useState("");

  const currentAdminId = "admin001"; // Site Admin

  const fetchVehicles = useCallback(async () => {
    setIsLoading(true);
    const fetchedVehicles = await getAllVehicleRegistrations();
    setVehicles(fetchedVehicles);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const openIssuePermitModal = (vehicle: VehicleRegistration) => {
    setSelectedVehicle(vehicle);
    setPermitNumberInput(vehicle.permitNumber || `P${Math.floor(1000 + Math.random() * 9000)}`); // Pre-fill or suggest
  };

  const handleIssuePermit = async () => {
    if (!selectedVehicle || !permitNumberInput.trim()) {
      toast({ title: "Error", description: "Permit number cannot be empty.", variant: "destructive"});
      return;
    }

    const result = await issueVehiclePermit(selectedVehicle.id, permitNumberInput.trim(), currentAdminId);

    if (result.success && result.vehicle) {
      toast({ title: "Permit Issued", description: `Permit ${result.vehicle.permitNumber} issued for ${result.vehicle.make} ${result.vehicle.model}.` });
      fetchVehicles();
      setSelectedVehicle(null);
      setPermitNumberInput("");
    } else {
      toast({ title: "Error", description: result.message || "Failed to issue permit.", variant: "destructive" });
    }
  };
  
  const handleDeleteVehicle = async (vehicleId: string, vehicleInfo: string) => {
    if (!confirm(`Are you sure you want to remove the registration for ${vehicleInfo}? This will mark it as inactive.`)) return;
    const result = await deleteVehicleRegistration(vehicleId, currentAdminId);
    if (result.success) {
      toast({ title: "Vehicle Registration Removed", description: result.message });
      fetchVehicles(); 
    } else {
      toast({ title: "Error", description: result.message, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><Car className="mr-2 h-6 w-6 text-primary" /> Manage Vehicle Registrations</CardTitle>
          <CardDescription>View all registered vehicles and manage their permits.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading vehicle registrations...</p>
          ) : vehicles.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">No vehicles have been registered yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Resident</TableHead>
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
                    <TableRow key={vehicle.id} className={vehicle.status === 'inactive' ? 'opacity-60' : ''}>
                      <TableCell>{vehicle.userName}</TableCell>
                      <TableCell className="font-medium">{vehicle.make} {vehicle.model}</TableCell>
                      <TableCell>{vehicle.year}</TableCell>
                      <TableCell>{vehicle.color}</TableCell>
                      <TableCell>{vehicle.licensePlate}</TableCell>
                      <TableCell>{getStatusBadge(vehicle.status, vehicle.permitNumber)}</TableCell>
                      <TableCell>{format(new Date(vehicle.registeredAt), "PPp")}</TableCell>
                      <TableCell className="text-right space-x-1">
                        {vehicle.status === 'pending_permit' && (
                          <Button variant="outline" size="sm" onClick={() => openIssuePermitModal(vehicle)}>
                            <ScrollText className="mr-1 h-3.5 w-3.5" /> Issue Permit
                          </Button>
                        )}
                        {vehicle.status === 'active' && vehicle.permitNumber && (
                           <Button variant="outline" size="sm" onClick={() => openIssuePermitModal(vehicle)}>
                             <ScrollText className="mr-1 h-3.5 w-3.5" /> Re-issue Permit
                           </Button>
                        )}
                         {vehicle.status !== 'inactive' && (
                           <Button variant="destructive" size="sm" onClick={() => handleDeleteVehicle(vehicle.id, `${vehicle.make} ${vehicle.model} (${vehicle.licensePlate})`)} title="Remove Vehicle Registration">
                             <Trash2 className="h-3.5 w-3.5" />
                           </Button>
                         )}
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
            <p className="text-xs text-muted-foreground">Displaying {vehicles.length} vehicle registrations.</p>
          </CardFooter>
        )}
      </Card>

      {/* Issue Permit Modal */}
      <Dialog open={!!selectedVehicle} onOpenChange={() => { setSelectedVehicle(null); setPermitNumberInput(""); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Issue Permit for {selectedVehicle?.make} {selectedVehicle?.model}</DialogTitle>
            <DialogDescription>
              Resident: {selectedVehicle?.userName} | Plate: {selectedVehicle?.licensePlate}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-2">
            <Label htmlFor="permitNumber">Permit Number</Label>
            <Input 
              id="permitNumber" 
              value={permitNumberInput} 
              onChange={(e) => setPermitNumberInput(e.target.value)}
              placeholder="Enter permit number"
            />
          </div>
          <DialogFooter>
            <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
            <Button type="button" onClick={handleIssuePermit}>
              {selectedVehicle?.permitNumber ? 'Update Permit' : 'Issue Permit'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
