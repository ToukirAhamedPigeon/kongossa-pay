import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { createExpense, updateExpense } from "@/api/budget";

const ExpenseForm = ({ budgetId, expense, onClose, onSuccess }) => {
  const [name, setName] = useState(expense?.name || "");
  const [amount, setAmount] = useState(expense?.amount || "");
  const [description, setDescription] = useState(expense?.description || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (expense) {
        await updateExpense(expense.id, { name, amount, description });
        toast({ title: "Expense updated successfully" });
      } else {
        await createExpense(budgetId, { name, amount, description });
        toast({ title: "Expense added successfully" });
      }
      onSuccess();
      onClose();
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Name</label>
        <Input value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <label className="text-sm font-medium">Amount</label>
        <Input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="text-sm font-medium">Description</label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" type="button" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  );
};

export default ExpenseForm;
