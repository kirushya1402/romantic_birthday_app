# 🔒 Security & HTTPS Protection Guide

This web application has been built with modern security best practices to protect user data, prevent tampering, and enforce encrypted HTTPS connections.

---

## 🛡️ Active Security Protections

1. **Automatic Insecure Request Upgrade (`upgrade-insecure-requests`)**:
   - Forces all HTTP resource requests to automatically upgrade to encrypted `https://` URLs.
2. **Content Security Policy (CSP)**:
   - Restricts resource loading exclusively to trusted sources (`'self'` and Google Fonts) to prevent Cross-Site Scripting (XSS).
3. **HTTP Strict Transport Security (HSTS)**:
   - Instructs browsers to strictly enforce HTTPS connections (`max-age=31536000`).
4. **Clickjacking Protection (`X-Frame-Options: SAMEORIGIN`)**:
   - Prevents unauthorized third-party websites from embedding the site inside hidden iFrames.
5. **MIME Sniffing Protection (`X-Content-Type-Options: nosniff`)**:
   - Prevents browser MIME-type spoofing vulnerabilities.
6. **Input Sanitization**:
   - Client-side input cleaning and secure string comparison for credentials and date inputs.

---

## 🌐 Deploying with Free HTTPS / SSL

To get an official `https://` web address for your website (e.g. `https://mama-birthday.netlify.app`), choose any of the free deployment options below:

### Option 1: Netlify (Recommended - 1 Min)
1. Go to [Netlify.com](https://www.netlify.app) and log in for free.
2. Drag & drop the `romantic_birthday_app` folder into the Netlify deployment box.
3. Netlify will automatically generate a free, secure `https://...` link with SSL renewal enabled!

### Option 2: Vercel (1 Min)
1. Install Vercel CLI or go to [Vercel.com](https://vercel.com).
2. Deploy the `romantic_birthday_app` folder.
3. Vercel provisions an SSL certificate (`https://your-app.vercel.app`) instantly.

### Option 3: GitHub Pages (Free)
1. Push this folder to a GitHub repository.
2. Go to **Settings > Pages** and enable GitHub Pages.
3. Check **"Enforce HTTPS"** to activate free SSL for `https://username.github.io/repo`.
