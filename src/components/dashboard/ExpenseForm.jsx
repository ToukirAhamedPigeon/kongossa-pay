// src/pages/ExpenseForm.jsx
import React, { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import { Calendar, Loader2, Receipt, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import Breadcrumbs from "@/components/dashboard/Breadcumbs";
import InputError from "@/components/dashboard/InputError";

import { createExpense, updateExpense } from "../../api/expense";

export default function ExpenseFormPage({ categories, expense = null, budgetCategoryId = null, onSuccess, onCancel }) {
  const isEditing = !!expense;
  const today = format(new Date(), "yyyy-MM-dd");

  const [formData, setFormData] = useState({
    budget_category_id: budgetCategoryId || expense?.budget_category_id || 0,
    title: expense?.title || "",
    amount: expense?.amount || 0,
    expense_date: expense?.expense_date || today,
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const amountRef = useRef(null);

  useEffect(() => {
    if (amountRef.current && amountRef.current.value === "0") {
      amountRef.current.value = "";
      setFormData((prev) => ({ ...prev, amount: 0 }));
    }
  }, [formData.amount]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAmountFocus = () => {
    if (amountRef.current && amountRef.current.value === "0") {
      amountRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    try {
      if (isEditing) {
        await updateExpense(expense.id, formData);
      } else {
        await createExpense(formData);
      }
      onSuccess?.();
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        console.error(err);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const selectedCategory = categories.find((cat) => cat.id === formData.budget_category_id);

  const breadcrumbs = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Expenses", href: "/expenses" },
    { label: isEditing ? "Edit Expense" : "Add Expense" },
  ];

  return (
    <div className="space-y-6 mt-10">
      <Breadcrumbs breadcrumbs={breadcrumbs} />

      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            {isEditing ? "Edit Expense" : "Add New Expense"}
          </CardTitle>
          <CardDescription>
            {isEditing
              ? "Update your expense details below."
              : "Record a new expense to track your spending against your budget."}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category Selection */}
            {!budgetCategoryId && (
              <div className="space-y-2">
                <Label htmlFor="budget_category_id">Budget Category</Label>
                <Select
                  value={formData.budget_category_id.toString()}
                  onValueChange={(value) => handleChange("budget_category_id", parseInt(value))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a budget category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded"
                            style={{ backgroundColor: category.color || "#3b82f6" }}
                          />
                          {category.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <InputError message={errors.budget_category_id} />
              </div>
            )}

            {/* Selected Category Display */}
            {budgetCategoryId && selectedCategory && (
              <div className="rounded-lg border bg-muted/50 p-3">
                <Label className="text-sm font-medium text-muted-foreground mb-1 block">
                  Category
                </Label>
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: selectedCategory.color || "#3b82f6" }}
                  />
                  <span className="font-medium">{selectedCategory.name}</span>
                  <span className="text-sm text-muted-foreground ml-auto">
                    ${selectedCategory.limit_amount} limit
                  </span>
                </div>
              </div>
            )}

            {/* Expense Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Expense Description</Label>
              <Input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="e.g., Grocery shopping, Gas station, Restaurant dinner"
                className="w-full"
                required
              />
              <InputError message={errors.title} />
            </div>

            {/* Amount & Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    id="amount"
                    type="number"
                    ref={amountRef}
                    value={formData.amount}
                    onChange={(e) => handleChange("amount", parseFloat(e.target.value) || 0)}
                    onFocus={handleAmountFocus}
                    placeholder="0.00"
                    className="pl-8 w-full"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <InputError message={errors.amount} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expense_date">Expense Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="expense_date"
                    type="date"
                    value={formData.expense_date}
                    onChange={(e) => handleChange("expense_date", e.target.value)}
                    className="pl-10 w-full"
                    max={today}
                    required
                  />
                </div>
                <InputError message={errors.expense_date} />
              </div>
            </div>

            {/* Summary */}
            <div className="rounded-lg border bg-muted/50 p-4">
              <Label className="text-sm font-medium text-muted-foreground mb-2 block">
                Expense Summary
              </Label>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Description:</span>
                  <span className="font-medium">{formData.title || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Amount:</span>
                  <span className="font-bold text-lg">${formData.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Date:</span>
                  <span className="font-medium">
                    {formData.expense_date
                      ? format(new Date(formData.expense_date), "MMM dd, yyyy")
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={submitting || !formData.budget_category_id}
                className="flex-1 sm:flex-initial"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditing ? "Updating..." : "Adding..."}
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {isEditing ? "Update Expense" : "Add Expense"}
                  </>
                )}
              </Button>

              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
