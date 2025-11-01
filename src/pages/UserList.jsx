import { useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ConfirmationDialog } from "@/components/dashboard/ConfirmationDialog";
// import { useToast } from "@/components";
import { useDebounce } from "@/lib/utils";
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
import { format, formatDistanceToNow } from "date-fns";
import { getUsers, updateUser, deleteUser } from "../api/users"; // your API functions
import { Link, useNavigate } from "react-router-dom";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [stats, setStats] = useState({
    total_users: 0,
    active_users: 0,
    inactive_users: 0,
    total_roles: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

//   const { toast } = useToast();
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // 🔹 Fetch Users
  const fetchUsers = async (query = "") => {
    try {
      const res = await getUsers(query);
      if (res) {
        setUsers(res.data || []);
        setRoles(res.roles || []);
        setStats(res.stats || {});
      }
    } catch (err) {
    //   toast({
    //     title: "Error fetching users",
    //     description: err.message || "Failed to load users.",
    //     variant: "destructive",
    //   });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 🔹 Debounce Search
  useDebounce(searchTerm, () => {
    fetchUsers(searchTerm);
  }, 500);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    if (now.getTime() - date.getTime() < 7 * 24 * 60 * 60 * 1000) {
      return formatDistanceToNow(date, { addSuffix: true });
    }
    return format(date, "PPP");
  };

  const handleStatus = async (user) => {
    try {
      const newStatus = user.status === "Active" ? "inactive" : "active";
      await updateUser(user.id, { status: newStatus });
    //   toast({
    //     title: "Status Updated",
    //     description: `User status changed to ${newStatus}.`,
    //   });
      fetchUsers(searchTerm);
    } catch (err) {
    //   toast({
    //     title: "Failed to update status",
    //     description: err.message || "Something went wrong.",
    //     variant: "destructive",
    //   });
    }
  };

  const handleRoleChange = async (userId, roleName) => {
    try {
      await updateUser(userId, { role: roleName });
    //   toast({
    //     title: "Role Updated",
    //     description: "User role changed successfully.",
    //   });
      fetchUsers(searchTerm);
    } catch (err) {
    //   toast({
    //     title: "Failed to update role",
    //     description: err.message || "Something went wrong.",
    //     variant: "destructive",
    //   });
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
        description: "User removed successfully.",
      });
    //   toast({
    //     title: "User Deleted",
    //     description: "User removed successfully.",
    //   });
      fetchUsers(searchTerm);
    } catch (err) {
    //   toast({
    //     title: "Delete Failed",
    //     description: err.message || "An error occurred.",
    //     variant: "destructive",
    //   });
    } finally {
      setIsDeleting(false);
      setIsConfirmOpen(false);
      setUserToDelete(null);
    }
  };

  return (
    <div className="py-6">
      <div className="max-w-full mx-auto">
        {/* 🔹 Stats */}
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
              <p className="text-xs text-muted-foreground">Active Accounts</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Inactive Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.inactive_users}</div>
              <p className="text-xs text-muted-foreground">Inactive Accounts</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Roles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_roles}</div>
              <p className="text-xs text-muted-foreground">System Roles</p>
            </CardContent>
          </Card>
        </div>

        {/* 🔹 Search + Add */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">All Users</h2>
          <div className="flex items-center gap-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by name, email, phone, role..."
                className="pl-8 w-full"
                value={searchTerm}
                ref={inputRef}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button asChild>
              <Link to="/users/create">
                <Plus className="w-4 h-4 mr-2" /> Create User
              </Link>
            </Button>
          </div>
        </div>

        {/* 🔹 Users Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined On</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>
                              {user.name
                                ?.split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()}
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
                              : user.status === "suspended"
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          <button onClick={() => handleStatus(user)}>
                            {user.status}
                          </button>
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <Select
                          disabled={user.id === 1}
                          defaultValue={user.role?.name?.toLowerCase()}
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
                        <div className="flex space-x-1">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => navigate(`/users/${user.id}`)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>View Details</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => navigate(`/users/${user.id}/edit`)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Edit User</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          {user.id !== 1 && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDelete(user)}
                                    className="hover:text-destructive"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Delete User</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center h-24">
                      No users found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* 🔹 Pagination Placeholder */}
        <Pagination className="mt-6">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

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
