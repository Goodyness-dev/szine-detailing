/**
 * Production API Client for Szine Detailing Admin & Backend
 */

const TOKEN_STORAGE_KEY = 'szine_admin_token';

export function getStoredToken() {
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setStoredToken(token) {
  try {
    if (token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  } catch (e) {
    console.warn('Storage warning:', e);
  }
}

const API_BASE = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

function buildUrl(endpoint) {
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  if (API_BASE.startsWith('http')) {
    const cleanPath = path.startsWith('/api') ? path.slice(4) : path;
    return `${API_BASE}${cleanPath}`;
  }
  return path.startsWith('/api') ? path : `/api${path}`;
}

async function request(endpoint, options = {}) {
  const token = getStoredToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  const url = buildUrl(endpoint);

  const res = await fetch(url, {
    ...options,
    headers
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const error = new Error(data.error || `HTTP ${res.status} request failed`);
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}

// ------------------------------------------------------------------

export const authApi={
 async login(password){const result=await request('/api/auth/login',{method:'POST',body:JSON.stringify({password:password.trim()})});if(result.token)setStoredToken(result.token);return result;},
 async verify(){if(!getStoredToken())return {authenticated:false};try{return await request('/api/auth/me',{method:'GET'});}catch{setStoredToken(null);return {authenticated:false};}},
 async logout(){try{return await request('/api/auth/logout',{method:'POST'});}finally{setStoredToken(null);}},
 changePassword(oldPassword,newPassword){return request('/api/auth/change-password',{method:'POST',body:JSON.stringify({oldPassword,newPassword})});}
};
const post=(url,data)=>request(url,{method:'POST',body:JSON.stringify(data)});
export const quotesApi={
 getStats:()=>request('/api/quotes/stats'),
 getQuotes:({status='all',search='',limit=100,offset=0}={})=>request('/api/quotes?'+new URLSearchParams({status,search,limit,offset})),
 getQuote:id=>request('/api/quotes/'+encodeURIComponent(id)),
 updateStatus:(id,status)=>request('/api/quotes/'+encodeURIComponent(id)+'/status',{method:'PATCH',body:JSON.stringify({status})}),
 sendQuote:(id,data)=>post('/api/quotes/'+encodeURIComponent(id)+'/send-quote',data),
 deleteQuote:id=>request('/api/quotes/'+encodeURIComponent(id),{method:'DELETE'}),
 submitPublicQuote:data=>post('/api/quotes',data),
 create:data=>post('/api/quotes',data),
 getInbox:({status='all',search=''}={})=>request('/api/inbox?'+new URLSearchParams({status,search})),
 getMessages:id=>request('/api/quotes/'+encodeURIComponent(id)+'/messages'),
 sendMessage:(id,data)=>post('/api/quotes/'+encodeURIComponent(id)+'/messages',data)
};
export const settingsApi={
 getSettings:()=>request('/api/settings'),
 saveSettings:settings=>request('/api/settings',{method:'PUT',body:JSON.stringify(settings)}),
 testTelegram:(botToken,chatId)=>post('/api/settings/test-telegram',{botToken,chatId}),
 testEmail:payload=>post('/api/settings/test-email',payload)
};