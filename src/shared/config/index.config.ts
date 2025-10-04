export default () => ({
  port: Number(process.env.PORT || 3005),
  appname: process.env.APP_NAME || 'helpCentralInfrastructure',
  googleClientId: process.env.GOOGLE_CLIENT_ID || '',
  googleSecret: process.env.GOOGLE_SECRET,
  googleCallbackUrl: process.env.GOOGLE_CALLBACK_URL,
  jwtsecretkey: process.env.JWTSECRETKEY || 'DEFAULTJWTSECRETKEY',
  jwtrefreshsecretkey:
    process.env.JWTRREFRESHSECRETKEY || 'DEFAULTJWTREFRESHSECRETKEY',
  appLink: process.env.APP_LINK || 'https://localhost:3000',
  accesstokenexpires: process.env.ACCESSTOKENEXPIRES || 12 * 60 * 60, // 12 hours
  refreshtokenexpires: process.env.REFRESHTOKENEXPIRES || 3 * 24 * 60 * 60, // 3 days
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
  SMTP_PORT: process.env.SMTP_PORT || 587,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  SMTP_FROM: process.env.SMTP_FROM,
  database: {
    uri: process.env.MONGODB_URI,
    name: process.env.DATABASE_NAME || 'helpCentralInfrastructure',
  },
});
