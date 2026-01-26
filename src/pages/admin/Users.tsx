import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import {
  Search,
  MoreVertical,
  Mail,
  Shield,
  UserCheck,
  UserX,
  Edit,
  Trash2,
  Download,
  Users as UsersIcon,
  UserPlus,
  Ban,
  CheckCircle2,
  Clock,
  AlertCircle
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface User {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  address: string | null;
  role: string;
  verified: boolean;
  created_at: string;
  updated_at: string | null;
  // These may come from auth.users metadata or derived
  email?: string;
  first_name?: string | null;
  last_name?: string | null;
}

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    role: "client",
  });
  const [newUserFormData, setNewUserFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    role: "client",
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchQuery, roleFilter, statusFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching users",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(user =>
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Role filter
    if (roleFilter !== "all") {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    // Status filter
    if (statusFilter !== "all") {
      if (statusFilter === "verified") {
        filtered = filtered.filter(user => user.verified);
      } else if (statusFilter === "unverified") {
        filtered = filtered.filter(user => !user.verified);
      }
    }

    setFilteredUsers(filtered);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditFormData({
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      email: user.email,
      phone: user.phone || "",
      role: user.role,
    });
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedUser) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: editFormData.first_name,
          last_name: editFormData.last_name,
          full_name: `${editFormData.first_name} ${editFormData.last_name}`,
          phone: editFormData.phone,
          role: editFormData.role,
        })
        .eq('id', selectedUser.id);

      if (error) throw error;

      toast({
        title: "User updated",
        description: "User details have been updated successfully.",
      });

      setEditDialogOpen(false);
      fetchUsers();
    } catch (error: any) {
      toast({
        title: "Error updating user",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleToggleVerification = async (user: User) => {
    try {
      const newStatus = !user.verified;
      const { error } = await supabase
        .from('profiles')
        .update({ verified: newStatus })
        .eq('id', user.id);

      if (error) throw error;

      // If we just verified the user, send the approval email
      if (newStatus) {
        try {
          const { error: fnError } = await supabase.functions.invoke('send-account-approved-email', {
            body: {
              email: user.email,
              name: user.full_name || user.first_name || 'User'
            }
          });

          if (fnError) throw fnError;

        } catch (emailErr) {
          console.error("Failed to send approval email:", emailErr);
          toast({
            title: "Verification Warning",
            description: "User verified, but email notification failed to send.",
            variant: "destructive"
          });
        }
      }

      toast({
        title: newStatus ? "User verified" : "User unverified",
        description: `${user.email} has been ${newStatus ? "verified" : "unverified"}.`,
      });

      fetchUsers();
    } catch (error: any) {
      toast({
        title: "Error updating verification",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', selectedUser.id);

      if (error) throw error;

      toast({
        title: "User deleted",
        description: "User has been permanently deleted.",
      });

      setDeleteDialogOpen(false);
      fetchUsers();
    } catch (error: any) {
      toast({
        title: "Error deleting user",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleExport = () => {
    const csv = [
      ['Email', 'Name', 'Role', 'Verified', 'Created At'].join(','),
      ...filteredUsers.map(user => [
        user.email,
        `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.full_name || '',
        user.role,
        user.verified ? 'Yes' : 'No',
        format(new Date(user.created_at), 'yyyy-MM-dd')
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();

    toast({
      title: "Export successful",
      description: `Exported ${filteredUsers.length} users to CSV.`,
    });
  };

  const handleAddUser = async () => {
    // Validate required fields
    if (!newUserFormData.email || !newUserFormData.password || !newUserFormData.first_name || !newUserFormData.last_name) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Validate password length
    if (newUserFormData.password.length < 6) {
      toast({
        title: "Validation Error",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newUserFormData.email)) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('Creating user with email:', newUserFormData.email);

      // Step 1: Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newUserFormData.email,
        password: newUserFormData.password,
        options: {
          data: {
            full_name: `${newUserFormData.first_name} ${newUserFormData.last_name}`,
            phone: newUserFormData.phone,
            role: newUserFormData.role,
          },
          // Skip email confirmation for admin-created users
          emailRedirectTo: undefined,
        }
      });

      if (authError) {
        console.error('Auth error:', authError);
        throw new Error(`Authentication failed: ${authError.message}`);
      }

      if (!authData.user) {
        throw new Error('User creation failed: No user data returned');
      }

      console.log('Auth user created:', authData.user.id);

      // Step 2: Wait for database trigger to create profile
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Step 3: Upsert profile with correct columns (matching database schema)
      try {
        const profileData = {
          id: authData.user.id,
          full_name: `${newUserFormData.first_name} ${newUserFormData.last_name}`.trim(),
          phone: newUserFormData.phone || null,
          role: newUserFormData.role,
          verified: false,
        };

        console.log('Upserting profile:', profileData);

        const { error: profileError } = await supabase
          .from('profiles')
          .upsert(profileData, {
            onConflict: 'id'
          });

        if (profileError) {
          console.error('Profile upsert error:', profileError);
          // Don't throw - user was still created successfully
          toast({
            title: "User created with warning",
            description: `User account created but profile update failed: ${profileError.message}`,
          });
        } else {
          console.log('Profile upserted successfully');
        }
      } catch (profileErr: any) {
        console.error('Profile update exception:', profileErr);
        // Don't throw - user was still created
        toast({
          title: "User created with warning",
          description: "User account created but profile could not be updated.",
        });
      }

      // Success notification
      toast({
        title: "User created successfully",
        description: `${newUserFormData.email} has been added. They can now log in.`,
      });

      // Reset form and close dialog
      setNewUserFormData({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        password: "",
        role: "client",
      });
      setAddDialogOpen(false);

      // Wait and refresh user list
      await new Promise(resolve => setTimeout(resolve, 500));
      fetchUsers();

    } catch (error: any) {
      console.error('User creation failed:', error);

      // Provide specific error messages for common issues
      let errorMessage = error.message || 'An unexpected error occurred';

      if (errorMessage.includes('already registered')) {
        errorMessage = 'This email is already registered. Please use a different email.';
      } else if (errorMessage.includes('invalid email')) {
        errorMessage = 'Please enter a valid email address.';
      } else if (errorMessage.includes('password')) {
        errorMessage = 'Password must be at least 6 characters long.';
      }

      toast({
        title: "Error Creating User",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const getUserName = (user: User) => {
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    if (user.full_name) {
      return user.full_name;
    }
    return user.email;
  };

  const getUserInitials = (user: User) => {
    if (user.first_name && user.last_name && user.first_name.length > 0 && user.last_name.length > 0) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    }
    if (user.full_name && user.full_name.length > 0) {
      const parts = user.full_name.split(' ').filter(n => n.length > 0);
      if (parts.length > 0) {
        return parts.map(n => n[0]).join('').toUpperCase().slice(0, 2);
      }
    }
    if (user.email && user.email.length > 0) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  const getRoleBadge = (role: string) => {
    const colors: Record<string, string> = {
      admin: "bg-red-500",
      carer: "bg-blue-500",
      client: "bg-green-500",
      organisation: "bg-purple-500",
    };
    return <Badge className={colors[role] || "bg-gray-500"}>{role}</Badge>;
  };

  if (loading) {
    return (
      <DashboardLayout role="admin">
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">User Management</h1>
            <p className="text-muted-foreground">Manage all platform users</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button onClick={() => setAddDialogOpen(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <UsersIcon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{users.length}</p>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {users.filter(u => u.verified).length}
                  </p>
                  <p className="text-sm text-muted-foreground">Verified</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {users.filter(u => !u.verified).length}
                  </p>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <UserCheck className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {users.filter(u => u.role === 'carer').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Carers</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="client">Client</SelectItem>
                  <SelectItem value="carer">Carer</SelectItem>
                  <SelectItem value="organisation">Organisation</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="unverified">Unverified</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user.avatar_url || undefined} />
                          <AvatarFallback>{getUserInitials(user)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{getUserName(user)}</p>
                          <p className="text-sm text-muted-foreground">{user.phone || 'No phone'}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>
                      {user.verified ? (
                        <Badge className="bg-green-500">Verified</Badge>
                      ) : (
                        <Badge variant="outline" className="border-amber-500 text-amber-600">
                          Pending
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {format(new Date(user.created_at), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditUser(user)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleVerification(user)}>
                            {user.verified ? (
                              <>
                                <UserX className="h-4 w-4 mr-2" />
                                Unverify
                              </>
                            ) : (
                              <>
                                <UserCheck className="h-4 w-4 mr-2" />
                                Verify
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => window.location.href = `mailto:${user.email}`}>
                            <Mail className="h-4 w-4 mr-2" />
                            Email
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => {
                              setSelectedUser(user);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-semibold">No users found</p>
                <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>Update user information</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>First Name</Label>
                  <Input
                    value={editFormData.first_name}
                    onChange={(e) => setEditFormData({ ...editFormData, first_name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Last Name</Label>
                  <Input
                    value={editFormData.last_name}
                    onChange={(e) => setEditFormData({ ...editFormData, last_name: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={editFormData.phone}
                  onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={editFormData.role} onValueChange={(value) => setEditFormData({ ...editFormData, role: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="client">Client</SelectItem>
                    <SelectItem value="carer">Carer</SelectItem>
                    <SelectItem value="organisation">Organisation</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveEdit}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete {selectedUser?.email}. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteUser} className="bg-destructive text-destructive-foreground">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Add User Dialog */}
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>
                Create a new user account. A temporary password will be set.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>First Name *</Label>
                  <Input
                    value={newUserFormData.first_name}
                    onChange={(e) => setNewUserFormData({ ...newUserFormData, first_name: e.target.value })}
                    placeholder="John"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Last Name *</Label>
                  <Input
                    value={newUserFormData.last_name}
                    onChange={(e) => setNewUserFormData({ ...newUserFormData, last_name: e.target.value })}
                    placeholder="Doe"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Email *</Label>
                <Input
                  type="email"
                  value={newUserFormData.email}
                  onChange={(e) => setNewUserFormData({ ...newUserFormData, email: e.target.value })}
                  placeholder="john.doe@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label>Password *</Label>
                <Input
                  type="password"
                  value={newUserFormData.password}
                  onChange={(e) => setNewUserFormData({ ...newUserFormData, password: e.target.value })}
                  placeholder="Minimum 6 characters"
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={newUserFormData.phone}
                  onChange={(e) => setNewUserFormData({ ...newUserFormData, phone: e.target.value })}
                  placeholder="+44 7700 900000"
                />
              </div>
              <div className="space-y-2">
                <Label>Role *</Label>
                <Select value={newUserFormData.role} onValueChange={(value) => setNewUserFormData({ ...newUserFormData, role: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="client">Client</SelectItem>
                    <SelectItem value="carer">Carer</SelectItem>
                    <SelectItem value="organisation">Organisation</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddUser}>Create User</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default AdminUsers;
