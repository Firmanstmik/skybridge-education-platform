const SESSIONS_KEY = 'skybridge_admin_sessions';
const ROLE_INDEX_KEY = 'skybridge_admin_role_index';
const LEGACY_TOKEN_KEY = 'token';

const normalizeRole = (role) => {
  const value = String(role || '').toUpperCase();
  if (value === 'SUPERADMIN') return 'SUPER_ADMIN';
  return value;
};

const parseTokenPayload = (token) => {
  if (!token) return null;
  const payload = JSON.parse(atob(token.split('.')[1]));
  return {
    ...payload,
    id: payload.id,
    role: normalizeRole(payload.role),
    username: payload.username || null,
  };
};

const readJson = (key, fallback) => {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : fallback;
  } catch (_error) {
    return fallback;
  }
};

const writeJson = (key, value) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
};

const getSessions = () => readJson(SESSIONS_KEY, {});
const getRoleIndex = () => readJson(ROLE_INDEX_KEY, {});

const getPathname = (pathname) => {
  if (pathname) return pathname;
  if (typeof window === 'undefined') return '';
  return window.location.pathname;
};

export const getRoleFromPath = (pathname) => {
  const path = getPathname(pathname);
  if (path.startsWith('/staff')) return 'STAFF';
  if (path.startsWith('/kepalalpk')) return 'KEPALA_LPK';
  if (path.startsWith('/admin')) return 'SUPER_ADMIN';
  return null;
};

export const getLoginPathForRole = (role) => {
  const normalized = normalizeRole(role);
  if (normalized === 'STAFF') return '/staff/login';
  if (normalized === 'KEPALA_LPK') return '/kepalalpk/login';
  return '/admin/login';
};

export const getLoginPath = (pathname) => {
  const role = getRoleFromPath(pathname);
  if (role === 'STAFF') return '/staff/login';
  if (role === 'KEPALA_LPK') return '/kepalalpk/login';
  return '/admin/login';
};

const saveSessionRecord = (token, payload) => {
  const userId = String(payload.id);
  const role = normalizeRole(payload.role);
  const sessions = getSessions();

  sessions[userId] = {
    token,
    role,
    userId: payload.id,
    username: payload.username || null,
    updatedAt: Date.now(),
  };

  writeJson(SESSIONS_KEY, sessions);

  const roleIndex = getRoleIndex();
  roleIndex[role] = userId;
  writeJson(ROLE_INDEX_KEY, roleIndex);
};

export const migrateLegacyToken = () => {
  if (typeof window === 'undefined') return;

  const legacyToken = localStorage.getItem(LEGACY_TOKEN_KEY);
  if (!legacyToken) return;

  try {
    const payload = parseTokenPayload(legacyToken);
    if (!payload?.id) return;
    saveSessionRecord(legacyToken, payload);
  } catch (_error) {
    // Ignore invalid legacy token.
  } finally {
    localStorage.removeItem(LEGACY_TOKEN_KEY);
  }
};

export const setAuthSession = (token) => {
  migrateLegacyToken();
  const payload = parseTokenPayload(token);
  if (!payload?.id) {
    throw new Error('Invalid auth token payload');
  }
  saveSessionRecord(token, payload);
  return payload;
};

const resolveSessionForPath = (pathname) => {
  migrateLegacyToken();
  const sessions = getSessions();
  const roleIndex = getRoleIndex();
  const expectedRole = getRoleFromPath(pathname);

  if (expectedRole && roleIndex[expectedRole]) {
    const session = sessions[roleIndex[expectedRole]];
    if (session?.token) return session;
  }

  const sessionList = Object.values(sessions);
  if (sessionList.length === 1) return sessionList[0];

  return null;
};

export const getToken = (pathname) => resolveSessionForPath(pathname)?.token || null;

export const getTokenPayload = (pathname) => {
  const token = getToken(pathname);
  if (!token) return null;
  try {
    return parseTokenPayload(token);
  } catch (_error) {
    return null;
  }
};

export const getAuthHeaders = (pathname) => {
  const token = getToken(pathname);
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const clearAuthSession = (pathname) => {
  migrateLegacyToken();

  const session = resolveSessionForPath(pathname);
  if (!session?.userId) {
    localStorage.removeItem(LEGACY_TOKEN_KEY);
    return;
  }

  const userId = String(session.userId);
  const role = normalizeRole(session.role);
  const sessions = getSessions();
  delete sessions[userId];
  writeJson(SESSIONS_KEY, sessions);

  const roleIndex = getRoleIndex();
  if (roleIndex[role] === userId) {
    delete roleIndex[role];
  }
  writeJson(ROLE_INDEX_KEY, roleIndex);
  localStorage.removeItem(LEGACY_TOKEN_KEY);
};

export const clearAuthSessionByUserId = (userId) => {
  if (!userId) return;
  migrateLegacyToken();

  const id = String(userId);
  const sessions = getSessions();
  const session = sessions[id];
  if (!session) return;

  delete sessions[id];
  writeJson(SESSIONS_KEY, sessions);

  const role = normalizeRole(session.role);
  const roleIndex = getRoleIndex();
  if (roleIndex[role] === id) {
    delete roleIndex[role];
  }
  writeJson(ROLE_INDEX_KEY, roleIndex);
};

export const isRoleAllowed = (pathname, allowedRoles = []) => {
  const payload = getTokenPayload(pathname);
  if (!payload) return false;
  if (!allowedRoles.length) return true;
  const normalizedAllowed = allowedRoles.map(normalizeRole);
  return normalizedAllowed.includes(normalizeRole(payload.role));
};
