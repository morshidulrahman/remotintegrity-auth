import dotenv from 'dotenv';
import path from 'path';

// dotenv.config({ path: path.join((process.cwd(), '.env')) });
dotenv.config({ path: path.join(process.cwd(), '.env') });


export default {
  NODE_ENV: process.env.NODE_ENV,
  server_url: process.env.SERVER_URL || 'http://localhost:3000',
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  default_password: process.env.DEFAULT_PASS,

  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,


  //   Email Configs
  email_host: process.env.EMAIL_HOST || 'smtp.yourdomain.com',
  email_port: process.env.EMAIL_PORT || 465,
  email_user: process.env.EMAIL_USER || 'noreply@yourdomain.com',
  email_password: process.env.EMAIL_PASSWORD || 'your-email-password',
  email_from: process.env.EMAIL_FROM || 'YouRI <noreply@yourdomain.com>',

  jwt_verify_email_secret: process.env.JWT_VERIFY_EMAIL_SECRET || 'your-verify-email-secret',
  jwt_verify_email_expires_in: process.env.JWT_VERIFY_EMAIL_EXPIRES_IN || '24h',
  jwt_reset_password_secret: process.env.JWT_RESET_PASSWORD_SECRET || 'your-reset-password-secret',
  jwt_reset_password_expires_in: process.env.JWT_RESET_PASSWORD_EXPIRES_IN || '15m',
  client_url: process.env.CLIENT_URL || 'http://localhost:3000',

  // GARI APIs
  gari_api_url : process.env.GARI_API_URL || 'https://gari.remoteintegrity.com/api',
  gari_api_bearer_token : process.env.GARI_API_BEARER_TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJ0ZXN0QHRlc3QuY29tIiwiaWF0IjoxNzQ1ODY2NzA3LCJleHAiOjE3NzY2MjUxMDd9.1Whz5DpsCBKbdO92PvyLLAMb6LUuSfIqlY4LUD3ry7g',

  // Activity-specific configurations
  activity_cleanup_days: process.env.ACTIVITY_CLEANUP_DAYS || '90',
  activity_max_bulk_size: process.env.ACTIVITY_MAX_BULK_SIZE || '100',
  activity_enable_cleanup_job: process.env.ACTIVITY_ENABLE_CLEANUP_JOB === 'true',
  activity_log_level: process.env.ACTIVITY_LOG_LEVEL || 'info',

};
