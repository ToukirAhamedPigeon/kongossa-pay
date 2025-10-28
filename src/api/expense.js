// src/api/expenses.js
import api from "../lib/axios";

const API_BASE = import.meta.env.VITE_APP_API_URL || "http://localhost:3000";

// -----------------------------
// Expense API
// -----------------------------

// GET all expenses
export const getExpenses = async () => {
  const res = api.get(`${API_BASE}/expenses`);
  return res.data;
};

// GET single expense by ID
export const getExpenseById = async (id) => {
  const res = api.get(`${API_BASE}/expenses/${id}`);
  return res.data;
};

// GET form data for creating expense
export const getExpenseCreateForm = async () => {
  const res = api.get(`${API_BASE}/expenses/create`);
  return res.data;
};

// POST create new expense
export const createExpense = async (data) => {
  const res = api.post(`${API_BASE}/expenses`, data);
  return res.data;
};

// PUT update expense by ID
export const updateExpense = async (id, data) => {
  const res = api.put(`${API_BASE}/expenses/${id}`, data);
  return res.data;
};

// DELETE expense by ID
export const deleteExpense = async (id) => {
  const res = api.delete(`${API_BASE}/expenses/${id}`);
  return res.data;
};

// GET edit form for expense
export const getExpenseEditForm = async (id) => {
  const res = api.get(`${API_BASE}/expenses/${id}/edit`);
  return res.data;
};

// GET expenses by user
export const getExpensesByUser = async (userId) => {
  const res = api.get(`${API_BASE}/expenses/user/${userId}`);
  return res.data;
};

// GET user expense stats
export const getExpenseStatsByUser = async (userId) => {
  const res = api.get(`${API_BASE}/expenses/stats/user`, {
    params: { userId },
  });
  return res.data;
};