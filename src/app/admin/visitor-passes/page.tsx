
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { VisitorPassRequest, User, VisitorPassStatus } from "@/lib/types";
import { getAllVisitorPasses, updateVisitorPassStatus } from "@/lib/visitor-pass-actions";
import { mockUsers } from '@/lib/mock-data';
import { Users2, CalendarDays, CheckCircle2, XCircle, Hourglass, Ban } from "lucide-react";
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

export default function AdminVisitorPassesPage() {
  const [passes, setPasses] = useState<VisitorPassRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  const [selectedPass, setSelectedPass] = useState<VisitorPassRequest | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [adminNotes, setAdminNotes] = useState("");

  const currentAdminId = "admin001"; // Site Admin

  const fetchPasses = useCallback(async () => {
    setIsLoading(true);
    const fetchedPasses = await getAllVisitorPasses();
    setPasses(fetchedPasses);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchPasses();
  }, [fetchPasses]);

  const openActionModal = (pass: VisitorPassRequest, type: 'approve' | 'reject') => {
    setSelectedPass(pass);
    setActionType(type);
    setAdminNotes(pass.notes || "");
  };

  const handleProcessPass = async () => {
    if (!selectedPass || !actionType) return;

    const newStatus = actionType === 'approve' ? 'approved' : 'rejected';
    const result = await updateVisitorPassStatus(selectedPass.id, newStatus, currentAdminId, adminNotes);

    if (result.success && result.pass) {
      toast({ title: "Success", description: `Visitor pass for ${result.pass.visitorName} has been ${newStatus}.` });
      fetchPasses();
      setSelectedPass(null);
      setActionType(null);
      setAdminNotes("");
    } else {
      toast({ title: "Error", description: result.message || "Failed to update pass status.", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><Users2 className="mr-2 h-6 w-6 text-primary" /> Manage Visitor Pass Requests</CardTitle>
          <CardDescription>Review and process visitor pass requests submitted by residents.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading visitor passes...</p>
          ) : passes.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">No visitor pass requests found.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Resident</TableHead>
                    <TableHead>Visitor Name</TableHead>
                    <TableHead>Visit Date & Time</TableHead>
                    <TableHead>Vehicle Plate</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Requested On</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {passes.map((pass) => (
                    <TableRow key={pass.id}>
                      <TableCell>{pass.userName}</TableCell>
                      <TableCell className="font-medium">{pass.visitorName}</TableCell>
                      <TableCell>
                        {format(new Date(pass.visitDate + 'T00:00:00'), "PPP")}
                        {pass.visitStartTime && ` at ${pass.visitStartTime}`}
                        {pass.durationHours && ` for ${pass.durationHours}h`}
                      </TableCell>
                      <TableCell>{pass.vehiclePlate || "N/A"}</TableCell>
                      <TableCell>{getStatusBadge(pass.status)}</TableCell>
                      <TableCell>{format(new Date(pass.requestedAt), "PPp")}</TableCell>
                      <TableCell className="text-right space-x-1">
                        {pass.status === 'pending' && (
                          <>
                            <Button variant="outline" size="sm" className="text-green-600 border-green-600 hover:bg-green-50 hover:text-green-700" onClick={() => openActionModal(pass, 'approve')}>
                              Approve
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => openActionModal(pass, 'reject')}>
                              Reject
                            </Button>
                          </>
                        )}
                        {(pass.status === 'approved' || pass.status === 'rejected') && pass.processedByUserId && (
                             <p className="text-xs text-muted-foreground">
                                Processed by {mockUsers.find(u=>u.id === pass.processedByUserId)?.firstName || 'Admin'} on {format(new Date(pass.processedAt!), "PP")}
                                {pass.notes && <><br/>Note: {pass.notes}</>}
                            </p>
                        )}
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

      {/* Action Modal */}
      <Dialog open={!!selectedPass && !!actionType} onOpenChange={() => { setSelectedPass(null); setActionType(null); setAdminNotes(""); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{actionType === 'approve' ? 'Approve' : 'Reject'} Visitor Pass for {selectedPass?.visitorName}</DialogTitle>
            <DialogDescription>
              For {selectedPass?.userName} on {selectedPass ? format(new Date(selectedPass.visitDate + 'T00:00:00'), "PPP") : ''}.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-2">
            <Label htmlFor="adminNotes">Notes (Optional for approval, recommended for rejection)</Label>
            <Textarea 
              id="adminNotes" 
              value={adminNotes} 
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder={actionType === 'reject' ? "Reason for rejection..." : "Optional notes..."}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
            <Button 
              type="button" 
              onClick={handleProcessPass}
              variant={actionType === 'reject' ? 'destructive' : 'default'}
            >
              {actionType === 'approve' ? 'Approve Pass' : 'Reject Pass'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

