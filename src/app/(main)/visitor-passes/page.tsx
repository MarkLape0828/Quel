
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { VisitorPassRequest, User, VisitorPassStatus } from "@/lib/types";
import { RequestPassForm } from "./components/request-pass-form";
import { getVisitorPassesForUser, cancelVisitorPass } from "@/lib/visitor-pass-actions";
import { mockUsers } from '@/lib/mock-data'; 
import { Contact, CalendarDays, Clock, CarFront, Hourglass, CheckCircle2, XCircle, Ban, Trash2 } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const getStatusBadge = (status: VisitorPassStatus) => {
  switch (status) {
    case 'pending': return <Badge variant="outline" className="text-orange-500 border-orange-500"><Hourglass className="mr-1 h-3 w-3" />Pending</Badge>;
    case 'approved': return <Badge className="bg-green-500 hover:bg-green-600 text-primary-foreground"><CheckCircle2 className="mr-1 h-3 w-3" />Approved</Badge>;
    case 'rejected': return <Badge variant="destructive"><XCircle className="mr-1 h-3 w-3" />Rejected</Badge>;
    case 'cancelled': return <Badge variant="secondary"><Ban className="mr-1 h-3 w-3" />Cancelled</Badge>;
    case 'expired': return <Badge variant="outline" className="text-muted-foreground"><Clock className="mr-1 h-3 w-3" />Expired</Badge>;
    default: return <Badge>{status}</Badge>;
  }
};

export default function VisitorPassesPage() {
  const [passes, setPasses] = useState<VisitorPassRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  const currentUserId = "user123"; // Alice Member
  const currentUser = mockUsers.find(u => u.id === currentUserId) || mockUsers[0];

  const fetchPasses = useCallback(async () => {
    if (!currentUser) return;
    setIsLoading(true);
    const fetchedPasses = await getVisitorPassesForUser(currentUser.id);
    setPasses(fetchedPasses);
    setIsLoading(false);
  }, [currentUser]);

  useEffect(() => {
    fetchPasses();
  }, [fetchPasses]);

  const handleNewPassRequested = (newPass: VisitorPassRequest) => {
    setPasses(prevPasses => [newPass, ...prevPasses].sort((a,b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime()));
  };

  const handleCancelPass = async (passId: string) => {
    if (!confirm("Are you sure you want to cancel this visitor pass request?")) return;
    const result = await cancelVisitorPass(passId, currentUser.id);
    if (result.success) {
      toast({ title: "Pass Cancelled", description: result.message });
      fetchPasses(); // Refresh list
    } else {
      toast({ title: "Error", description: result.message, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><Contact className="mr-2 h-6 w-6 text-primary" /> Request a New Visitor Pass</CardTitle>
          <CardDescription>Fill out the form below to request a pass for your visitor.</CardDescription>
        </CardHeader>
        <CardContent>
          <RequestPassForm currentUser={currentUser} onPassRequested={handleNewPassRequested} />
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>My Visitor Pass Requests</CardTitle>
          <CardDescription>Track the status of your submitted visitor pass requests.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading visitor passes...</p>
          ) : passes.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">You have not requested any visitor passes yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Visitor Name</TableHead>
                    <TableHead>Visit Date</TableHead>
                    <TableHead>Time / Duration</TableHead>
                    <TableHead>Vehicle Plate</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Requested On</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {passes.map((pass) => (
                    <TableRow key={pass.id}>
                      <TableCell className="font-medium">{pass.visitorName}</TableCell>
                      <TableCell>{format(new Date(pass.visitDate + 'T00:00:00'), "PPP")}</TableCell>
                      <TableCell>
                        {pass.visitStartTime || "Anytime"}
                        {pass.durationHours && ` for ${pass.durationHours}h`}
                      </TableCell>
                      <TableCell>{pass.vehiclePlate || "N/A"}</TableCell>
                      <TableCell>{getStatusBadge(pass.status)}</TableCell>
                      <TableCell>{format(new Date(pass.requestedAt), "PPp")}</TableCell>
                      <TableCell className="text-right">
                        {pass.status === 'pending' && (
                          <Button variant="outline" size="sm" onClick={() => handleCancelPass(pass.id)} title="Cancel Request">
                            <Trash2 className="mr-1 h-3.5 w-3.5" /> Cancel
                          </Button>
                        )}
                         {pass.notes && <p className="text-xs text-muted-foreground mt-1">Admin Note: {pass.notes}</p>}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        {passes.length > 0 && (
          <CardFooter>
            <p className="text-xs text-muted-foreground">Displaying {passes.length} visitor pass requests.</p>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
