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
  entities: ["src/modules/**/entity/*.ts", "src/entity/*.ts"],
  migrations: ["src/migration"],
  subscribers: ["src/subcriber"],
  ssl: !__prod__
    ? false
    : {
        require: true,
        rejectUnauthorized: false,
      },
  cli: {
    entitiesDir: ["src/modules/**/entity/*.ts", "src/entity/*.ts"],
    migrationsDir: "src/migration",
    subscribersDir: "src/subcriber",
  },
  namingStrategy: new SnakeNamingStrategy(),
};
