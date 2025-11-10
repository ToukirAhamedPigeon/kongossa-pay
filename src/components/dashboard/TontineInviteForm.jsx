import React, { useState } from 'react';

export default function TontineInviteForm({ tontine, onSuccess, onCancel }) {
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setSending(true);
    setError('');

    try {
      // Replace with your API call
      await fetch(`/tontines/${tontine.id}/invites`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      setEmail('');
      onSuccess?.();
      alert('Invitation sent!');
    } catch (err) {
      console.error(err);
      setError('Failed to send invitation.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Invite Member to "{tontine.name}"</h2>

      <div style={{ marginBottom: '1rem', padding: '0.5rem', border: '1px solid #eee', borderRadius: '6px' }}>
        <p><strong>Type:</strong> {tontine.type}</p>
        <p><strong>Contribution:</strong> ${tontine.contribution_amount} ({tontine.frequency})</p>
      </div>

      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email Address</label>
        <input
          id="email"
          type="email"
          placeholder="member@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: '100%', padding: '0.5rem', margin: '0.5rem 0', boxSizing: 'border-box' }}
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {email && (
          <div style={{ marginBottom: '1rem', padding: '0.5rem', background: '#f0f8ff', borderRadius: '6px' }}>
            <p>Invitation Preview:</p>
            <ul>
              <li>Email: {email}</li>
              <li>Tontine: {tontine.name}</li>
              <li>Type: {tontine.type}</li>
              <li>Contribution: ${tontine.contribution_amount} ({tontine.frequency})</li>
            </ul>
          </div>
        )}

        <button type="submit" disabled={sending} style={{ padding: '0.5rem 1rem', marginRight: '0.5rem' }}>
          {sending ? 'Sending...' : 'Send Invitation'}
        </button>

        {onCancel && (
          <button type="button" onClick={onCancel} style={{ padding: '0.5rem 1rem' }}>
            Cancel
          </button>
        )}
      </form>
    </div>
  );
}
