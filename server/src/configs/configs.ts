import { User } from "../modules/user/entity/user.entity";

const configs = {
  auth: {
    saltRounds: process.env.SALT_ROUNDS,
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
