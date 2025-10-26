// src/api/expenses.js
import api from "../lib/axios";

const API_BASE = import.meta.env.VITE_APP_API_URL || "http://localhost:3000";

// -----------------------------
// Expense API
// -----------------------------

// GET all expenses
export const getExpenses = async () => {
  return api.get(`${API_BASE}/expenses`);
};

// GET single expense by ID
export const getExpenseById = async (id) => {
  return api.get(`${API_BASE}/expenses/${id}`);
};

// GET form data for creating expense
export const getExpenseCreateForm = async () => {
  return api.get(`${API_BASE}/expenses/create`);
};

// POST create new expense
export const createExpense = async (data) => {
  return api.post(`${API_BASE}/expenses`, data);
};

// PUT update expense by ID
export const updateExpense = async (id, data) => {
  return api.put(`${API_BASE}/expenses/${id}`, data);
};

// DELETE expense by ID
export const deleteExpense = async (id) => {
  return api.delete(`${API_BASE}/expenses/${id}`);
};

// GET edit form for expense
export const getExpenseEditForm = async (id) => {
  return api.get(`${API_BASE}/expenses/${id}/edit`);
};

// GET expenses by user
export const getExpensesByUser = async (userId) => {
  return api.get(`${API_BASE}/expenses/user/${userId}`);
};

// GET user expense stats
export const getExpenseStatsByUser = async (userId) => {
  return api.get(`${API_BASE}/expenses/stats/user`, {
    params: { userId },
  });
};