export default () => ({
  port: Number(process.env.PORT || 3005),
  appname: process.env.APP_NAME || 'helpCentralInfrastructure',
  jwtsecretkey: process.env.JWTSECRETKEY || 'DEFAULTJWTSECRETKEY',
  jwtrefreshsecretkey:
    process.env.JWTRREFRESHSECRETKEY || 'DEFAULTJWTREFRESHSECRETKEY',
  accesstokenexpires: process.env.ACCESSTOKENEXPIRES || 12 * 60 * 60, // 12 hours
  refreshtokenexpires: process.env.REFRESHTOKENEXPIRES || 2 * 24 * 60 * 60, // 2 days
  enterpriselink: process.env.ENTERPRISELINK || '',
  notification_baseurl:
    process.env.UTILITY_SERVICE_BASEURL || 'http://localhost:3005/api/v1/',
  database: {
    uri: process.env.MONGODB_URI,
    name: process.env.DATABASE_NAME || 'helpCentralInfrastructure',
  },
});
