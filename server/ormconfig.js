const path = require("path");
const join = path.join;

require("dotenv").config({
  path: path.resolve(process.cwd(), process.env.NODE_ENV + ".env"),
});

var __prod__ = process.env.NODE_ENV === "production";

console.log(join(__dirname, "entity", "*.entity.{js,ts}"));

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
};
