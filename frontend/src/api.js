const API_BASE = import.meta.env.DEV ? 'http://localhost:5000/api' : '/api';

function getAuthHeaders() {
  const token = localStorage.getItem('exchangeToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function sendRequest(path, method = 'GET', body) {
  const headers = { 'Content-Type': 'application/json', ...getAuthHeaders() };
  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);
  const response = await fetch(`${API_BASE}${path}`, options);
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export async function login(credentials) {
  return sendRequest('/auth/login', 'POST', credentials);
}

export async function register(credentials) {
  return sendRequest('/auth/register', 'POST', credentials);
}

export async function fetchProfile() {
  return sendRequest('/auth/profile');
}

export async function fetchItems(query = '') {
  return sendRequest(`/items${query}`);
}

export async function fetchItemById(id) {
  return sendRequest(`/items/${id}`);
}

export async function createListing(payload) {
  return sendRequest('/items', 'POST', payload);
}

export async function fetchSwaps() {
  return sendRequest('/swaps');
}

export async function createSwap(payload) {
  return sendRequest('/swaps', 'POST', payload);
}

export async function acceptSwap(id) {
  return sendRequest(`/swaps/${id}/accept`, 'POST');
}

export async function rejectSwap(id) {
  return sendRequest(`/swaps/${id}/reject`, 'POST');
}

export async function sendSwapMessage(id, payload) {
  return sendRequest(`/swaps/${id}/message`, 'POST', payload);
}

export async function fetchSwapMessages(id) {
  return sendRequest(`/swaps/${id}/messages`);
}

export async function fetchAdminData(path) {
  return sendRequest(`/admin/${path}`);
}
