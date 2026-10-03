import http from 'node:http';
import { URL } from 'node:url';
import {
  insertQuote,
  getAllQuotes,
  getQuoteById,
  updateQuoteStatus,
  saveCustomerQuoteResponse,
  deleteQuote,
  getQuotesSummaryStats,
  getAllSettings,
  saveSettings,
  addQuoteMessage,
  getQuoteMessages,
  getInboxThreads
} from './db.js';
import {
  authenticateAdmin,
  verifySession,
  revokeSession,
  changeAdminPassword
} from './auth.js';
import { sendTelegramAlert, testTelegramConnection } from './services/telegram.js';
import {
  sendCustomerQuoteEmail,
  sendNewQuoteAdminNotification,
  testEmailConnection,
  sendCustomerInboxReplyEmail
} from './services/mailer.js';

const PORT = process.env.PORT || 5001;

function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

function sendJson(res, statusCode, data) {
  setCorsHeaders(res);
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

function sendError(res, statusCode, message) {
  sendJson(res, statusCode, { error: message });
}

async function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(new Error('Invalid JSON payload'));
      }
    });
    req.on('error', reject);
  });
}

function getAuthToken(req) {
  const header = req.headers['authorization'];
  if (!header) return null;
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : null;
}

function requireAuth(req, res) {
  const token = getAuthToken(req);
  if (!token) {
    sendError(res, 401, 'Unauthorized: No token provided');
    return null;
  }
  const session = verifySession(token);
  if (!session) {
    sendError(res, 401, 'Unauthorized: Invalid or expired session');
    return null;
  }
  return session;
}

const server = http.createServer(async (req, res) => {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  try {
    // -------------------------------------------------------------
    // Health Check
    // -------------------------------------------------------------
    if (pathname === '/api/health' && method === 'GET') {
      return sendJson(res, 200, {
        status: 'online',
        server: "Toby's Auto Mechanic Production Backend",
        timestamp: new Date().toISOString()
      });
    }

    // -------------------------------------------------------------
    // Public Quote Submission (Wizard)
    // -------------------------------------------------------------
    if (pathname === '/api/quotes' && method === 'POST') {
      const body = await parseBody(req);
      const quoteId = body.id || `QUOTE-${Date.now().toString().slice(-6)}`;
      const newQuote = insertQuote({ ...body, id: quoteId });

      // Trigger Telegram alert in background
      sendTelegramAlert(newQuote).catch(e => console.error('[API] Telegram dispatch error:', e));

      // Trigger EmailJS alert in background
      sendNewQuoteAdminNotification(newQuote).catch(e => console.error('[API] Email notification error:', e));

      return sendJson(res, 201, {
        success: true,
        quoteId: newQuote.id,
        quote: newQuote
      });
    }

    // -------------------------------------------------------------
    // Authentication Endpoints
    // -------------------------------------------------------------
    if (pathname === '/api/auth/login' && method === 'POST') {
      const { password } = await parseBody(req);
      if (!password) return sendError(res, 400, 'Password is required');

      const result = authenticateAdmin(password);
      if (!result.success) {
        return sendError(res, 401, result.error);
      }
      return sendJson(res, 200, result);
    }

    if (pathname === '/api/auth/me' && method === 'GET') {
      const session = requireAuth(req, res);
      if (!session) return;
      return sendJson(res, 200, {
        authenticated: true,
        user: session.user
      });
    }

    if (pathname === '/api/auth/logout' && method === 'POST') {
      const token = getAuthToken(req);
      if (token) revokeSession(token);
      return sendJson(res, 200, { success: true, message: 'Logged out successfully' });
    }

    if (pathname === '/api/auth/change-password' && method === 'POST') {
      const session = requireAuth(req, res);
      if (!session) return;
      const { oldPassword, newPassword } = await parseBody(req);
      const result = changeAdminPassword(oldPassword, newPassword);
      if (!result.success) {
        return sendError(res, 400, result.error);
      }
      return sendJson(res, 200, result);
    }

    // -------------------------------------------------------------
    // Protected Admin Quotes API
    // -------------------------------------------------------------
    if (pathname === '/api/quotes/stats' && method === 'GET') {
      const session = requireAuth(req, res);
      if (!session) return;
      const stats = getQuotesSummaryStats();
      return sendJson(res, 200, stats);
    }

    if (pathname === '/api/inbox' && method === 'GET') {
      const session = requireAuth(req, res);
      if (!session) return;

      const status = parsedUrl.searchParams.get('status') || undefined;
      const search = parsedUrl.searchParams.get('search') || undefined;
      const threads = getInboxThreads({ search, status });
      return sendJson(res, 200, { threads });
    }

    if (pathname === '/api/quotes' && method === 'GET') {
      const session = requireAuth(req, res);
      if (!session) return;

      const status = parsedUrl.searchParams.get('status') || undefined;
      const search = parsedUrl.searchParams.get('search') || undefined;
      const limit = parsedUrl.searchParams.get('limit') || 100;
      const offset = parsedUrl.searchParams.get('offset') || 0;

      const quotes = getAllQuotes({ status, search, limit, offset });
      return sendJson(res, 200, { quotes });
    }

    // Match /api/quotes/:id
    const quoteIdMatch = pathname.match(/^\/api\/quotes\/([^/]+)$/);
    if (quoteIdMatch) {
      const quoteId = quoteIdMatch[1];
      const session = requireAuth(req, res);
      if (!session) return;

      if (method === 'GET') {
        const quote = getQuoteById(quoteId);
        if (!quote) return sendError(res, 404, 'Quote not found');
        return sendJson(res, 200, quote);
      }

      if (method === 'DELETE') {
        const resDelete = deleteQuote(quoteId);
        return sendJson(res, 200, resDelete);
      }
    }

    // Match /api/quotes/:id/status
    const statusMatch = pathname.match(/^\/api\/quotes\/([^/]+)\/status$/);
    if (statusMatch && method === 'PATCH') {
      const quoteId = statusMatch[1];
      const session = requireAuth(req, res);
      if (!session) return;

      const { status } = await parseBody(req);
      if (!status) return sendError(res, 400, 'Status is required');

      const updated = updateQuoteStatus(quoteId, status);
      return sendJson(res, 200, updated);
    }

    // Match /api/quotes/:id/send-quote
    const sendQuoteMatch = pathname.match(/^\/api\/quotes\/([^/]+)\/send-quote$/);
    if (sendQuoteMatch && method === 'POST') {
      const quoteId = sendQuoteMatch[1];
      const session = requireAuth(req, res);
      if (!session) return;

      const body = await parseBody(req);
      const quote = getQuoteById(quoteId);
      if (!quote) return sendError(res, 404, 'Quote not found');

      // Update quote record in DB with Toby's price and details
      const updatedQuote = saveCustomerQuoteResponse(quoteId, {
        price: body.price,
        breakdown: body.breakdown,
        turnaround: body.turnaround,
        warranty: body.warranty,
        message: body.message
      });

      // Dispatch real email to customer
      const emailResult = await sendCustomerQuoteEmail(updatedQuote, {
        price: body.price,
        breakdown: body.breakdown,
        turnaround: body.turnaround,
        warranty: body.warranty,
        message: body.message
      });

      return sendJson(res, 200, {
        success: true,
        quote: updatedQuote,
        emailDelivery: emailResult
      });
    }

    // Match /api/quotes/:id/messages
    const messagesMatch = pathname.match(/^\/api\/quotes\/([^/]+)\/messages$/);
    if (messagesMatch) {
      const quoteId = messagesMatch[1];
      const session = requireAuth(req, res);
      if (!session) return;

      if (method === 'GET') {
        const messages = getQuoteMessages(quoteId);
        return sendJson(res, 200, { messages });
      }

      if (method === 'POST') {
        const body = await parseBody(req);
        if (!body.message || !body.message.trim()) {
          return sendError(res, 400, 'Message text is required');
        }

        const quote = getQuoteById(quoteId);
        if (!quote) return sendError(res, 404, 'Quote not found');

        const newMsg = addQuoteMessage(quoteId, {
          sender: 'admin',
          senderName: body.senderName || session.user.name || 'Toby S.',
          message: body.message,
          isQuote: Boolean(body.isQuote),
          quotePrice: body.quotePrice || null
        });

        // If price was attached, update quote status
        if (body.quotePrice) {
          updateQuoteStatus(quoteId, 'quoted');
        }

        // Send reply directly to customer email
        sendCustomerInboxReplyEmail(quote, body.message, body.quotePrice).catch(e => console.error('[API] Reply email error:', e));

        return sendJson(res, 201, {
          success: true,
          message: newMsg
        });
      }
    }

    // -------------------------------------------------------------
    // Protected Settings & Self-Serve Integrations
    // -------------------------------------------------------------
    if (pathname === '/api/settings' && method === 'GET') {
      const session = requireAuth(req, res);
      if (!session) return;

      const settings = getAllSettings();
      // Mask sensitive fields for security
      const safe = { ...settings };
      if (safe.admin_auth) delete safe.admin_auth;
      return sendJson(res, 200, safe);
    }

    if (pathname === '/api/settings' && method === 'PUT') {
      const session = requireAuth(req, res);
      if (!session) return;

      const updates = await parseBody(req);
      // Protect auth key from direct overwrite
      if (updates.admin_auth) delete updates.admin_auth;

      const saved = saveSettings(updates);
      const safe = { ...saved };
      if (safe.admin_auth) delete safe.admin_auth;
      return sendJson(res, 200, { success: true, settings: safe });
    }

    if (pathname === '/api/settings/test-telegram' && method === 'POST') {
      const session = requireAuth(req, res);
      if (!session) return;

      const { botToken, chatId } = await parseBody(req);
      const result = await testTelegramConnection(botToken, chatId);
      return sendJson(res, result.success ? 200 : 400, result);
    }

    if (pathname === '/api/settings/test-email' && method === 'POST') {
      const session = requireAuth(req, res);
      if (!session) return;

      const { toEmail, serviceId, templateId, publicKey } = await parseBody(req);
      const result = await testEmailConnection(toEmail, { serviceId, templateId, publicKey });
      return sendJson(res, result.success ? 200 : 400, result);
    }

    // 404 Fallback
    sendError(res, 404, `Endpoint ${method} ${pathname} not found`);
  } catch (err) {
    console.error('[API Server Error]', err);
    sendError(res, 500, err.message || 'Internal Server Error');
  }
});

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(` 🚗 TOBY'S AUTO MECHANIC — BACKEND API SERVER ACTIVE`);
  console.log(` Listening on: http://localhost:${PORT}`);
  console.log(` SQLite Database: server/data/toby.db`);
  console.log(`======================================================\n`);
});
