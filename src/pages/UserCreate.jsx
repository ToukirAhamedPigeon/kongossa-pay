import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  FileText,
  LoaderCircle,
  User as UserIcon,
  Plus,
} from "lucide-react";

import Breadcrumbs from "@/components/dashboard/Breadcumbs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { createUser } from "@/api/users";

export default function UserCreate() {
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [userType, setUserType] = useState("personal");
  const [selectedFile, setSelectedFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState({});

  const [data, setData] = useState({
    name: "",
    email: "",
    phone: "",
    user_type: "personal",
    password: "",
    password_confirmation: "",
    status: "active",
    role_id: "2",

    company_name: "",
    company_legal_form: "",
    manager_name: "",
    company_phone: "",
    company_address: "",
    business_description: "",
    legal_form_document: null,
  });

  const breadcrumbs = [
    { label: "Users", href: "/users" },
    { label: "Create User" },
  ];

  const handleChange = (key, value) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    setData((prev) => ({ ...prev, legal_form_document: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setErrors({});

    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== null) formData.append(key, value);
      });

      await createUser(formData);
      navigate("/users");
    } catch (error) {
      console.error("Failed to create user:", error);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    } finally {
      setProcessing(false);
    }
  };

  const isBusinessUser = userType === "business_merchant";

  return (
    <div className="space-y-6 mt-10">
      <Breadcrumbs breadcrumbs={breadcrumbs} />

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create New User</h1>
          <p className="text-muted-foreground">
            Add a new user to the system
          </p>
        </div>
        <Button onClick={() => navigate("/users")}>
          <Plus className="mr-2 h-4 w-4" />
          All Users
        </Button>
      </div>

      {/* Form Card */}
      <Card>
        <CardHeader>
          <CardTitle>User Information</CardTitle>
          <CardDescription>Fill in all required fields below</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={data.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    required
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={data.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    required
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={data.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    required
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-500">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="user_type">User Type *</Label>
                  <Select
                    value={data.user_type}
                    onValueChange={(value) => {
                      handleChange("user_type", value);
                      setUserType(value);
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
                </div>
              </div>
            </div>

            {/* Password */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Password</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={data.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="password_confirmation">Confirm Password *</Label>
                  <Input
                    id="password_confirmation"
                    type="password"
                    value={data.password_confirmation}
                    onChange={(e) =>
                      handleChange("password_confirmation", e.target.value)
                    }
                    required
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
                  <div>
                    <Label htmlFor="company_name">Company Name *</Label>
                    <Input
                      id="company_name"
                      value={data.company_name}
                      onChange={(e) =>
                        handleChange("company_name", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="company_legal_form">Legal Form *</Label>
                    <Input
                      id="company_legal_form"
                      value={data.company_legal_form}
                      onChange={(e) =>
                        handleChange("company_legal_form", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="manager_name">Manager Name *</Label>
                    <Input
                      id="manager_name"
                      value={data.manager_name}
                      onChange={(e) =>
                        handleChange("manager_name", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="company_phone">Company Phone *</Label>
                    <Input
                      id="company_phone"
                      value={data.company_phone}
                      onChange={(e) =>
                        handleChange("company_phone", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="company_address">Company Address *</Label>
                    <Textarea
                      id="company_address"
                      value={data.company_address}
                      onChange={(e) =>
                        handleChange("company_address", e.target.value)
                      }
                      rows={3}
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="business_description">Business Description *</Label>
                    <Textarea
                      id="business_description"
                      value={data.business_description}
                      onChange={(e) =>
                        handleChange("business_description", e.target.value)
                      }
                      rows={3}
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="legal_form_document" className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Legal Form Document *
                    </Label>
                    <Input
                      id="legal_form_document"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                      required
                    />
                    {selectedFile && (
                      <p className="text-sm text-green-600 mt-1">
                        Selected: {selectedFile.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Submit */}
            <div className="flex justify-end space-x-4 pt-6">
              <Button variant="outline" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button type="submit" disabled={processing}>
                {processing && (
                  <LoaderCircle className="w-4 h-4 animate-spin mr-2" />
                )}
                Create User
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
