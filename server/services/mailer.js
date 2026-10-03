import { getSetting } from '../db.js';

/**
 * Generate high-converting, professional HTML email for customer quote
 */
export function generateCustomerQuoteHtml(quote, quoteDetails) {
  const shopName = getSetting('shop_name', "Toby's Auto Mechanic");
  const shopPhone = getSetting('shop_phone', "(520) 836-6921");
  const shopAddress = getSetting('shop_address', "15276 W Jimmie Kerr Blvd, Ste 1, Casa Grande, AZ 85122");
  const warranty = quoteDetails.warranty || getSetting('default_warranty', '12-month / 12,000-mile parts & labor warranty');
  const price = quoteDetails.price ? `$${quoteDetails.price.toString().replace(/^\$/, '')}` : 'Contact Shop for Pricing';
  const turnaround = quoteDetails.turnaround || '1-2 business days upon drop-off';
  const adminMessage = quoteDetails.message || getSetting('default_quote_notes', '');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Official Repair Quote — ${shopName}</title>
  <style>
    body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0c0c0d; color: #ffffff; }
    .container { max-width: 600px; margin: 20px auto; background-color: #141416; border-radius: 16px; overflow: hidden; border: 1px solid #262629; }
    .header { background: linear-gradient(135deg, #1a1a1e 0%, #0d0d0f 100%); padding: 32px 24px; text-align: center; border-bottom: 2px solid #d9232a; }
    .brand-name { font-size: 24px; font-weight: 900; letter-spacing: 0.5px; margin: 0; color: #ffffff; text-transform: uppercase; }
    .brand-subtitle { font-size: 13px; color: #d9232a; font-weight: 700; margin-top: 4px; text-transform: uppercase; letter-spacing: 1.5px; }
    .content { padding: 32px 24px; }
    .greeting { font-size: 18px; font-weight: 700; color: #ffffff; margin-bottom: 12px; }
    .subtext { font-size: 14px; color: #a1a1aa; line-height: 1.6; margin-bottom: 24px; }
    
    .quote-box { background-color: #1a1a1e; border: 1px solid #333338; border-radius: 12px; padding: 24px; margin-bottom: 24px; }
    .quote-badge { display: inline-block; background-color: #d9232a; color: #ffffff; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 20px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; }
    .price-tag { font-size: 38px; font-weight: 900; color: #ffffff; line-height: 1; margin: 8px 0; }
    .turnaround-label { font-size: 13px; color: #22c55e; font-weight: 600; margin-top: 6px; }

    .details-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    .details-table td { padding: 10px 0; font-size: 14px; border-bottom: 1px solid #26262b; }
    .label { color: #a1a1aa; font-weight: 500; width: 38%; }
    .value { color: #ffffff; font-weight: 600; text-align: right; }

    .note-box { background-color: #1e1b18; border-left: 4px solid #f59e0b; border-radius: 8px; padding: 16px; margin-bottom: 28px; }
    .note-title { font-size: 12px; font-weight: 800; color: #f59e0b; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; }
    .note-content { font-size: 14px; color: #fde68a; line-height: 1.5; margin: 0; }

    .cta-container { text-align: center; margin: 32px 0 16px; }
    .cta-btn { display: inline-block; background-color: #d9232a; color: #ffffff !important; font-weight: 800; font-size: 16px; padding: 16px 32px; border-radius: 12px; text-decoration: none; box-shadow: 0 4px 14px rgba(217, 35, 42, 0.4); }
    .cta-sub { font-size: 13px; color: #71717a; margin-top: 10px; }

    .footer { background-color: #0f0f12; padding: 24px; text-align: center; border-top: 1px solid #262629; font-size: 12px; color: #71717a; line-height: 1.6; }
    .footer a { color: #a1a1aa; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="brand-name">${shopName}</div>
      <div class="brand-subtitle">Casa Grande's Trusted Diesel & Automotive Care</div>
    </div>

    <div class="content">
      <div class="greeting">Hi ${quote.name || 'Valued Customer'},</div>
      <div class="subtext">
        Toby reviewed your repair request for your <strong>${quote.make} (${quote.modelAndYear})</strong>. Here is your official service estimate:
      </div>

      <div class="quote-box">
        <span class="quote-badge">Official Quote • #${quote.id}</span>
        <div class="price-tag">${price}</div>
        <div class="turnaround-label">⏱ Estimated Turnaround: ${turnaround}</div>

        <table class="details-table">
          <tr>
            <td class="label">Vehicle</td>
            <td class="value">${quote.make} ${quote.modelAndYear}</td>
          </tr>
          <tr>
            <td class="label">Service Requested</td>
            <td class="value">${quote.detailedService || quote.serviceCategory}</td>
          </tr>
          ${quote.engineType && quote.engineType !== 'N/A' ? `
          <tr>
            <td class="label">Engine Type</td>
            <td class="value">${quote.engineType}</td>
          </tr>` : ''}
          <tr>
            <td class="label">Towing Needed</td>
            <td class="value">${quote.needsTowing ? 'Yes (Requested)' : 'No (Customer Drop-off)'}</td>
          </tr>
          <tr>
            <td class="label">Shuttle Needed</td>
            <td class="value">${quote.needsShuttle ? 'Yes (Free Local Shuttle)' : 'No'}</td>
          </tr>
          <tr>
            <td class="label">Warranty</td>
            <td class="value">${warranty}</td>
          </tr>
        </table>
      </div>

      ${adminMessage ? `
      <div class="note-box">
        <div class="note-title">Direct Note from Toby:</div>
        <p class="note-content">${adminMessage}</p>
      </div>` : ''}

      <div class="cta-container">
        <a href="tel:${shopPhone.replace(/[^0-9]/g, '')}" class="cta-btn">📞 Call Toby to Lock in Your Spot: ${shopPhone}</a>
        <div class="cta-sub">Or simply reply to this email with any questions!</div>
      </div>
    </div>

    <div class="footer">
      <strong>${shopName}</strong><br>
      📍 ${shopAddress}<br>
      📞 ${shopPhone} | 🕒 Mon–Fri 8:00 AM – 5:00 PM, Sat By Appt<br>
      <p style="margin-top: 12px; color: #52525b;">Family owned and serving Casa Grande & Pinal County motorists since 2009.</p>
    </div>
  </div>
</body>
</html>
`.trim();
}

/**
 * Sends customer quote email
 */
export async function sendCustomerQuoteEmail(quote, quoteDetails) {
  const emailProvider = getSetting('email_provider', 'emailjs');
  const shopName = getSetting('shop_name', "Toby's Auto Mechanic");
  const shopPhone = getSetting('shop_phone', "(520) 836-6921");
  const price = quoteDetails.price ? `$${quoteDetails.price.toString().replace(/^\$/, '')}` : 'Competitive pricing';

  // 1. If EmailJS is configured
  const emailJsServiceId = getSetting('emailjs_service_id', '');
  const emailJsTemplateId = getSetting('emailjs_template_id_quote', '');
  const emailJsPublicKey = getSetting('emailjs_public_key', '');

  if (emailJsServiceId && emailJsTemplateId && emailJsPublicKey) {
    try {
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: emailJsServiceId,
          template_id: emailJsTemplateId,
          user_id: emailJsPublicKey,
          template_params: {
            quote_id: quote.id,
            to_email: quote.email,
            customer_name: quote.name,
            vehicle_make: quote.make,
            vehicle_model: quote.modelAndYear,
            service_name: quote.detailedService || quote.serviceCategory,
            quote_price: price,
            turnaround_time: quoteDetails.turnaround || '1-2 days',
            warranty_text: quoteDetails.warranty || '12-month / 12,000-mile warranty',
            mechanic_note: quoteDetails.message || '',
            shop_phone: shopPhone,
            shop_name: shopName,
            html_content: generateCustomerQuoteHtml(quote, quoteDetails)
          }
        })
      });

      if (response.ok) {
        return { success: true, method: 'emailjs', status: response.status };
      } else {
        const text = await response.text();
        console.warn('[Mailer] EmailJS returned error response:', text);
        return { success: false, method: 'emailjs', error: text };
      }
    } catch (err) {
      console.error('[Mailer] EmailJS dispatch error:', err);
      return { success: false, method: 'emailjs', error: err.message };
    }
  }

  // 2. Fallback / Log
  console.log(`[Mailer] Simulated Quote Email sent to ${quote.email} for Quote #${quote.id} (Price: ${price})`);
  return {
    success: true,
    method: 'simulated',
    recipient: quote.email,
    note: 'EmailJS keys not yet configured in Settings. Preview generated in logs.'
  };
}

/**
 * Dispatches alert email to Toby when new quote arrives
 */
export async function sendNewQuoteAdminNotification(quote) {
  const emailJsServiceId = getSetting('emailjs_service_id', '');
  const emailJsTemplateId = getSetting('emailjs_template_id_notify', '');
  const emailJsPublicKey = getSetting('emailjs_public_key', '');
  const adminEmail = getSetting('shop_email', 'service@tobysautomechanic.com');

  if (emailJsServiceId && emailJsTemplateId && emailJsPublicKey) {
    try {
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: emailJsServiceId,
          template_id: emailJsTemplateId,
          user_id: emailJsPublicKey,
          template_params: {
            quote_id: quote.id,
            to_email: adminEmail,
            customer_name: quote.name,
            customer_email: quote.email,
            customer_phone: quote.phone,
            vehicle: `${quote.make} ${quote.modelAndYear}`,
            service: quote.detailedService || quote.serviceCategory,
            towing: quote.needsTowing ? 'Yes' : 'No',
            shuttle: quote.needsShuttle ? 'Yes' : 'No',
            details: quote.details || 'None provided',
            location: quote.location || 'Casa Grande'
          }
        })
      });
      return { success: response.ok };
    } catch (err) {
      console.error('[Mailer] Admin notification error:', err);
      return { success: false, error: err.message };
    }
  }

  return { skipped: true, reason: 'EmailJS admin template not configured' };
}

/**
 * Test email dispatch endpoint so Toby can verify his setup
 */
export async function testEmailConnection(toEmail, config = {}) {
  const serviceId = config.serviceId || getSetting('emailjs_service_id', '');
  const templateId = config.templateId || getSetting('emailjs_template_id_quote', '');
  const publicKey = config.publicKey || getSetting('emailjs_public_key', '');

  if (!serviceId || !templateId || !publicKey) {
    return {
      success: false,
      error: 'Please fill in your EmailJS Service ID, Template ID, and Public Key.'
    };
  }

  try {
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: serviceId,
        template_id: templateId,
        user_id: publicKey,
        template_params: {
          to_email: toEmail,
          customer_name: 'Test Customer (Verification)',
          quote_id: 'TEST-001',
          vehicle_make: 'Ford',
          vehicle_model: 'F-250 Super Duty',
          service_name: 'Diesel Diagnostics Test',
          quote_price: '$250.00',
          turnaround_time: 'Same Day',
          mechanic_note: 'This is a test notification from your Toby\'s Auto Mechanic admin settings panel to verify delivery.',
          shop_phone: '(520) 836-6921',
          shop_name: "Toby's Auto Mechanic"
        }
      })
    });

    if (response.ok) {
      return { success: true, message: `Test quote email sent to ${toEmail}!` };
    } else {
      const err = await response.text();
      return { success: false, error: err };
    }
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * Sends customer a direct message/reply sent from Toby's site inbox
 */
export async function sendCustomerInboxReplyEmail(quote, replyMessage, quotePrice = null) {
  const emailJsServiceId = getSetting('emailjs_service_id', '');
  const emailJsTemplateId = getSetting('emailjs_template_id_quote', '');
  const emailJsPublicKey = getSetting('emailjs_public_key', '');
  const shopPhone = getSetting('shop_phone', '(520) 836-6921');
  const shopName = getSetting('shop_name', "Toby's Auto Mechanic");

  if (emailJsServiceId && emailJsTemplateId && emailJsPublicKey) {
    try {
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: emailJsServiceId,
          template_id: emailJsTemplateId,
          user_id: emailJsPublicKey,
          template_params: {
            quote_id: quote.id,
            to_email: quote.email,
            customer_name: quote.name,
            vehicle_make: quote.make,
            vehicle_model: quote.modelAndYear,
            service_name: quote.detailedService || quote.serviceCategory,
            quote_price: quotePrice ? `$${quotePrice}` : (quote.quotedPrice ? `$${quote.quotedPrice}` : 'Estimate in note'),
            turnaround_time: quote.estimatedTurnaround || 'Fast turnaround',
            warranty_text: quote.warrantyNote || 'Standard shop warranty',
            mechanic_note: replyMessage,
            shop_phone: shopPhone,
            shop_name: shopName
          }
        })
      });
      return { success: response.ok, status: response.status };
    } catch (err) {
      console.error('[Mailer] Inbox reply dispatch error:', err);
      return { success: false, error: err.message };
    }
  }

  console.log(`[Mailer] Simulated Inbox reply sent to ${quote.email}: "${replyMessage}"`);
  return { success: true, method: 'simulated' };
}
