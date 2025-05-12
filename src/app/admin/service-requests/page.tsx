
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ServiceRequest } from "@/lib/types";
import { getServiceRequests, updateServiceRequestStatus } from "@/app/(main)/service-requests/actions"; // Assuming actions are shareable
import { AlertCircle, CheckCircle2, Clock, Settings2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const StatusBadge = ({ status }: { status: ServiceRequest['status'] }) => {
  switch (status) {
    case 'pending':
      return <Badge variant="outline" className="text-orange-500 border-orange-500"><Clock className="mr-1 h-3 w-3" />Pending</Badge>;
    case 'in-progress':
      return <Badge variant="secondary" className="text-blue-500 border-blue-500"><AlertCircle className="mr-1 h-3 w-3" />In Progress</Badge>;
    case 'resolved':
      return <Badge variant="default" className="bg-green-500 hover:bg-green-600 text-white"><CheckCircle2 className="mr-1 h-3 w-3" />Resolved</Badge>;
    case 'closed':
      return <Badge variant="outline" className="text-gray-700 border-gray-400"><CheckCircle2 className="mr-1 h-3 w-3" />Closed</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

export default function AdminServiceRequestsPage() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchRequests = useCallback(async () => {
    setIsLoading(true);
    const fetchedRequests = await getServiceRequests(); // Gets all requests
    setRequests(fetchedRequests.sort((a, b) => new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime()));
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleStatusChange = async (requestId: string, newStatus: ServiceRequest['status']) => {
    const originalRequests = [...requests];
    
    // Optimistic update
    setRequests(prevRequests => 
      prevRequests.map(req => 
        req.id === requestId ? { ...req, status: newStatus } : req
      )
    );

    const result = await updateServiceRequestStatus(requestId, newStatus);
    if (result.success && result.request) {
      toast({
        title: "Status Updated",
        description: `Request "${result.request.title}" is now ${newStatus}.`,
      });
      // Optionally re-fetch or update more accurately if server modifies more data
      fetchRequests(); 
    } else {
      toast({
        title: "Error",
        description: result.message || "Failed to update status.",
        variant: "destructive",
      });
      setRequests(originalRequests); // Revert optimistic update
    }
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><Settings2 className="mr-2 h-6 w-6 text-primary" />Manage Service Requests</CardTitle>
          <CardDescription>View, track, and update the status of all submitted service requests.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading service requests...</p>
          ) : requests.length === 0 ? (
            <p>No service requests have been submitted yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Submitted By</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Update Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((req) => (
                    <TableRow key={req.id}>
                      <TableCell className="font-medium max-w-xs truncate" title={req.title}>{req.title}</TableCell>
                      <TableCell>{req.submittedBy || "N/A"}</TableCell>
                      <TableCell className="capitalize">{req.category}</TableCell>
                      <TableCell>{new Date(req.submittedDate).toLocaleDateString()}</TableCell>
                      <TableCell>{req.location || "N/A"}</TableCell>
                      <TableCell><StatusBadge status={req.status} /></TableCell>
                      <TableCell className="text-right">
                        <Select
                          value={req.status}
                          onValueChange={(newStatus: ServiceRequest['status']) => handleStatusChange(req.id, newStatus)}
                        >
                          <SelectTrigger className="w-[150px] h-9">
                            <SelectValue placeholder="Change status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="resolved">Resolved</SelectItem>
                            <SelectItem value="closed">Closed</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
