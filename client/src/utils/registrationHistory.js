const HISTORY_KEY = 'skybridge_registration_history';
const LAST_REGISTRATION_KEY = 'skybridge_last_registration';
const SESSION_LAST_KEY = 'skybridge_last_registration';
const MAX_ENTRIES = 8;

const safeParse = (raw) => {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const buildHistoryEntry = (student, extras = {}) => ({
  registration_number: student?.registration_number || '',
  nik: student?.nik || '',
  full_name: student?.full_name || '',
  email: student?.email || '',
  phone_number: student?.phone_number || '',
  course_package: student?.course_package || '',
  status: student?.status || 'Menunggu Verifikasi',
  payment_status:
    student?.documents?.payment_status ||
    student?.payment_status ||
    'Belum Lunas',
  payment_proof_uploaded: Boolean(
    extras.payment_proof_uploaded ??
      student?.documents?.payment_proof_path
  ),
  registered_at: extras.registered_at || student?.created_at || new Date().toISOString(),
  updated_at: new Date().toISOString(),
  device_saved: true,
});

export const getRegistrationHistory = () => {
  if (typeof window === 'undefined') return [];
  const items = safeParse(localStorage.getItem(HISTORY_KEY));
  return items
    .filter((item) => item?.registration_number && item?.nik)
    .sort((a, b) => new Date(b.updated_at || b.registered_at) - new Date(a.updated_at || a.registered_at));
};

export const getLatestRegistration = () => {
  const items = getRegistrationHistory();
  return items[0] || null;
};

export const saveLastRegistrationCredentials = ({ registration_number, nik }) => {
  if (typeof window === 'undefined' || !registration_number || !nik) return null;
  const payload = {
    registration_number: String(registration_number).trim(),
    nik: String(nik).trim(),
    saved_at: new Date().toISOString(),
  };
  localStorage.setItem(LAST_REGISTRATION_KEY, JSON.stringify(payload));
  try {
    sessionStorage.setItem(SESSION_LAST_KEY, JSON.stringify(payload));
  } catch {
    // sessionStorage may be unavailable in some browsers
  }
  return payload;
};

export const getLastRegistrationCredentials = () => {
  if (typeof window === 'undefined') return null;

  const readKey = (storage, key) => {
    try {
      const raw = storage.getItem(key);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (parsed?.registration_number && parsed?.nik) return parsed;
    } catch {
      return null;
    }
    return null;
  };

  return (
    readKey(localStorage, LAST_REGISTRATION_KEY) ||
    readKey(localStorage, 'studentData') ||
    readKey(sessionStorage, SESSION_LAST_KEY)
  );
};

export const resolveStoredRegistrationEntry = () => {
  const latest = getLatestRegistration();
  if (latest) return latest;

  const credentials = getLastRegistrationCredentials();
  if (credentials?.registration_number && credentials?.nik) {
    return buildHistoryEntry(credentials);
  }

  return null;
};

export const saveRegistrationHistory = (entry) => {
  if (typeof window === 'undefined' || !entry?.registration_number || !entry?.nik) return entry;

  const items = getRegistrationHistory();
  const nextEntry = {
    ...entry,
    updated_at: new Date().toISOString(),
  };

  const existingIndex = items.findIndex(
    (item) =>
      item.registration_number === nextEntry.registration_number ||
      (nextEntry.email && item.email && item.email === nextEntry.email) ||
      item.nik === nextEntry.nik
  );

  if (existingIndex >= 0) {
    items[existingIndex] = { ...items[existingIndex], ...nextEntry };
  } else {
    items.unshift(nextEntry);
  }

  const trimmed = items.slice(0, MAX_ENTRIES);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
  saveLastRegistrationCredentials({
    registration_number: nextEntry.registration_number,
    nik: nextEntry.nik,
  });

  localStorage.setItem(
    'studentData',
    JSON.stringify({
      id: entry.id,
      registration_number: nextEntry.registration_number,
      nik: nextEntry.nik,
      full_name: nextEntry.full_name,
      email: nextEntry.email,
      phone_number: nextEntry.phone_number,
      course_package: nextEntry.course_package,
      status: nextEntry.status,
      documents: {
        payment_status: nextEntry.payment_status,
        payment_proof_path: nextEntry.payment_proof_uploaded ? 'local-uploaded' : null,
      },
    })
  );

  return nextEntry;
};

export const clearRegistrationHistory = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(HISTORY_KEY);
};

export const removeRegistrationHistoryItem = (registrationNumber) => {
  if (typeof window === 'undefined' || !registrationNumber) return;
  const items = getRegistrationHistory().filter(
    (item) => item.registration_number !== registrationNumber
  );
  localStorage.setItem(HISTORY_KEY, JSON.stringify(items));
};

export const syncHistoryFromStudent = (student) => {
  if (!student?.registration_number || !student?.nik) return null;
  return saveRegistrationHistory(buildHistoryEntry(student));
};
