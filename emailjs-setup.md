# EmailJS Setup Instructions

## 1. Create EmailJS Account
1. Go to [EmailJS](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

## 2. Set up Email Service
1. In your EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the setup instructions for your chosen provider
5. Note down your **Service ID** (e.g., 'service_astroplay')

## 3. Create Email Template
1. Go to "Email Templates" in your dashboard
2. Click "Create New Template"
3. Use this template structure:

```
Subject: {{subject}}

From: {{from_email}}

Message:
{{message}}

---
This message was sent from the AstroPlay contact form.
Reply to: {{reply_to}}
```

4. Save the template and note down your **Template ID** (e.g., 'template_contact')

## 4. Get Public Key
1. Go to "Account" settings in your EmailJS dashboard
2. Find your **Public Key** (e.g., 'YOUR_PUBLIC_KEY')

## 5. Update Configuration
Replace the placeholder values in `BlogsPage.jsx`:

```javascript
const result = await emailjs.send(
  'your_actual_service_id',    // Replace 'service_astroplay'
  'your_actual_template_id',   // Replace 'template_contact'
  {
    from_email: contactForm.email,
    to_email: 'hadeedahmad711@gmail.com',
    subject: contactForm.subject,
    message: contactForm.message,
    reply_to: contactForm.email
  },
  'your_actual_public_key'     // Replace 'YOUR_PUBLIC_KEY'
)
```

## 6. Test the Contact Form
1. Fill out the contact form on your website
2. Check your email (hadeedahmad711@gmail.com) for the message
3. Verify that the form resets and shows success message

## Security Notes
- EmailJS public key is safe to use in frontend code
- The free plan allows 200 emails per month
- Consider rate limiting for production use
