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

console.log(process.env.NODE_ENV);

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
    ormPath + "/modules/**/entity/*.{js,ts}",
    ormPath + "/entity/*.{js,ts}",
  ],
  migrations: [ormPath + "/migration"],
  subscribers: [ormPath + "/subcriber"],
  ssl: __prod__
    ? false
    : {
        require: true,
        rejectUnauthorized: false,
      },
  cli: {
    entitiesDir: [
      ormPath + "/modules/**/entity/*.{js,ts}",
      ormPath + "/entity/*.{js,ts}",
    ],
    migrationsDir: ormPath + "/migration",
    subscribersDir: ormPath + "/subcriber",
  },
  namingStrategy: new SnakeNamingStrategy(),
};
