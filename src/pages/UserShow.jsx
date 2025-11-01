import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Building2,
  FileText,
  Mail,
  MapPin,
  Phone,
  UserCheck,
  User as UserIcon,
} from "lucide-react";

import Breadcrumbs from "@/components/dashboard/Breadcumbs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { getUserById } from "@/api/users";

export default function UserShow() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const data = await getUserById(id);
      setUser(data);
    } catch (err) {
      console.error("Failed to fetch user:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  if (loading)
    return (
      <p className="text-center py-10 text-muted-foreground">Loading user...</p>
    );

  if (!user)
    return (
      <p className="text-center py-10 text-muted-foreground">
        User not found.
      </p>
    );

  const createdTontines = user.created_tontines || [];
  const memberTontines = user.tontine_memberships || [];

  const breadcrumbs = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Users", href: "/users" },
    { label: user.name },
  ];

  return (
    <div className="space-y-6 mt-10">
      {breadcrumbs && <Breadcrumbs breadcrumbs={breadcrumbs} />}

      {/* Header */}
      <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-lg">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                {user.name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant={
                    user.user_type === "business_merchant"
                      ? "default"
                      : "secondary"
                  }
                >
                  {user.user_type === "business_merchant" ? (
                    <>
                      <Building2 className="w-3 h-3 mr-1" />
                      Business
                    </>
                  ) : (
                    <>
                      <UserIcon className="w-3 h-3 mr-1" />
                      Personal
                    </>
                  )}
                </Badge>
                <Badge
                  variant={user.status === "active" ? "default" : "destructive"}
                >
                  {user.status}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="p-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                <UserIcon className="w-4 h-4" />
                Full name
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {user.name}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email address
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {user.email}
              </dd>
            </div>

            {user.phone && (
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone number
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                  {String(user.phone)}
                </dd>
              </div>
            )}

            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Role
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {user.role?.name}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Member since
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {new Date(user.created_at).toLocaleDateString()}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                <UserCheck className="w-4 h-4" />
                Email Verified
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {user.email_verified_at
                  ? new Date(user.email_verified_at).toLocaleDateString()
                  : "Not Verified"}
              </dd>
            </div>
          </dl>

          {/* Business Info */}
          {user.user_type === "business_merchant" && (
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h4 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Business Information
              </h4>

              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                {user.company_name && (
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Company Name
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                      {user.company_name}
                    </dd>
                  </div>
                )}

                {user.manager_name && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Manager Name
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                      {user.manager_name}
                    </dd>
                  </div>
                )}

                {user.company_phone && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Company Phone
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                      {user.company_phone}
                    </dd>
                  </div>
                )}

                {user.company_legal_form && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Legal Form
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                      {user.company_legal_form}
                    </dd>
                  </div>
                )}

                {user.company_address && (
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Company Address
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                      {user.company_address}
                    </dd>
                  </div>
                )}

                {user.business_description && (
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Business Description
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                      {user.business_description}
                    </dd>
                  </div>
                )}

                {user.legal_form_document && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Legal Form Document
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                      <a
                        href={
                          user.legal_form_document_url ||
                          String(user.legal_form_document)
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80 underline"
                      >
                        View Document
                      </a>
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          )}
        </div>
      </div>

      {/* Tontine Involvement */}
      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
          Tontine Involvement
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Created */}
          <Card>
            <CardHeader>
              <CardTitle>
                Tontines Created ({createdTontines.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {createdTontines.length > 0 ? (
                <ul className="space-y-4">
                  {createdTontines.map((t) => (
                    <li
                      key={t.id}
                      className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <Link to={`/tontines/${t.id}`}>
                        <div className="flex justify-between items-center">
                          <span className="font-semibold">{t.name}</span>
                          <Badge>Active</Badge>
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {formatCurrency(t.contribution_amount)} / {t.frequency}
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  This user has not created any tontines.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Memberships */}
          <Card>
            <CardHeader>
              <CardTitle>
                Tontine Memberships ({memberTontines.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {memberTontines.length > 0 ? (
                <ul className="space-y-4">
                  {memberTontines.map((m) => (
                    <li
                      key={m.id}
                      className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <Link to={`/tontines/${m.id}`}>
                        <div className="flex justify-between items-center">
                          <span className="font-semibold">{m.id}</span>
                          <Badge>Member</Badge>
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {formatCurrency(1200)} / 1
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  This user is not a member of any tontines.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
