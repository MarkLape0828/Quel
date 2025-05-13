"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  DialogClose,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label }
from '@/components/ui/label';
import type { User, UserRole } from "@/lib/types";
import { getUsers, updateUserRole, addUser, updateUser, toggleArchiveUser, sendPasswordResetEmailAdmin } from "./actions";
import { USER_ROLES } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";
import { UserCog, Users, UserPlus, Edit3, Archive, ArchiveRestore, MailWarning, Trash2, RotateCcw } from "lucide-react";
import { AddUserForm } from './components/add-user-form';
import { EditUserForm } from './components/edit-user-form';

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showArchived, setShowArchived] = useState(false);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    const fetchedUsers = await getUsers();
    setUsers(fetchedUsers);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleAddUserSuccess = (newUser: User) => {
    setUsers(prev => [newUser, ...prev].sort((a, b) => a.lastName.localeCompare(b.lastName) || a.firstName.localeCompare(b.firstName)));
    setIsAddUserModalOpen(false);
  };

  const handleEditUserSuccess = (updatedUser: User) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u).sort((a, b) => a.lastName.localeCompare(b.lastName) || a.firstName.localeCompare(b.firstName)));
    setEditingUser(null);
  };

  const handleToggleArchive = async (userId: string, userName: string, isArchiving: boolean) => {
    const actionText = isArchiving ? "archive" : "unarchive";
    if (!confirm(`Are you sure you want to ${actionText} ${userName}?`)) return;

    const result = await toggleArchiveUser(userId);
    if (result.success && result.user) {
      toast({
        title: `User ${actionText}d`,
        description: `${result.user.firstName} ${result.user.lastName} has been ${actionText}d.`,
      });
      fetchUsers(); // Re-fetch to get updated list with correct archive status
    } else {
      toast({
        title: `Error ${actionText}ing User`,
        description: result.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };
  
  const handleSendResetLink = async (userId: string, email: string) => {
    if (!confirm(`Are you sure you want to send a password reset link to ${email}?`)) return;

    const result = await sendPasswordResetEmailAdmin(userId);
    toast({
      title: result.success ? "Reset Link Sent" : "Error",
      description: result.message,
      variant: result.success ? "default" : "destructive",
    });
  };

  const filteredUsers = useMemo(() => {
    return users.filter(user => showArchived || !user.isArchived);
  }, [users, showArchived]);

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center"><UserCog className="mr-2 h-6 w-6 text-primary" /> User Management</CardTitle>
            <CardDescription>View, add, edit, and manage user accounts and roles within The Quel system.</CardDescription>
          </div>
          <Button onClick={() => setIsAddUserModalOpen(true)}><UserPlus className="mr-2 h-4 w-4"/>Add User</Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Checkbox id="showArchived" checked={showArchived} onCheckedChange={(checked) => setShowArchived(!!checked)} />
            <Label htmlFor="showArchived" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Show Archived Users
            </Label>
          </div>

          {isLoading ? (
            <p>Loading users...</p>
          ) : filteredUsers.length === 0 ? (
            <p className="text-muted-foreground">{showArchived ? "No users (including archived) found." : "No active users found."}</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id} className={user.isArchived ? "opacity-60" : ""}>
                      <TableCell className="font-medium">{user.firstName} {user.lastName}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="capitalize">
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user.isArchived ? (
                            <Badge variant="outline" className="text-muted-foreground border-muted-foreground">Archived</Badge>
                        ) : (
                            <Badge variant="secondary" className="text-green-600 border-green-600">Active</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button variant="outline" size="sm" onClick={() => setEditingUser(user)} title="Edit User" disabled={user.isArchived}>
                          <Edit3 className="h-3.5 w-3.5" />
                        </Button>
                        {user.isArchived ? (
                           <Button variant="outline" size="sm" onClick={() => handleToggleArchive(user.id, `${user.firstName} ${user.lastName}`, false)} title="Unarchive User">
                             <ArchiveRestore className="h-3.5 w-3.5" />
                           </Button>
                        ) : (
                           <Button variant="outline" size="sm" onClick={() => handleToggleArchive(user.id, `${user.firstName} ${user.lastName}`, true)} title="Archive User">
                             <Archive className="h-3.5 w-3.5" />
                           </Button>
                        )}
                        <Button variant="outline" size="sm" onClick={() => handleSendResetLink(user.id, user.email)} title="Send Password Reset" disabled={user.isArchived}>
                          <MailWarning className="h-3.5 w-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        {filteredUsers.length > 0 && (
            <CardFooter>
                <p className="text-xs text-muted-foreground">Displaying {filteredUsers.length} of {users.length} total users (including archived if shown).</p>
            </CardFooter>
        )}
      </Card>

      {/* Add User Modal */}
      <Dialog open={isAddUserModalOpen} onOpenChange={setIsAddUserModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Fill in the details to create a new user account.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <AddUserForm onSuccess={handleAddUserSuccess} />
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit User Modal */}
      {editingUser && (
        <Dialog open={!!editingUser} onOpenChange={(open) => !open && setEditingUser(null)}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit User: {editingUser.firstName} {editingUser.lastName}</DialogTitle>
              <DialogDescription>
                Update the user's information below.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <EditUserForm user={editingUser} onSuccess={handleEditUserSuccess} />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}