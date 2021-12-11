import path from "path";
import { __prod__ } from "../../constant";

require("dotenv").config({
  path: path.resolve(process.cwd(), process.env.NODE_ENV + ".env"),
});

console.log(
  "config loaded at: ",
  path.resolve(path.resolve(process.cwd(), process.env.NODE_ENV + ".env"))
);

console.log("------------");
console.log("is development? ", !__prod__);

const configs = {
  auth: {
    saltRounds: parseInt(process.env.SALT_ROUNDS),
  },
  database: {
    type: process.env.DATABASE_TYPE,
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.PORT),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    synchronize: !__prod__,
    logging: !__prod__,
    entities: ["src/modules/**/entity/*.ts", "src/entity/*.entity.ts"],
    migrations: ["src/migration/**/*.ts"],
    subscribers: ["src/subscriber/**/*.ts"],
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
    cli: {
      entitiesDir: "src/entity",
      migrationsDir: "src/migration",
      subscribersDir: "src/subscriber",
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
    local: {
      secret: process.env.JWT_LOCAL_SECRET,
      algo: process.env.JWT_LOCAL_ALGO,
      expiresIn: !__prod__ ? "30d" : "1d",
    },
  },
};

export default configs;
