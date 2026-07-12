/**
 * Pulsar Patch — email notifier (runs in YOUR Google account)
 * ---------------------------------------------------------------------------
 * Receives form + review submissions from the website and emails them from your
 * Gmail. Used for the review-screening notifications (Approve / Wait / Deny) and
 * also as the catch-all for every other form on the site (contact, wholesale,
 * newsletter, etc.) if you point them here.
 *
 * Deploy: see README.md in this folder. In short — paste this into
 * script.google.com, Deploy > New deployment > Web app (Execute as: Me,
 * Who has access: Anyone), authorize Gmail, then put the resulting URL in the
 * Vercel env var VITE_LEADS_ENDPOINT.
 *
 * Nothing secret lives here. The script runs as you, so it sends as you.
 */

// Who receives the review-screening notifications. Edit this list anytime to
// change who gets the emails — no website change needed.
var REVIEW_RECIPIENTS = ['pulsarpatch@gmail.com', 'lclark0684@gmail.com'];

// Fallback for other generic form submissions (contact, newsletter, etc.).
var DEFAULT_RECIPIENTS = ['pulsarpatch@gmail.com', 'lclark0684@gmail.com'];

// The email always sends FROM the Google account this script runs under. To send
// from PulsarPatch.review@gmail.com, create/host this script in that account.

function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);
    var type = payload.type || 'lead';
    var data = payload.data || {};

    var isReview = (type === 'review-screening' || type === 'review-hold');
    var recipients = isReview
      ? REVIEW_RECIPIENTS
      : (normalizeRecipients(data.to) || DEFAULT_RECIPIENTS);
    var subject = data.subject || subjectFor(type);
    var htmlBody = data.html || buildFallbackHtml(type, data, payload.submittedAt);

    // Hitting "Reply" should go straight to the customer. Their address is the
    // form's email (contact) or the reviewer's email (review screening).
    var customerEmail = data.email || (data.review && data.review.email) || '';
    var options = { htmlBody: htmlBody, name: 'Pulsar Patch' };
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(customerEmail).trim())) {
      options.replyTo = String(customerEmail).trim();
    }

    GmailApp.sendEmail(recipients.join(','), subject, plainText(data), options);

    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

// A quick health check so you can open the URL in a browser and confirm it's up.
function doGet() {
  return json({ ok: true, message: 'Pulsar mailer is live.' });
}

/**
 * Run this function in the Apps Script editor to send a test email.
 * This is the easiest way to authorize the script's Gmail access and verify it works.
 */
function testSend() {
  var testPayload = {
    type: 'test-connection',
    data: {
      message: 'If you are reading this, your Google Apps Script is successfully authorized and able to send emails!',
      testTime: new Date().toString()
    },
    submittedAt: new Date().toLocaleString()
  };
  
  var e = {
    postData: {
      contents: JSON.stringify(testPayload)
    }
  };
  
  var response = doPost(e);
  Logger.log('Response content: ' + response.getContentText());
}

function normalizeRecipients(to) {
  if (!to) return null;
  if (Array.isArray(to)) return to.filter(Boolean);
  return [to];
}

function subjectFor(type) {
  if (type === 'review-screening') return 'Pulsar: review awaiting screening';
  if (type === 'review-hold') return 'Pulsar: review held for outreach';
  return 'Pulsar: new ' + type + ' submission';
}

function buildFallbackHtml(type, data, submittedAt) {
  var rows = Object.keys(data)
    .filter(function (k) { return k !== 'html'; })
    .map(function (k) {
      var v = data[k];
      if (v && typeof v === 'object') v = JSON.stringify(v);
      return '<tr><td style="padding:6px 12px;color:#888;">' + k +
        '</td><td style="padding:6px 12px;font-weight:bold;">' + v + '</td></tr>';
    })
    .join('');
  return '<div style="font-family:Arial,sans-serif;max-width:560px;">' +
    '<h2 style="color:#44C8E8;text-transform:uppercase;">New ' + type + ' submission</h2>' +
    '<table style="border-collapse:collapse;width:100%;">' + rows + '</table>' +
    '<p style="color:#aaa;font-size:12px;">Submitted ' + (submittedAt || '') + '</p></div>';
}

function plainText(data) {
  return Object.keys(data)
    .filter(function (k) { return k !== 'html'; })
    .map(function (k) {
      var v = data[k];
      if (v && typeof v === 'object') v = JSON.stringify(v);
      return k + ': ' + v;
    })
    .join('\n');
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
