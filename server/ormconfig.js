const path = require("path");
const join = path.join;

require("dotenv").config();

var __prod__ = process.env.NODE_ENV === "production";

console.log(process.env.NODE_ENV);

var ormPath = !__prod__ ? "src" : "dist";
console.log(join(__dirname, ormPath, "entity", "*.entity.{js,ts}"));

module.exports = {
  type: process.env.DATABASE_TYPE,
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.PORT),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: !__prod__,
  logging: !__prod__,
  entities: [
    join(__dirname, ormPath, "modules", "**", "entity", "*.{js,ts}"),
    join(__dirname, ormPath, "entity", "*.entity.{js,ts}"),
  ],
  migrations: [join(__dirname, ormPath, "migration", "**", "*.{js,ts}")],
  subscribers: [join(__dirname, ormPath, "subscriber", "**", "*.{js,ts}")],
  ssl: {
    require: true,
    rejectUnauthorized: false,
  },
  cli: {
    entitiesDir: join(__dirname, ormPath, "entity"),
    migrationsDir: join(__dirname, ormPath, "migration"),
    subscribersDir: join(__dirname, ormPath, "subscriber"),
  },
};
