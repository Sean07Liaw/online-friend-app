const API_BASE_URL = '/api';

function getAuthHeader() {
  const token = localStorage.getItem('accessToken');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

export const api = {
  async signup(username: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Signup failed');
    return data;
  },

  async signin(username: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Signin failed');
    return data;
  },

  async getMe() {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      headers: getAuthHeader(),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Failed to fetch user data');
    return data;
  },

  async getFriends() {
    const response = await fetch(`${API_BASE_URL}/users/friends`, {
      headers: getAuthHeader(),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Failed to fetch friends list');
    return data;
  }
};
