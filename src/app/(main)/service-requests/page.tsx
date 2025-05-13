
"use client"; 

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { ServiceRequest, User, StatusChange } from "@/lib/types";
import { ServiceRequestForm } from "./components/service-request-form";
import { getServiceRequestsForUser } from "./actions";
import { mockUsers } from '@/lib/mock-data'; 
import { AlertCircle, CheckCircle2, Clock, MessageSquare, ChevronDown, Info, CalendarDays } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ServiceRequestComments } from './components/service-request-comments';

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
      <PopoverContent className="w-80">
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

export default function ServiceRequestsPage() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // MOCK: Get current user from mock data or auth context in real app
  const currentUserId = "user123"; // Alice Member
  const currentUser = mockUsers.find(u => u.id === currentUserId) || mockUsers[0];


  const fetchRequests = useCallback(async () => {
    if (!currentUser) return;
    setIsLoading(true);
    const fetchedRequests = await getServiceRequestsForUser(currentUser.id);
    setRequests(fetchedRequests);
    setIsLoading(false);
  }, [currentUser]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleNewRequest = (newRequest: ServiceRequest) => {
    setRequests(prevRequests => [newRequest, ...prevRequests]);
  };
  
  const handleCommentAdded = (updatedRequest: ServiceRequest) => {
    setRequests(prevRequests =>
      prevRequests.map(req => (req.id === updatedRequest.id ? updatedRequest : req))
    );
  };


  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Submit a New Service Request</CardTitle>
          <CardDescription>Report maintenance issues, security concerns, or other requests.</CardDescription>
        </CardHeader>
        <CardContent>
          <ServiceRequestForm onFormSubmit={handleNewRequest} currentUser={currentUser} />
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>My Service Requests</CardTitle>
          <CardDescription>Track the status of your submitted requests and add comments.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading requests...</p>
          ) : requests.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">You have not submitted any service requests yet.</p>
          ) : (
            <Accordion type="single" collapsible className="w-full">
              {requests.map((req) => (
                <AccordionItem value={req.id} key={req.id} className="border-b-0">
                   <Card className="mb-2 overflow-hidden shadow-sm">
                    <Table>
                        <TableHeader className="sr-only">
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Submitted</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                           <TableRow className="border-b-0 hover:bg-transparent data-[state=selected]:bg-transparent">
                                <TableCell className="font-mono text-xs p-3 w-[100px] truncate" title={req.id}>{req.id}</TableCell>
                                <TableCell className="font-medium p-3 max-w-xs truncate" title={req.title}>{req.title}</TableCell>
                                <TableCell className="capitalize p-3">{req.category}</TableCell>
                                <TableCell className="p-3">{new Date(req.submittedDate).toLocaleDateString()}</TableCell>
                                <TableCell className="p-3"><StatusBadge status={req.status} history={req.statusHistory} /></TableCell>
                                <TableCell className="p-3 max-w-[150px] truncate" title={req.location}>{req.location || "N/A"}</TableCell>
                                <TableCell className="text-right space-x-2 p-3 w-[150px]">
                                    <AccordionTrigger asChild>
                                       <Button variant="outline" size="sm" className="justify-between"> 
                                        <span className="flex items-center">
                                          <MessageSquare className="mr-2 h-4 w-4" /> Comments ({req.comments.length})
                                        </span>
                                        <ChevronDown className="h-4 w-4 shrink-0" /> 
                                       </Button>
                                    </AccordionTrigger>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    <AccordionContent className="p-0">
                        <div className="px-4 pb-4">
                         <ServiceRequestComments 
                            serviceRequest={req} 
                            currentUser={currentUser} 
                            onCommentAdded={handleCommentAdded} 
                         />
                        </div>
                    </AccordionContent>
                   </Card>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </CardContent>
         {requests.length > 0 && (
            <CardFooter>
                <p className="text-xs text-muted-foreground">Displaying {requests.length} service requests.</p>
            </CardFooter>
        )}
      </Card>
    </div>
  );
}
