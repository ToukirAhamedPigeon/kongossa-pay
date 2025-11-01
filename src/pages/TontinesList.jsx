import { useEffect, useState, useRef, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  Edit,
  Eye,
  Phone,
  Plus,
  Search,
  Trash2,
  User as UserIcon,
} from "lucide-react";

import Breadcrumbs from "@/components/dashboard/Breadcumbs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { ConfirmationDialog } from "@/components/dashboard/ConfirmationDialog";

import {
  getUsers,
  deleteUser,
  updateUser,
} from "@/api/users";

import { format, formatDistanceToNow } from "date-fns";

export default function UsersList() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [users, setUsers] = useState({
    data: [],
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
  });

  const [stats, setStats] = useState({
    total_users: 0,
    active_users: 0,
    inactive_users: 0,
    total_roles: 0,
  });

  const [roles, setRoles] = useState([]);
  const [filters, setFilters] = useState({ search: "" });
  const [loading, setLoading] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const inputRef = useRef(null);

  const fetchUsers = async (page = 1) => {
    try {
      setLoading(true);
      const response = await getUsers({ search: filters.search, page });
      const formatted = Array.isArray(response)
        ? { data: response, current_page: 1, last_page: 1, per_page: 10, total: response.length }
        : {
            data: Array.isArray(response.data) ? response.data : [],
            current_page: response.current_page || 1,
            last_page: response.last_page || 1,
            per_page: response.per_page || 10,
            total: response.total || 0,
          };

      setUsers(formatted);

      // Optional: if backend sends stats/roles in same payload
      if (response.stats) setStats(response.stats);
      if (response.roles) setRoles(response.roles);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setUsers({ data: [], current_page: 1, last_page: 1, per_page: 10, total: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [filters.search]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers(1);
  };

  const handleStatusChange = async (user) => {
    try {
      await updateUser(user.id, {
        status: user.status === "Active" ? "inactive" : "active",
      });
      toast({
        title: "Status Updated",
        description: `User status changed to ${
          user.status === "Active" ? "inactive" : "active"
        }.`,
      });
      fetchUsers(users.current_page);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update status.",
        variant: "destructive",
      });
    }
  };

  const handleRoleChange = async (userId, role) => {
    try {
      await updateUser(userId, { role });
      toast({
        title: "Role Updated",
        description: "User role has been successfully updated.",
      });
      fetchUsers(users.current_page);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update role.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = (user) => {
    setUserToDelete(user);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    setIsDeleting(true);
    try {
      await deleteUser(userToDelete.id);
      toast({
        title: "User Deleted",
        description: `${userToDelete.name} has been removed.`,
      });
      fetchUsers(users.current_page);
    } catch (err) {
      toast({
        title: "Delete Failed",
        description: "An error occurred while deleting user.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setIsConfirmOpen(false);
      setUserToDelete(null);
    }
  };

  const formatDate = (dateString) => {
  const date = new Date(dateString);
  if (!dateString || isNaN(date.getTime())) return "N/A";

  const now = new Date();
  return now.getTime() - date.getTime() < 7 * 24 * 60 * 60 * 1000
    ? formatDistanceToNow(date, { addSuffix: true })
    : format(date, "PPP");
};


  const breadcrumbs = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Users" },
  ];

  return (
    <div className="space-y-6 mt-10">
      {breadcrumbs && <Breadcrumbs breadcrumbs={breadcrumbs} />}

      {/* Header Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_users}</div>
            <p className="text-xs text-muted-foreground">Full System</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active_users}</div>
            <p className="text-xs text-muted-foreground">In System</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Inactive Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inactive_users}</div>
            <p className="text-xs text-muted-foreground">In System</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Roles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_roles}</div>
            <p className="text-xs text-muted-foreground">In System</p>
          </CardContent>
        </Card>
      </div>

      {/* Search & Create */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">All Users</h2>
        <div className="flex items-center gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by name, email, phone..."
              className="pl-8 w-full"
              value={filters.search}
              ref={inputRef}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
          <Button onClick={() => navigate("/users/create")}>
            <Plus className="w-4 h-4 mr-2" /> Create User
          </Button>
        </div>
      </div>

      {/* User Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <p className="text-center py-10 text-muted-foreground">Loading...</p>
          ) : users.data.length === 0 ? (
            <p className="text-center py-10 text-muted-foreground">No users found.</p>
          ) : (
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.data.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>
                            {user.name?.split(" ").map((n) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          {user.company_name && (
                            <div className="text-xs text-muted-foreground">
                              {user.company_name}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">{user.email}</div>
                        {user.phone && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Phone className="h-3 w-3" /> {user.phone}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.user_type === "business_merchant"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {user.user_type === "business_merchant" ? (
                          <>
                            <Building2 className="w-3 h-3 mr-1" /> Business
                          </>
                        ) : (
                          <>
                            <UserIcon className="w-3 h-3 mr-1" /> Personal
                          </>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.status === "Active"
                            ? "default"
                            : "secondary"
                        }
                        className="capitalize cursor-pointer"
                        onClick={() => handleStatusChange(user)}
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Select
                        disabled={user.id === 1}
                        defaultValue={user.role?.toLowerCase() || ""}
                        onValueChange={(value) =>
                          handleRoleChange(user.id, value)
                        }
                      >
                        <SelectTrigger className="w-[130px]">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          {roles.map((role) => (
                            <SelectItem
                              key={role.id}
                              value={role.name.toLowerCase()}
                            >
                              {role.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>{formatDate(user.created_at)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => navigate(`/users/${user.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => navigate(`/users/${user.id}/edit`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {user.id !== 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(user)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {users.last_page > 1 && (
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-muted-foreground">
            Showing{" "}
            {Math.min(
              (users.current_page - 1) * users.per_page + 1,
              users.total
            )}{" "}
            to{" "}
            {Math.min(users.current_page * users.per_page, users.total)} of{" "}
            {users.total} users
          </p>
          <div className="flex gap-2">
            {users.current_page > 1 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchUsers(users.current_page - 1)}
              >
                Previous
              </Button>
            )}
            {users.current_page < users.last_page && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchUsers(users.current_page + 1)}
              >
                Next
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {userToDelete && (
        <ConfirmationDialog
          open={isConfirmOpen}
          onOpenChange={setIsConfirmOpen}
          title="Are you sure?"
          description={`You are about to delete "${userToDelete.name}". This action cannot be undone.`}
          onConfirm={confirmDelete}
          variant="destructive"
          confirmText={isDeleting ? "Deleting..." : "Yes, delete"}
          loading={isDeleting}
        />
      )}
    </div>
  );
}
