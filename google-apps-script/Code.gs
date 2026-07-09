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

// Where generic submissions go when the site doesn't specify recipients.
// Review notifications already carry their own recipient list.
var DEFAULT_RECIPIENTS = ['hello@pulsarpatch.com', 'lclark0684@gmail.com'];

function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);
    var type = payload.type || 'lead';
    var data = payload.data || {};

    var recipients = normalizeRecipients(data.to) || DEFAULT_RECIPIENTS;
    var subject = data.subject || subjectFor(type);
    var htmlBody = data.html || buildFallbackHtml(type, data, payload.submittedAt);

    GmailApp.sendEmail(recipients.join(','), subject, plainText(data), {
      htmlBody: htmlBody,
      name: 'Pulsar Patch',
    });

    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

// A quick health check so you can open the URL in a browser and confirm it's up.
function doGet() {
  return json({ ok: true, message: 'Pulsar mailer is live.' });
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
