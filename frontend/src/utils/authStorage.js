const AUTH_STORAGE_KEY = 'authState';

export function readStoredAuth() {
  if (typeof window === 'undefined') {
    return null;
  }

  const storedAuth = window.localStorage.getItem(AUTH_STORAGE_KEY);

  if (!storedAuth) {
    return null;
  }

  try {
    const parsedAuth = JSON.parse(storedAuth);

    if (!parsedAuth || typeof parsedAuth !== 'object') {
      return null;
    }

    return {
      token: parsedAuth.token || null,
      user: parsedAuth.user || null,
      isAuthenticated: Boolean(parsedAuth.token),
    };
  } catch {
    return null;
  }
}

export function saveStoredAuth(authState) {
  if (typeof window === 'undefined') {
    return;
  }

  if (!authState?.token) {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    window.localStorage.removeItem('authToken');
    return;
  }

  window.localStorage.setItem(
    AUTH_STORAGE_KEY,
    JSON.stringify({
      token: authState.token,
      user: authState.user || null,
    })
  );
  window.localStorage.setItem('authToken', authState.token);
}

export function clearStoredAuth() {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY);
  window.localStorage.removeItem('authToken');
}