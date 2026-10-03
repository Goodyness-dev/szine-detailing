/**
 * Quote Submission Service for Toby's Auto Mechanic
 * 
 * Configured currently to:
 * 1. Log full submission payload to browser console.
 * 2. Save locally in localStorage for verification.
 * 3. Provide ready-to-activate infrastructure for EmailJS and Telegram Bot API.
 */

import { quotesApi } from './api';

// Configuration for third-party integrations (Fill in when ready to activate)
export const INTEGRATION_CONFIG = {
  // EmailJS Configuration
  emailJs: {
    enabled: false, // Set to true once EmailJS keys are added
    serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || 'YOUR_EMAILJS_SERVICE_ID',
    templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'YOUR_EMAILJS_TEMPLATE_ID',
    publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'YOUR_EMAILJS_PUBLIC_KEY',
  },
  
  // Telegram Bot Configuration
  telegram: {
    enabled: false, // Set to true once Telegram Bot token & chat ID are added
    botToken: import.meta.env.VITE_TELEGRAM_BOT_TOKEN || 'YOUR_TELEGRAM_BOT_TOKEN',
    chatId: import.meta.env.VITE_TELEGRAM_CHAT_ID || 'YOUR_TELEGRAM_CHAT_ID',
  }
};

/**
 * Format quote data into a human-readable summary
 */
export const formatQuoteSummary = (data) => {
  return {
    submittedAt: new Date().toLocaleString(),
    id: `QUOTE-${Date.now().toString().slice(-6)}`,
    customer: {
      name: data.name,
      email: data.email,
      phone: data.phone || 'Not provided',
      preferredLocation: data.location || 'Casa Grande area',
    },
    vehicle: {
      make: data.make,
      modelAndYear: data.modelAndYear,
    },
    service: {
      category: data.serviceCategory,
      detailedService: data.serviceCategory === 'Custom issue' ? 'Custom Issue' : data.detailedService,
      engineType: data.engineType || 'N/A',
      customIssue: data.customIssue || 'N/A',
      details: data.details || 'None provided',
    },
    logistics: {
      needsTowing: data.needsTowing ? 'Yes' : 'No',
      needsShuttle: data.needsShuttle ? 'Yes' : 'No',
      timeline: data.timeline,
      specificDate: data.specificDate || 'N/A',
    }
  };
};

/**
 * Sends notification to Telegram channel or bot chat
 */
export const sendTelegramNotification = async (quote) => {
  if (!INTEGRATION_CONFIG.telegram.enabled) {
    return { skipped: true, reason: 'Telegram integration is not enabled' };
  }

  const message = `
🚗 *NEW QUOTE REQUEST — TOBY'S AUTO MECHANIC*
━━━━━━━━━━━━━━━━━━━━
👤 *Customer:* ${quote.customer.name}
📞 *Phone:* ${quote.customer.phone}
✉️ *Email:* ${quote.customer.email}
📍 *Location:* ${quote.customer.preferredLocation}

🚙 *Vehicle:* ${quote.vehicle.make} (${quote.vehicle.modelAndYear})
🛠 *Category:* ${quote.service.category}
🔧 *Service:* ${quote.service.detailedService}
${quote.service.engineType !== 'N/A' ? `⚙️ *Engine:* ${quote.service.engineType}\n` : ''}${quote.service.customIssue !== 'N/A' ? `📝 *Custom Issue:* ${quote.service.customIssue}\n` : ''}
💬 *Notes:* ${quote.service.details}

🛞 *Towing:* ${quote.logistics.needsTowing}
🚐 *Shuttle:* ${quote.logistics.needsShuttle}
⏰ *Timeline:* ${quote.logistics.timeline} ${quote.logistics.specificDate !== 'N/A' ? `(${quote.logistics.specificDate})` : ''}
━━━━━━━━━━━━━━━━━━━━
Quote ID: #${quote.id}
  `.trim();

  try {
    const url = `https://api.telegram.org/bot${INTEGRATION_CONFIG.telegram.botToken}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: INTEGRATION_CONFIG.telegram.chatId,
        text: message,
        parse_mode: 'Markdown'
      })
    });
    return await response.json();
  } catch (error) {
    console.error('Failed to send Telegram notification:', error);
    return { error };
  }
};

/**
 * Sends notification via EmailJS REST API
 */
export const sendEmailJsNotification = async (quote) => {
  if (!INTEGRATION_CONFIG.emailJs.enabled) {
    return { skipped: true, reason: 'EmailJS integration is not enabled' };
  }

  try {
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: INTEGRATION_CONFIG.emailJs.serviceId,
        template_id: INTEGRATION_CONFIG.emailJs.templateId,
        user_id: INTEGRATION_CONFIG.emailJs.publicKey,
        template_params: {
          quote_id: quote.id,
          customer_name: quote.customer.name,
          customer_email: quote.customer.email,
          customer_phone: quote.customer.phone,
          vehicle_make: quote.vehicle.make,
          vehicle_info: quote.vehicle.modelAndYear,
          service_category: quote.service.category,
          service_detail: quote.service.detailedService,
          additional_details: quote.service.details,
          needs_towing: quote.logistics.needsTowing,
          needs_shuttle: quote.logistics.needsShuttle,
          timeline: quote.logistics.timeline,
          location: quote.customer.preferredLocation
        }
      })
    });
    return { success: response.ok };
  } catch (error) {
    console.error('Failed to send EmailJS notification:', error);
    return { error };
  }
};

/**
 * Main submission function called by the Wizard UI
 */
export const submitQuoteRequest = async (rawData) => {
  const quote = formatQuoteSummary(rawData);

  // 1. Prominent Console Log for development & verification
  console.group('%c 🚗 TOBY\'S AUTO MECHANIC — NEW QUOTE RECEIVED! ', 'background: #d9232a; color: #ffffff; font-size: 14px; font-weight: bold; padding: 4px 8px; border-radius: 4px;');
  console.log('Quote Summary:', quote);
  console.log('Raw Form Data:', rawData);
  console.groupEnd();

  // 2. Persist locally in localStorage for backup / instant client access
  try {
    const existing = JSON.parse(localStorage.getItem('tobys_quotes') || '[]');
    existing.unshift(quote);
    localStorage.setItem('tobys_quotes', JSON.stringify(existing.slice(0, 50)));
  } catch (e) {
    console.warn('Could not save to localStorage', e);
  }

  // 3. Submit directly to production backend (SQLite persistence + backend alerts)
  try {
    const backendPayload = {
      id: quote.id,
      name: quote.customer.name,
      email: quote.customer.email,
      phone: quote.customer.phone,
      location: quote.customer.preferredLocation,
      make: quote.vehicle.make,
      modelAndYear: quote.vehicle.modelAndYear,
      serviceCategory: quote.service.category,
      detailedService: quote.service.detailedService,
      engineType: quote.service.engineType,
      customIssue: quote.service.customIssue,
      details: quote.service.details,
      needsTowing: rawData.needsTowing,
      needsShuttle: rawData.needsShuttle,
      timeline: quote.logistics.timeline,
      specificDate: quote.logistics.specificDate
    };

    await quotesApi.submitPublicQuote(backendPayload);
    console.log('✅ Quote saved to production SQLite backend');
  } catch (backendErr) {
    console.warn('Backend API submission note (using local cache):', backendErr.message || backendErr);
  }

  // 4. Trigger client-side external integrations asynchronously if enabled
  if (INTEGRATION_CONFIG.telegram.enabled) {
    sendTelegramNotification(quote).then(res => console.log('Telegram dispatch:', res));
  }
  if (INTEGRATION_CONFIG.emailJs.enabled) {
    sendEmailJsNotification(quote).then(res => console.log('EmailJS dispatch:', res));
  }

  // Simulate minimal UI delay for realistic polish
  await new Promise(resolve => setTimeout(resolve, 500));

  return {
    success: true,
    quoteId: quote.id,
    data: quote
  };
};
