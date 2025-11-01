// src/pages/UserEdit.jsx
import { useEffect, useState, FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Building2,
  FileText,
  LoaderCircle,
  User as UserIcon,
} from "lucide-react";

import Breadcrumbs from "@/components/dashboard/Breadcumbs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { getUserById, updateUser } from "@/api/users";
import { getAllRoles } from "@/api/roles"; // optional if roles come from API

export default function UserEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState({});
  const [roles, setRoles] = useState([]);
  const [userType, setUserType] = useState("personal");
  const [selectedFile, setSelectedFile] = useState(null);

  const [data, setData] = useState({
    name: "",
    email: "",
    phone: "",
    user_type: "personal",
    password: "",
    password_confirmation: "",
    status: "active",
    role: "",
    company_name: "",
    company_legal_form: "",
    manager_name: "",
    company_phone: "",
    company_address: "",
    business_description: "",
    legal_form_document: null,
  });

  const isBusinessUser = userType === "business_merchant";

  const breadcrumbs = [
    { label: "Users", href: "/users" },
    { label: "Edit" },
  ];

  // Fetch user + roles
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, rolesRes] = await Promise.all([
          getUserById(id),
          getAllRoles?.() ?? [], // optional if available
        ]);

        const user = userRes.data || userRes;

        setData((prev) => ({
          ...prev,
          ...user,
          role: user.role?.name || "",
        }));
        setUserType(user.user_type || "personal");
        if (rolesRes?.data) setRoles(rolesRes.data);
        else if (Array.isArray(rolesRes)) setRoles(rolesRes);
      } catch (err) {
        console.error("Failed to load user data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    setData((prev) => ({ ...prev, legal_form_document: file }));
  };

  const handleChange = (key, value) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setErrors({});

    try {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (data[key] !== null && data[key] !== undefined)
          formData.append(key, data[key]);
      });

      await updateUser(id, formData);
      navigate(`/users/${id}`);
    } catch (err) {
      console.error("Update failed:", err);
      if (err.response?.data?.errors) setErrors(err.response.data.errors);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <p className="text-center py-10">Loading user...</p>;

  return (
    <div className="space-y-6 mt-10">
      {breadcrumbs && <Breadcrumbs breadcrumbs={breadcrumbs} />}

      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Edit User</CardTitle>
            <CardDescription>Update user information and settings</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input
                      value={data.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      className={errors.name ? "border-red-500" : ""}
                    />
                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={data.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input
                      value={data.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      className={errors.phone ? "border-red-500" : ""}
                    />
                    {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label>User Type</Label>
                    <Select
                      value={data.user_type}
                      onValueChange={(v) => {
                        handleChange("user_type", v);
                        setUserType(v);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select user type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="personal">
                          <div className="flex items-center gap-2">
                            <UserIcon className="w-4 h-4" /> Personal
                          </div>
                        </SelectItem>
                        <SelectItem value="business_merchant">
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4" /> Business
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.user_type && <p className="text-sm text-red-500">{errors.user_type}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select
                      value={data.status}
                      onValueChange={(v) => handleChange("status", v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Role</Label>
                    <Select
                      value={data.role}
                      onValueChange={(v) => handleChange("role", v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((r) => (
                          <SelectItem key={r.id} value={r.name}>
                            {r.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Password */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Change Password (Optional)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>New Password</Label>
                    <Input
                      type="password"
                      value={data.password}
                      onChange={(e) => handleChange("password", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Confirm Password</Label>
                    <Input
                      type="password"
                      value={data.password_confirmation}
                      onChange={(e) =>
                        handleChange("password_confirmation", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Business Info */}
              {isBusinessUser && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    Business Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Company Name</Label>
                      <Input
                        value={data.company_name}
                        onChange={(e) => handleChange("company_name", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Legal Form</Label>
                      <Input
                        value={data.company_legal_form}
                        onChange={(e) => handleChange("company_legal_form", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Manager Name</Label>
                      <Input
                        value={data.manager_name}
                        onChange={(e) => handleChange("manager_name", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Company Phone</Label>
                      <Input
                        value={data.company_phone}
                        onChange={(e) => handleChange("company_phone", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label>Company Address</Label>
                      <Textarea
                        value={data.company_address}
                        onChange={(e) => handleChange("company_address", e.target.value)}
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label>Business Description</Label>
                      <Textarea
                        value={data.business_description}
                        onChange={(e) => handleChange("business_description", e.target.value)}
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Legal Form Document
                      </Label>
                      <Input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileChange}
                      />
                      {selectedFile && (
                        <p className="text-sm text-green-600">
                          Selected: {selectedFile.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end space-x-4 pt-6">
                <Button variant="outline" type="button" onClick={() => navigate(-1)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={processing}>
                  {processing && (
                    <LoaderCircle className="w-4 h-4 animate-spin mr-2" />
                  )}
                  Update User
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
