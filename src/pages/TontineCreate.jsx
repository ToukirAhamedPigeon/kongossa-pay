import React from "react";
import { useNavigate } from "react-router-dom";
import  Breadcrumbs  from "@/components/dashboard/Breadcumbs";
import { TontineForm } from "@/components/dashboard/TontineForm";
// import { useToast } from "@/hooks/use-toast";
import { getTontineTypes, createTontine } from "../api/tontines";
import { useSelector } from "react-redux";

export default function CreateTontine() {
//   const { toast } = useToast();
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const [tontineTypes, setTontineTypes] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  // 🟢 Fetch available tontine types
  React.useEffect(() => {
    const fetchTypes = async () => {
      try {
        const res = await getTontineTypes();
        setTontineTypes(res.tontineTypes || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load tontine types. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchTypes();
  }, []);

  // 🟢 Handle form success
  const handleSuccess = () => {
    // toast({
    //   title: "Tontine Created",
    //   description:
    //     "Your new tontine has been created successfully. You can now invite members.",
    // });
    navigate("/tontines");
  };

  // 🟢 Handle cancel
  const handleCancel = () => {
    navigate("/tontines");
  };

  const breadcrumbs = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "E-Tontine" },
    { label: "My Tontines", href: "/tontines" },
    { label: "Create Tontine" },
  ];

  if (loading)
    return (
      <div className="flex justify-center items-center h-64 text-muted-foreground">
        Loading tontine types...
      </div>
    );

  if (error)
    return (
      <div className="text-center py-16 text-red-600">
        {error}
        <button
          onClick={() => window.location.reload()}
          className="ml-2 underline text-sm"
        >
          Retry
        </button>
      </div>
    );

  return (
    <div className="space-y-6">
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <div className="max-w-3xl mx-auto mt-10">
        <TontineForm
          tontineTypes={tontineTypes}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
          onSubmit={async (data) => {
            try {
              const payload = {
                name: data.name,
                description: data.description || "",
                type: data.tontine_type_id, // map frontend value
                contributionAmount: Number(data.amount),
                contributionFrequency: data.cycle,
                durationMonths: Number(data.duration_months),
                creatorId: user.id, // assign creatorId from auth state
              };

              await createTontine(payload); // backend will assign creatorId
              handleSuccess();
            } catch (err) {
              console.error("Failed to create tontine:", err);
            }
          }}
        />
      </div>
    </div>
  );
}
