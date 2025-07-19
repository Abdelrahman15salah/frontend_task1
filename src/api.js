const BASE_URL = 'http://localhost:3000/api';

export async function getUsers() {
  const res = await fetch(`${BASE_URL}/users`);
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
}

export async function addUser(name) {
  const res = await fetch(`${BASE_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name })
  });
  if (!res.ok) throw new Error('Failed to add user');
  return res.json();
}

export async function claimPoints(userId) {
  const res = await fetch(`${BASE_URL}/claim/${userId}`, {
    method: 'POST'
  });
  if (!res.ok) throw new Error('Failed to claim points');
  return res.json();
}

export async function getClaimHistory() {
  const res = await fetch(`${BASE_URL}/claim`);
  if (!res.ok) throw new Error('Failed to fetch claim history');
  return res.json();
} 