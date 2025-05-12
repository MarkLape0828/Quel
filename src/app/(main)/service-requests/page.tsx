"use client"; // Top-level client component for managing state between form and table

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { ServiceRequest } from "@/lib/types";
import { ServiceRequestForm } from "./components/service-request-form";
import { getServiceRequests } from "./actions";
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react';

const StatusBadge = ({ status }: { status: ServiceRequest['status'] }) => {
  switch (status) {
    case 'pending':
      return <Badge variant="outline" className="text-orange-500 border-orange-500"><Clock className="mr-1 h-3 w-3" />Pending</Badge>;
    case 'in-progress':
      return <Badge variant="secondary" className="text-blue-500 border-blue-500"><AlertCircle className="mr-1 h-3 w-3" />In Progress</Badge>;
    case 'resolved':
      return <Badge variant="default" className="bg-green-500 hover:bg-green-600"><CheckCircle2 className="mr-1 h-3 w-3" />Resolved</Badge>;
    case 'closed':
      return <Badge variant="outline"><CheckCircle2 className="mr-1 h-3 w-3" />Closed</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

export default function ServiceRequestsPage() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRequests = useCallback(async () => {
    setIsLoading(true);
    const fetchedRequests = await getServiceRequests();
    setRequests(fetchedRequests);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleNewRequest = (newRequest: ServiceRequest) => {
    setRequests(prevRequests => [newRequest, ...prevRequests]);
  };

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Submit a New Service Request</CardTitle>
          <CardDescription>Report maintenance issues, security concerns, or other requests.</CardDescription>
        </CardHeader>
        <CardContent>
          <ServiceRequestForm onFormSubmit={handleNewRequest} />
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>My Service Requests</CardTitle>
          <CardDescription>Track the status of your submitted requests.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading requests...</p>
          ) : requests.length === 0 ? (
            <p>You have not submitted any service requests yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Location</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((req) => (
                    <TableRow key={req.id}>
                      <TableCell className="font-medium">{req.title}</TableCell>
                      <TableCell className="capitalize">{req.category}</TableCell>
                      <TableCell>{new Date(req.submittedDate).toLocaleDateString()}</TableCell>
                      <TableCell><StatusBadge status={req.status} /></TableCell>
                      <TableCell>{req.location || "N/A"}</TableCell>
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
