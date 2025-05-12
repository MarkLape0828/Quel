"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { User, UserRole } from "@/lib/types";
import { getUsers, updateUserRole } from "./actions";
import { USER_ROLES } from "@/lib/mock-data"; // Import available roles
import { useToast } from "@/hooks/use-toast";
import { UserCog, Users } from "lucide-react"; // Users icon for overall page, UserCog for general idea

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    const fetchedUsers = await getUsers();
    setUsers(fetchedUsers);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    const originalUsers = [...users];
    
    // Optimistic update
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      )
    );

    const result = await updateUserRole(userId, newRole);
    if (result.success && result.user) {
      toast({
        title: "Role Updated",
        description: `${result.user.firstName} ${result.user.lastName}'s role updated to ${newRole}.`,
      });
      // Update with server response to ensure consistency (if server modifies more data)
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId ? result.user! : user
        )
      );
    } else {
      toast({
        title: "Error",
        description: result.message || "Failed to update role.",
        variant: "destructive",
      });
      setUsers(originalUsers); // Revert optimistic update
    }
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><UserCog className="mr-2 h-6 w-6 text-primary" /> User Management</CardTitle>
          <CardDescription>View users and manage their roles within The Quel system.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading users...</p>
          ) : users.length === 0 ? (
            <p className="text-muted-foreground">No users found.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Current Role</TableHead>
                    <TableHead className="text-right">Assign Role</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.firstName} {user.lastName}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="capitalize">
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Select
                          value={user.role}
                          onValueChange={(newRole: UserRole) => handleRoleChange(user.id, newRole)}
                        >
                          <SelectTrigger className="w-[180px] h-9">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            {USER_ROLES.map(role => (
                              <SelectItem key={role} value={role} className="capitalize">
                                {role}
                              </SelectItem>
                            ))}
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
        {users.length > 0 && (
            <CardFooter>
                <p className="text-xs text-muted-foreground">Managing {users.length} users.</p>
            </CardFooter>
        )}
      </Card>
    </div>
  );
}