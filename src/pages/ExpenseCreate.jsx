// src/pages/ExpensesCreate.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Breadcrumbs from "@/components/dashboard/Breadcumbs";
import ExpenseForm from "@/components/dashboard/ExpenseForm";
import { getExpenseCreateForm, createExpense } from "@/api/expense";
// import { toast } from "@/components/ui/use-toast"; 

export default function CreateExpense() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch categories / form data
  const fetchFormData = async () => {
    try {
      setLoading(true);
      const data = await getExpenseCreateForm();
      setCategories(data.budgetCategories || []); // match API response structure
    } catch (err) {
      console.error("Failed to fetch expense form data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFormData();
  }, []);

  const handleSuccess = async (formData) => {
    try {
      await createExpense(formData);
    //   toast({
    //     title: "Expense Added",
    //     description: "Your expense has been recorded successfully.",
    //   });
      navigate("/expenses");
    } catch (err) {
    //   toast({
    //     title: "Error",
    //     description: "Failed to create expense. Please try again.",
    //     variant: "destructive",
    //   });
      console.error(err);
    }
  };

  const handleCancel = () => {
    navigate("/expenses");
  };

  const breadcrumbs = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Budget Management" },
    { label: "Expenses", href: "/expenses" },
    { label: "Add Expense" },
  ];

  return (
    <div className="space-y-6 mt-10">
      {breadcrumbs && <Breadcrumbs breadcrumbs={breadcrumbs} />}

      <div className="max-w-2xl mx-auto mt-6">
        <h1 className="text-3xl font-bold mb-2">Add Expense</h1>
        <p className="text-muted-foreground mb-6">
          Record your new expense under the correct budget category.
        </p>

        {loading ? (
          <p className="text-center py-10 text-muted-foreground">Loading...</p>
        ) : (
          <ExpenseForm
            categories={categories}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        )}
      </div>
    </div>
  );
}
