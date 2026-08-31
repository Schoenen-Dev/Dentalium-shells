// =====================================================================
//  NEW FILE:  lib/adminAuth.js
//  Shared login helper used by every admin page.
// =====================================================================

export const BACKEND = "https://backend.dentaliumshells.com";

const TOKEN_KEY = "adminToken";

/* ---------------- token storage ---------------- */

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);

  // clean up the old fake-login leftovers
  localStorage.removeItem("adminLoggedIn");
  localStorage.removeItem("adminPassword");
}

/* ---------------- login / logout ---------------- */

export async function login(username, password) {
  const res = await fetch(`${BACKEND}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();

  if (data.success && data.token) {
    setToken(data.token);
  }

  return data;
}

export async function logout() {
  const token = getToken();

  if (token) {
    try {
      await fetch(`${BACKEND}/api/auth/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (e) {
      // even if the server call fails, drop the local token
    }
  }

  clearToken();
}

/* ---------------- authenticated fetch ---------------- */

/**
 * Same as fetch(), but attaches the admin token.
 * If the server says 401, the token is dead -> back to login.
 */
export async function adminFetch(path, options = {}) {
  const token = getToken();

  const headers = { ...(options.headers || {}) };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // don't set Content-Type for FormData - the browser adds the boundary
  if (options.body && !(options.body instanceof FormData)) {
    headers["Content-Type"] = headers["Content-Type"] || "application/json";
  }

  const url = path.startsWith("http") ? path : `${BACKEND}${path}`;

  const res = await fetch(url, { ...options, headers });

  if (res.status === 401) {
    clearToken();

    if (typeof window !== "undefined") {
      window.location.href = "/admin-login";
    }

    throw new Error("Session expired");
  }

  return res;
}

/**
 * Checks with the server that the token is still valid.
 * Use this in every admin page instead of reading localStorage.
 */
export async function verifySession() {
  const token = getToken();

  if (!token) return false;

  try {
    const res = await fetch(`${BACKEND}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      clearToken();
      return false;
    }

    return true;
  } catch (e) {
    return false;
  }
}
