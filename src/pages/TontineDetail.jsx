import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // For normal React routing
import  Breadcrumbs  from "@/components/dashboard/Breadcumbs";
import TontineContributionForm from "@/components/dashboard/TontineContributionForm";
import TontineInviteForm from "@/components/dashboard/TontineInviteForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import {
  Calendar,
  Clock,
  Crown,
  DollarSign,
  Edit,
  MoreHorizontal,
  Plus,
  Receipt,
  TrendingUp,
  UserPlus
} from "lucide-react";
import { getTontineById } from "@/api/tontines"; // Your API call

export default function TontineDetailPage() {
  const { id } = useParams(); // Get tontine ID from route
  const [tontine, setTontine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [showContributionForm, setShowContributionForm] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    async function fetchTontine() {
      try {
        const data = await getTontineById(id);
        setTontine(data);
      } catch (err) {
        console.error("Error fetching tontine:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchTontine();
  }, [id]);

  const getTypeBadgeColor = (type) => {
    switch (type) {
      case 'friends': return 'bg-blue-100 text-blue-800';
      case 'family': return 'bg-green-100 text-green-800';
      case 'savings': return 'bg-purple-100 text-purple-800';
      case 'investment': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'late': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!tontine) return <p>Tontine not found</p>;

  const breadcrumbs = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'E-Tontine' },
    { label: 'My Tontines', href: '/tontines' },
    { label: tontine.name },
  ];

  return (
    <div className="space-y-6 mt-10">
      {breadcrumbs && <Breadcrumbs breadcrumbs={breadcrumbs} />}

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{tontine.name}</h1>
            <Badge variant="secondary" className={getTypeBadgeColor(tontine.type)}>
              {tontine.type}
            </Badge>
            {tontine.is_admin && (
              <Badge variant="outline" className="bg-yellow-50 text-yellow-800">
                <Crown className="mr-1 h-3 w-3" />
                Admin
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground">
            Created on {new Date(tontine.created_at).toLocaleDateString()} •
            {tontine.members?.length} members •
            ${tontine.contribution_amount} {tontine.frequency}
          </p>
        </div>

        <div className="flex gap-2">
          {tontine.is_admin && (
            <>
              <Dialog open={showInviteForm} onOpenChange={setShowInviteForm}>
                <DialogTrigger asChild>
                  <Button>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Invite Member
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Invite New Member</DialogTitle>
                  </DialogHeader>
                  <TontineInviteForm
                    tontine={tontine}
                    onSuccess={() => setShowInviteForm(false)}
                    onCancel={() => setShowInviteForm(false)}
                  />
                </DialogContent>
              </Dialog>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <a href={`/tontines/${tontine.id}/edit`}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Tontine
                    </a>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}

          {!tontine.is_admin && (
            <Button>
              <DollarSign className="mr-2 h-4 w-4" />
              Make Contribution
            </Button>
          )}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* ... Same cards as your original code */}
      </div>

      {/* Members and Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* ... Same members and recent activity code ... */}
      </div>

      {/* Contribution Form Modal */}
      <Dialog open={showContributionForm} onOpenChange={setShowContributionForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Record Contribution</DialogTitle>
          </DialogHeader>
          {selectedMember && (
            <TontineContributionForm
              tontineMember={selectedMember}
              onSuccess={() => {
                setShowContributionForm(false);
                setSelectedMember(null);
              }}
              onCancel={() => {
                setShowContributionForm(false);
                setSelectedMember(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
