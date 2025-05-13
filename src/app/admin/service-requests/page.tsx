
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ServiceRequest, User, StatusChange } from "@/lib/types";
import { getAllServiceRequests, updateServiceRequestStatus, assignServiceRequest } from "@/app/(main)/service-requests/actions";
import { mockUsers } from '@/lib/mock-data';
import { AlertCircle, CheckCircle2, Clock, Settings2, MessageSquare, Edit, Info, CalendarDays, User as UserIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { ServiceRequestComments } from '@/app/(main)/service-requests/components/service-request-comments'; // Re-use

const StatusBadge = ({ status, history }: { status: ServiceRequest['status'], history: StatusChange[] }) => {
  let icon;
  let badgeClasses = "";
  let text = "";

  switch (status) {
    case 'pending':
      icon = <Clock className="mr-1 h-3 w-3" />;
      badgeClasses = "text-orange-500 border-orange-500";
      text = "Pending";
      break;
    case 'in-progress':
      icon = <AlertCircle className="mr-1 h-3 w-3" />;
      badgeClasses = "text-blue-500 border-blue-500";
      text = "In Progress";
      break;
    case 'resolved':
      icon = <CheckCircle2 className="mr-1 h-3 w-3" />;
      badgeClasses = "bg-green-500 hover:bg-green-600 text-primary-foreground";
      text = "Resolved";
      break;
    case 'closed':
      icon = <CheckCircle2 className="mr-1 h-3 w-3" />;
      badgeClasses = "text-gray-700 border-gray-400";
      text = "Closed";
      break;
    default:
      icon = <Info className="mr-1 h-3 w-3" />;
      text = status;
  }
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Badge variant="outline" className={badgeClasses + " cursor-pointer"}>
          {icon}{text}
        </Badge>
      </PopoverTrigger>
      <PopoverContent className="w-80 z-50"> {/* Added z-index */}
        <div className="space-y-2">
          <h4 className="font-medium leading-none">Status Timeline</h4>
          <ul className="text-sm text-muted-foreground space-y-1.5 max-h-60 overflow-y-auto">
            {history.length > 0 ? history.map((entry, index) => (
              <li key={index} className="border-l-2 pl-2 border-primary/50">
                <p className="font-semibold capitalize text-foreground">{entry.status}</p>
                <p className="text-xs">By: {entry.changedBy}</p>
                <p className="text-xs">On: {new Date(entry.date).toLocaleString()}</p>
                {entry.notes && <p className="text-xs italic">Notes: {entry.notes}</p>}
              </li>
            )).reverse() : <li>No history available.</li>}
          </ul>
        </div>
      </PopoverContent>
    </Popover>
  );
};


export default function AdminServiceRequestsPage() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  const [selectedRequestForComments, setSelectedRequestForComments] = useState<ServiceRequest | null>(null);
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);
  
  const [editingAssignment, setEditingAssignment] = useState<ServiceRequest | null>(null);
  const [assignmentValue, setAssignmentValue] = useState("");

  // MOCK: Get current admin user
  const currentAdminId = "admin001"; // Site Admin
  const currentAdminUser = mockUsers.find(u => u.id === currentAdminId) || mockUsers[0];


  const fetchRequests = useCallback(async () => {
    setIsLoading(true);
    const fetchedRequests = await getAllServiceRequests(); 
    setRequests(fetchedRequests);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleStatusChange = async (requestId: string, newStatus: ServiceRequest['status'], notes?: string) => {
    const originalRequests = [...requests];
    setRequests(prevRequests => 
      prevRequests.map(req => 
        req.id === requestId ? { ...req, status: newStatus } : req
      )
    );

    const result = await updateServiceRequestStatus(requestId, newStatus, currentAdminUser.id, notes);
    if (result.success && result.request) {
      toast({
        title: "Status Updated",
        description: `Request "${result.request.title}" is now ${newStatus}.`,
      });
      fetchRequests(); 
    } else {
      toast({
        title: "Error",
        description: result.message || "Failed to update status.",
        variant: "destructive",
      });
      setRequests(originalRequests); 
    }
  };

  const handleOpenCommentsModal = (req: ServiceRequest) => {
    setSelectedRequestForComments(req);
    setIsCommentsModalOpen(true);
  };
  
  const handleCommentAdded = (updatedRequest: ServiceRequest) => {
    setRequests(prevReqs => prevReqs.map(r => r.id === updatedRequest.id ? updatedRequest : r));
    if (selectedRequestForComments && selectedRequestForComments.id === updatedRequest.id) {
      setSelectedRequestForComments(updatedRequest);
    }
  };
  
  const handleOpenAssignModal = (req: ServiceRequest) => {
    setEditingAssignment(req);
    setAssignmentValue(req.assignedTo || "");
  };

  const handleAssignSubmit = async () => {
    if (!editingAssignment) return;
    const result = await assignServiceRequest(editingAssignment.id, assignmentValue, currentAdminUser.id);
    if (result.success && result.request) {
        toast({ title: "Request Assigned", description: `Request "${result.request.title}" assigned to ${assignmentValue}.` });
        fetchRequests();
        setEditingAssignment(null);
    } else {
        toast({ title: "Error", description: result.message || "Failed to assign request.", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><Settings2 className="mr-2 h-6 w-6 text-primary" />Manage Service Requests</CardTitle>
          <CardDescription>View, track, and update the status of all submitted service requests. Assign tasks and add comments.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading service requests...</p>
          ) : requests.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">No service requests have been submitted yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Submitted By</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((req) => (
                    <TableRow key={req.id}>
                      <TableCell className="font-mono text-xs truncate" title={req.id}>{req.id.substring(0,8)}...</TableCell>
                      <TableCell className="font-medium max-w-[200px] truncate" title={req.title}>{req.title}</TableCell>
                      <TableCell className="max-w-[150px] truncate" title={req.submittedByUserName}>{req.submittedByUserName}</TableCell>
                      <TableCell>{new Date(req.submittedDate).toLocaleDateString()}</TableCell>
                      <TableCell><StatusBadge status={req.status} history={req.statusHistory} /></TableCell>
                      <TableCell className="max-w-[150px] truncate" title={req.assignedTo || "Unassigned"}>
                        {req.assignedTo || "Unassigned"}
                        <Button variant="ghost" size="sm" className="ml-1 p-1 h-auto" onClick={() => handleOpenAssignModal(req)}>
                            <Edit className="h-3 w-3"/>
                        </Button>
                      </TableCell>
                      <TableCell className="text-right space-x-1">
                        <Select
                          value={req.status}
                          onValueChange={(newStatus: ServiceRequest['status']) => handleStatusChange(req.id, newStatus)}
                        >
                          <SelectTrigger className="w-[130px] h-8 text-xs">
                            <SelectValue placeholder="Update" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="resolved">Resolved</SelectItem>
                            <SelectItem value="closed">Closed</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button variant="outline" size="sm" onClick={() => handleOpenCommentsModal(req)}>
                           <MessageSquare className="mr-1.5 h-3.5 w-3.5" /> Comments ({req.comments.length})
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        {requests.length > 0 && (
            <CardFooter>
                <p className="text-xs text-muted-foreground">Displaying {requests.length} service requests.</p>
            </CardFooter>
        )}
      </Card>

      {/* Comments Modal */}
      {selectedRequestForComments && (
        <Dialog open={isCommentsModalOpen} onOpenChange={(isOpen) => {
            setIsCommentsModalOpen(isOpen);
            if (!isOpen) setSelectedRequestForComments(null);
        }}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Comments for: {selectedRequestForComments.title} ({selectedRequestForComments.id})</DialogTitle>
              <DialogDescription>View and add comments to this service request.</DialogDescription>
            </DialogHeader>
            <div className="py-4 max-h-[60vh] overflow-y-auto pr-2">
              <ServiceRequestComments 
                serviceRequest={selectedRequestForComments} 
                currentUser={currentAdminUser}
                onCommentAdded={handleCommentAdded}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCommentsModalOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Assign Modal */}
      {editingAssignment && (
        <Dialog open={!!editingAssignment} onOpenChange={(isOpen) => !isOpen && setEditingAssignment(null)}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Assign Request: {editingAssignment.title}</DialogTitle>
                    <DialogDescription>Enter the name or team to assign this request to.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <Input 
                        id="assignTo" 
                        value={assignmentValue}
                        onChange={(e) => setAssignmentValue(e.target.value)}
                        placeholder="e.g., Maintenance Team, John Doe"
                    />
                </div>
                <DialogFooter>
                    <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
                    <Button type="button" onClick={handleAssignSubmit}>Assign</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
      )}

    </div>
  );
}
