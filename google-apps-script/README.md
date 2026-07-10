# Send Pulsar emails through your Gmail (Google Apps Script)

This connects the website's review-screening notifications (and any other form)
to **your own Google account**, so emails send from your Gmail. It's free, needs
no server, and stores no secrets in the code.

You do the clicking in Google + Vercel. The code is already written (`Code.gs`).
Takes about 10 minutes.

---

## Step 1 — Create the script

1. Go to **https://script.google.com** and sign in with the Google account you
   want the emails to send from.
2. Click **New project**.
3. Delete whatever is in the editor, then paste in the entire contents of
   **`Code.gs`** (the file next to this README).
4. (Optional) Change the `DEFAULT_RECIPIENTS` line near the top if you want a
   different fallback address. Review emails already carry their own recipients
   (your admin address + lclark0684@gmail.com), so you can leave this as is.
5. Click the **Save** icon. Name the project something like `Pulsar Mailer`.
6. **Authorize & Test sending:** At the top of the editor, select **`testSend`** from the dropdown list of functions and click the **Run** button.
   - Google will ask you to authorize. Click **Review permissions**, pick your Google account, and allow the script to access Gmail.
   - You will see a warning: "Google hasn't verified this app." That is normal for personal scripts. Click **Advanced > Go to Pulsar Mailer (unsafe)**, then click **Allow**.
   - Check your Gmail inbox (or Spam) for a test email with the subject *"Pulsar: new test-connection submission"*. This confirms the script is authorized and working!

## Step 2 — Deploy it as a web app

1. Top right: **Deploy > New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Set:
   - **Description:** Pulsar mailer
   - **Execute as:** **Me** (your email)
   - **Who has access:** **Anyone**
4. Click **Deploy**. (Since you already authorized Gmail in Step 1, it should deploy immediately. If it asks for authorization again, follow the same steps as above).
6. Copy the **Web app URL**. It looks like:
   `https://script.google.com/macros/s/AKfy...../exec`

> Quick check: paste that URL into a browser. You should see
> `{"ok":true,"message":"Pulsar mailer is live."}`.

## Step 3 — Point the website at it

1. In **Vercel**, open your project > **Settings > Environment Variables**.
2. Add a variable:
   - **Name:** `VITE_LEADS_ENDPOINT`
   - **Value:** the Web app URL from Step 2
   - Apply to **Production** and **Preview**.
3. (Optional) Add `VITE_ADMIN_EMAIL` set to the admin inbox you want copied on
   review emails (defaults to `hello@pulsarpatch.com`).
4. **Redeploy** the site so the new env var takes effect (Deployments > … >
   Redeploy, or push a commit).

## Step 4 — Test it

1. Go to your live `/reviews` page and submit a test review (a low star rating
   triggers the "reach out" highlight).
2. Within a few seconds, the screening email should land in your Gmail (and the
   copied address), with **Approve / Wait / Deny** buttons and the reviewer's
   email, phone, and order number.
3. Clicking a button opens `/admin` and applies that action to the review.

---

## Notes

- Emails send **from your Gmail address**. Consumer Gmail allows ~500 sends/day;
  Google Workspace ~2,000. Review notifications will never come close.
- Changing `Code.gs` later? You must **Deploy > Manage deployments > Edit
  (pencil) > New version > Deploy** for changes to go live. A brand-new
  deployment creates a *new* URL; editing the existing one keeps the same URL.
- This same endpoint also handles the other site forms (contact, wholesale,
  newsletter) if you leave `VITE_LEADS_ENDPOINT` pointed here — they'll email you
  a simple summary.
- To stop sending, remove `VITE_LEADS_ENDPOINT` in Vercel and redeploy. The site
  falls back to its simulated (no-op) submit and the review queue still works in
  the dashboard.
