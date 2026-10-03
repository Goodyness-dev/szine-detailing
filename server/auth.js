import crypto from 'node:crypto';
import db, { getSetting, saveSettings } from './db.js';

const SESSION_TTL_MS = 14 * 24 * 60 * 60 * 1000; // 14 days

// Password hashing helper using standard PBKDF2
export function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return { salt, hash };
}

export function verifyPassword(password, salt, storedHash) {
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(storedHash));
}

// Ensure default password hash exists in settings
function initAdminAuth() {
  const authData = getSetting('admin_auth', null);
  if (!authData) {
    // Default initial password: toby2024
    const initial = hashPassword('toby2024');
    saveSettings({ admin_auth: initial });
    console.log('[Auth] Initialized default admin credentials (password: toby2024)');
  }
}
initAdminAuth();

export function authenticateAdmin(password) {
  const authData = getSetting('admin_auth', null);
  if (!authData || !authData.salt || !authData.hash) {
    return { success: false, error: 'Authentication not initialized' };
  }

  const isValid = verifyPassword(password, authData.salt, authData.hash);
  if (!isValid) {
    return { success: false, error: 'Invalid password. Please check your credentials.' };
  }

  // Create session
  const token = crypto.randomBytes(32).toString('hex');
  const now = Date.now();
  const expiresAt = now + SESSION_TTL_MS;

  const stmt = db.prepare('INSERT INTO sessions (token, created_at, expires_at) VALUES (?, ?, ?)');
  stmt.run(token, now, expiresAt);

  return {
    success: true,
    token,
    expiresAt,
    user: {
      name: getSetting('admin_name', 'Toby S.'),
      shop: getSetting('shop_name', "Toby's Auto Mechanic")
    }
  };
}

export function verifySession(token) {
  if (!token) return null;

  const stmt = db.prepare('SELECT * FROM sessions WHERE token = ?');
  const session = stmt.get(token);

  if (!session) return null;

  if (Date.now() > session.expires_at) {
    // Session expired
    const del = db.prepare('DELETE FROM sessions WHERE token = ?');
    del.run(token);
    return null;
  }

  return {
    token: session.token,
    expiresAt: session.expires_at,
    user: {
      name: getSetting('admin_name', 'Toby S.'),
      shop: getSetting('shop_name', "Toby's Auto Mechanic")
    }
  };
}

export function revokeSession(token) {
  if (!token) return;
  const stmt = db.prepare('DELETE FROM sessions WHERE token = ?');
  stmt.run(token);
}

export function changeAdminPassword(oldPassword, newPassword) {
  const authData = getSetting('admin_auth', null);
  if (!authData || !authData.salt || !authData.hash) {
    return { success: false, error: 'Auth record missing' };
  }

  if (!verifyPassword(oldPassword, authData.salt, authData.hash)) {
    return { success: false, error: 'Current password does not match.' };
  }

  if (!newPassword || newPassword.length < 6) {
    return { success: false, error: 'New password must be at least 6 characters long.' };
  }

  const updatedAuth = hashPassword(newPassword);
  saveSettings({ admin_auth: updatedAuth });

  return { success: true, message: 'Password updated successfully!' };
}
