export default () => ({
  port: Number(process.env.PORT || 3005),
  appname: process.env.APP_NAME || 'helpCentralInfrastructure',
  googleClientId: process.env.GOOGLE_CLIENT_ID || '',
  googleSecret: process.env.GOOGLE_SECRET,
  googleCallbackUrl: process.env.GOOGLE_CALLBACK_URL,
  jwtsecretkey: process.env.JWTSECRETKEY || 'DEFAULTJWTSECRETKEY',
  jwtrefreshsecretkey:
    process.env.JWTRREFRESHSECRETKEY || 'DEFAULTJWTREFRESHSECRETKEY',
  accesstokenexpires: process.env.ACCESSTOKENEXPIRES || 12 * 60 * 60, // 12 hours
  refreshtokenexpires: process.env.REFRESHTOKENEXPIRES || 3 * 24 * 60 * 60, // 3 days
  database: {
    uri: process.env.MONGODB_URI,
    name: process.env.DATABASE_NAME || 'helpCentralInfrastructure',
  },
});
