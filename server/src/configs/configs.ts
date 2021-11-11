import { User } from "../modules/user/entity/user.entity";

const configs = {
  database: {
    type: "postgres",
    host: "localhost",
    port: 3306,
    username: "postgres",
    password: "dev123",
    database: "tup-voting-db-dev",
    entities: [__dirname + "/src/modules/**/entity/*.ts"],
    synchronize: true,
    logging: false,
  },
};

export default configs;
