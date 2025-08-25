// EmailJS Configuration
// To set up EmailJS for production:
// 1. Create account at https://emailjs.com
// 2. Set up email service and get Service ID
// 3. Create email template and get Template ID  
// 4. Get your Public Key from account settings
// 5. Replace the values below with your actual EmailJS credentials

export const EMAILJS_CONFIG = {
  SERVICE_ID: 'service_j2s3mfi', // Replace with your EmailJS Service ID
  TEMPLATE_ID: 'template_contact', // Replace with your EmailJS Template ID
  PUBLIC_KEY: 'YOUR_PUBLIC_KEY',   // Replace with your EmailJS Public Key
  
  // Check if configuration is complete
  isConfigured() {
    return this.SERVICE_ID !== 'service_astroplay' && 
           this.TEMPLATE_ID !== 'template_contact' && 
           this.PUBLIC_KEY !== 'YOUR_PUBLIC_KEY'
  }
}

// Email template variables that will be sent to EmailJS:
// - from_email: User's email address
// - to_email: hadeedahmad711@gmail.com  
// - subject: Message subject
// - message: Message content
// - reply_to: User's email for replies
