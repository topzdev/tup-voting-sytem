import path from "path";

require("dotenv").config({
  path: path.resolve(process.cwd(), process.env.NODE_ENV + ".env"),
});

console.log(
  process.env.SALT_ROUNDS,
  path.resolve(path.resolve(process.cwd(), process.env.NODE_ENV + ".env"))
);

const configs = {
  auth: {
    saltRounds: parseInt(process.env.SALT_ROUNDS),
  },
  database: {
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "dev123",
    database: "tup-voting-system-db-dev",
    synchronize: true,
    logging: true,
  },
};

export default configs;
