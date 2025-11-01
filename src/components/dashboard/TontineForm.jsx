import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Loader2 } from "lucide-react";

// 🟢 Validation Schema
const tontineSchema = z.object({
  name: z.string().min(2, "Name is required"),
  description: z.string().optional(),
  amount: z.coerce.number().min(1, "Amount must be greater than 0"),
  cycle: z.string().min(1, "Please select a cycle"),
  tontine_type_id: z.string().min(1, "Please select a tontine type"),
});

export function TontineForm({
  tontineTypes = [],
  onSubmit,
  onCancel,
  onSuccess,
  defaultValues = {},
}) {
  const form = useForm({
    resolver: zodResolver(tontineSchema),
    defaultValues: {
      name: defaultValues.name || "",
      description: defaultValues.description || "",
      amount: defaultValues.amount || "",
      cycle: defaultValues.cycle || "",
      tontine_type_id: defaultValues.tontine_type_id || "",
    },
  });

  const [submitting, setSubmitting] = React.useState(false);

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      await onSubmit(values);
      form.reset();
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-6 bg-card p-6 rounded-2xl shadow-sm"
      >
        {/* Tontine Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tontine Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Monthly Savings Circle" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Write a short description about this tontine..."
                  {...field}
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Amount */}
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount (per cycle)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter contribution amount"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Cycle */}
        <FormField
          control={form.control}
          name="cycle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cycle</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a cycle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Tontine Type */}
        <FormField
          control={form.control}
          name="tontine_type_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tontine Type</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a tontine type" />
                  </SelectTrigger>
                  <SelectContent>
                    {tontineTypes.map((type) => (
                      <SelectItem key={type.value} value={String(type.value)} title={type.description}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {submitting ? "Creating..." : "Create Tontine"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
