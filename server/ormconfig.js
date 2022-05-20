const path = require("path");
const join = path.join;
const SnakeNamingStrategy =
  require("typeorm-naming-strategies").SnakeNamingStrategy;

var __prod__ = process.env.NODE_ENV === "production";

require("dotenv").config(
  !__prod__
    ? { path: path.resolve(process.cwd(), "development.env") }
    : undefined
);

var ormPath = !__prod__ ? "src" : "dist";
console.log(join(__dirname, ormPath, "entity", "*.entity.{js,ts}"));

module.exports = {
  name: "default",
  type: process.env.DATABASE_TYPE,
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT),
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
  ssl: false,
  // ssl: {
  //   require: true,
  //   rejectUnauthorized: false,
  // },
  cli: {
    entitiesDir: join(__dirname, ormPath, "entity"),
    migrationsDir: join(__dirname, ormPath, "migration"),
    subscribersDir: join(__dirname, ormPath, "subscriber"),
  },
  namingStrategy: new SnakeNamingStrategy(),
};
