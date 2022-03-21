import path, { join } from "path";
import { __prod__ } from "../constant";

require("dotenv").config(
  !__prod__
    ? { path: path.resolve(process.cwd(), "development.env") }
    : undefined
);

console.log(
  "config loaded at: ",
  path.resolve(path.resolve(process.cwd(), process.env.NODE_ENV + ".env"))
);

console.log("------------");
console.log("is development? ", !__prod__);

const configs = {
  port: process.env.PORT,
  auth: {
    saltRounds: parseInt(process.env.SALT_ROUNDS),
  },
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

  ballotReceiptPreWord: "TUPELECT",
};

export default configs;
