import path, { join } from "path";
import { __prod__ } from "../constant";

require("dotenv").config();

console.log("------------");
console.log("is development? ", !__prod__);

const configs = {
  port: process.env.PORT,
  auth: {
    adminSaltRounds: parseInt(process.env.ADMIN_SALT_ROUNDS),
    voterSaltRounds: parseInt(process.env.VOTER_SALT_ROUNDS),
    voterCryptoSecretKey: process.env.VOTER_CRYPTO_SECRET_KEY,
  },
  voter: {},
  database: {
    type: process.env.DATABASE_TYPE,
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    synchronize: !__prod__,
    logging: !__prod__,
    entities: [
      join(__dirname, "modules", "**", "entity", "*.{js,ts}"),
      join(__dirname, "entity", "*.entity.{js,ts}"),
    ],
    migrations: [join(__dirname, "migration", "**", "*.{js,ts}")],
    subscribers: [join(__dirname, "subscriber", "**", "*.{js,ts}")],
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
    cli: {
      entitiesDir: join(__dirname, "entity"),
      migrationsDir: join(__dirname, "migration"),
      subscribersDir: join(__dirname, "subscriber"),
    },
    extra: {
      ssl: true,
    },
  },
  cloudinary: {
    cloud_name: process.env.CLOUDINARY_API_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    folder: process.env.CLOUDINARY_API_FOLDER,
    secure: true,
  },
  fileExpress: {
    useTempFiles: true,
    tempFileDir: "/tmp/",
    debug: !__prod__,
  },
  session: {
    secret: process.env.SESSION_SECRET,
  },
  jwt: {
    admin: {
      secret: process.env.JWT_ADMIN_SECRET,
      algo: process.env.JWT_ADMIN_ALGO,
      expiresIn: !__prod__ ? "30d" : "1d",
    },
    voter: {
      secret: process.env.JWT_LOCAL_SECRET,
      algo: process.env.JWT_LOCAL_ALGO,
      expiresIn: !__prod__ ? "30d" : "1d",
    },
  },
  nodemailer: {
    username: process.env.NODEMAILER_USERNAME,
    password: process.env.NODEMAILER_PASSWORD,
    host: process.env.NODEMAILER_HOST,
    port: Number(process.env.NODEMAILER_PORT),
  },

  mailgun: {
    domain: process.env.MAILGUN_DOMAIN,
    api_key: process.env.MAILGUN_API_KEY,
  },

  platform: {
    url: process.env.VOTING_PLATFORM_URL,
    shortUrl: process.env.VOTIING_PLATFORM_SHORT_URL,
  },

  ballotReceiptPreWord: "TUPELECT",

  oauth2: {
    client_id: process.env.GOOGLE_OAUTH_CLIENT_ID,
    redirect: process.env.GOOGLE_OAUTH_REDIRECT_URI,
    client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
  },

  security: {
    login_max_attempts: parseInt(process.env.LOGIN_MAX_ATTEMPTS),
    otp_resend_interval: parseInt(process.env.OTP_RESEND_INTERVAL),
    otp_expiration_seconds: parseInt(process.env.OTP_EXPIRATION_SECONDS),
    // otp_expiration_seconds: 20,
  },

  recaptcha: {
    admin_secret_key: process.env.RECAPTCHA_ADMIN_SECRET_KEY,
    platform_secret_key: process.env.RECAPTCHA_PLATFORM_SECRET_KEY,
  },
};

export default configs;
