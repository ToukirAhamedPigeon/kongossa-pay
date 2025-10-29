import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumbs from "@/components/dashboard/Breadcumbs";
import { TontineForm } from "@/components/dashboard/TontineForm";
// import { useToast } from "@/hooks/use-toast";
import {
  getTontine,
  updateTontine,
  getTontineTypes,
} from "../api/tontines"; // adjust your API imports

export default function EditTontinePage() {
  const navigate = useNavigate();
  const { id } = useParams(); // tontine id from route
//   const { toast } = useToast();

  const [tontine, setTontine] = useState(null);
  const [tontineTypes, setTontineTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const breadcrumbs = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Tontine System" },
    { label: "My Tontines", href: "/tontines" },
    { label: tontine?.name || "Loading..." },
    { label: "Edit" },
  ];

  // 🔹 Fetch tontine and types
  const fetchTontineData = async () => {
    setLoading(true);
    setError("");
    try {
      const [tontineRes, typesRes] = await Promise.all([
        getTontine(id),
        getTontineTypes(),
      ]);
      setTontine(tontineRes);
      setTontineTypes(typesRes);
    } catch (err) {
      console.error(err);
      setError("Failed to load tontine data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTontineData();
  }, [id]);

  // 🔹 Handlers
  const handleCancel = () => {
    navigate(`/tontines/${id}`);
  };

  const handleSubmit = async (values) => {
    try {
      await updateTontine(id, values);
    //   toast({
    //     title: "Tontine Updated",
    //     description: "Your tontine has been updated successfully.",
    //   });
      navigate(`/tontines/${id}`);
    } catch (err) {
      console.error(err);
    //   toast({
    //     title: "Update Failed",
    //     description: "Failed to update tontine. Try again later.",
    //   });
    }
  };

  // --- Render ---
  if (loading) return <div className="py-16 text-center">Loading...</div>;
  if (error)
    return (
      <div className="py-16 text-center text-red-600">
        {error} <button onClick={fetchTontineData}>Retry</button>
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto mt-10 space-y-6">
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <h1 className="text-3xl font-bold tracking-tight">
        Edit {tontine.name}
      </h1>
      <TontineForm
        tontineTypes={tontineTypes}
        defaultValues={tontine}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
}
