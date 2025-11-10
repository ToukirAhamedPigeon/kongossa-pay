import React, { useState } from 'react';

export default function TontineContributionForm({ tontineMember, contribution, onSuccess, onCancel }) {
  const isEditing = !!contribution;
  const today = new Date().toISOString().split('T')[0]; // yyyy-mm-dd

  const [amount, setAmount] = useState(contribution?.amount || tontineMember.tontine.contribution_amount);
  const [date, setDate] = useState(contribution?.contribution_date || today);
  const [status, setStatus] = useState(contribution?.status || 'pending');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = { amount, contribution_date: date, status };

    try {
      if (isEditing) {
        await fetch(`/tontine-contributions/${contribution.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch(`/tontine-members/${tontineMember.id}/contributions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
      onSuccess?.();
    } catch (err) {
      console.error('Error submitting contribution:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '0 auto', padding: 20, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>{isEditing ? 'Edit Contribution' : 'Record Contribution'}</h2>
      <p>Member: {tontineMember.user.name} ({tontineMember.user.email})</p>
      <p>Tontine: {tontineMember.tontine.name}</p>
      <p>Expected Amount: ${tontineMember.tontine.contribution_amount}</p>

      <div style={{ marginBottom: 12 }}>
        <label>Amount:</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
          min="0"
          step="0.01"
          required
          style={{ width: '100%' }}
        />
      </div>

      <div style={{ marginBottom: 12 }}>
        <label>Date:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          max={today}
          required
          style={{ width: '100%' }}
        />
      </div>

      <div style={{ marginBottom: 12 }}>
        <label>Status:</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ width: '100%' }}>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="late">Late</option>
        </select>
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <button type="submit" disabled={loading}>
          {loading ? (isEditing ? 'Updating...' : 'Recording...') : isEditing ? 'Update' : 'Record'}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
