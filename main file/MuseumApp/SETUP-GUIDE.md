# Luminos Website — Setup Guide

Everything you need to take this site live at **luminospsychology.com**. No coding required.
Total cost: ~$12/year (just the domain). Hosting and the contact form are free.

---

## Step 1 — Turn on the contact form (Formspree)

The form is already built into the site. You just need to connect it to your email.

1. Go to **https://formspree.io** and create a free account (use the email where you want
   to receive inquiries — e.g. Ibis's email).
2. Click **+ New Form**, name it "Luminos Contact", and pick the destination email.
3. Formspree gives you an endpoint that looks like:
   `https://formspree.io/f/abcdwxyz`  ← the `abcdwxyz` part is your **form ID**.
4. Open `index.html`, find this line (it's in the contact section near the bottom):

   ```html
   <form class="contact-form" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
   ```

   Replace `YOUR_FORM_ID` with your real ID. Save.

   > Tell me your form ID and I'll make this edit for you.

5. The first time someone submits, Formspree emails you to confirm the form. Done.

**Free tier:** 50 submissions/month — plenty for a private practice.

---

## Step 2 — Put the site online (Netlify, free)

Netlify hosts the site for free and gives you a temporary address like
`luminos-abc123.netlify.app` immediately. You'll point your real domain at it in Step 3.

### Easiest method — drag & drop
1. Go to **https://app.netlify.com** and sign up (free).
2. On the dashboard, find the **"Want to deploy a new site without connecting to Git?
   Drag and drop your site output folder here"** box.
3. Drag the **entire `luminos-site` folder** into that box.
4. Wait ~20 seconds. Your site is live at a `*.netlify.app` URL. Test it!

> Any time you change the files, just drag the folder in again to update.

---

## Step 3 — Register the domain (luminospsychology.com)

1. Go to a registrar — I recommend **Cloudflare** (at-cost pricing, ~$10/yr) or
   **Porkbun** / **Namecheap** (~$11–13/yr). Avoid GoDaddy upsells.
2. Search for `luminospsychology.com`. If it's taken, alternates: `luminospsychology.com`,
   `luminospsychoed.com`, `luminoslearning.com`.
3. Buy it. Skip all the add-ons they try to upsell (you don't need their hosting,
   email, or "privacy" — privacy is free at Cloudflare/Porkbun).

---

## Step 4 — Connect the domain to Netlify

1. In Netlify, open your site → **Domain management** → **Add a domain**.
2. Enter `luminospsychology.com` → **Verify** → **Add domain**.
3. Netlify shows you DNS records (or nameservers) to set.
4. Log into your registrar (where you bought the domain) and either:
   - **Easiest:** change the **nameservers** to the ones Netlify gives you, OR
   - Add the **A record / CNAME** records Netlify lists.
5. Wait. DNS can take anywhere from 10 minutes to a few hours to propagate.
6. Netlify automatically issues a free HTTPS certificate. Your site is live and secure
   at **https://luminospsychology.com**. 🎉

---

## Step 5 — A professional email (optional, recommended)

`ibis@luminospsychology.com` looks far more credible than a personal Gmail.
- **Cloudflare Email Routing** (free): forwards `ibis@luminospsychology.com` → your existing
  inbox. Great if you just want to receive mail.
- **Google Workspace** (~$6/mo): full mailbox you can send from, with calendar + drive.

---

## Quick reference

| Thing | Where | Cost |
|-------|-------|------|
| Contact form | formspree.io | Free |
| Hosting | netlify.com | Free |
| Domain | Cloudflare / Porkbun | ~$10–12/yr |
| HTTPS / SSL | Netlify (automatic) | Free |
| Email forwarding | Cloudflare | Free |

---

## Files in this folder

- `index.html` — Home page
- `services.html` — Services
- `about.html` — About / Ibis Mendoza
- `faq.html` — FAQ + Contact form
- `styles.css` — All the styling
- `main.js` — Menu, scroll animations, FAQ accordion, form handling
- `ibis.jpg` — Ibis's headshot
- `SETUP-GUIDE.md` — This file

> When you deploy to Netlify, drag the **whole folder** in so every page, the
> stylesheet, the script, and the photo all go together.

Need help with any step? Just ask — I can make edits, swap in your real bio, add a
headshot, or adjust copy any time.
