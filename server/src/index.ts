import "reflect-metadata";
import { createConnection } from "typeorm";
import boostrap from "./app";

const main = async () => {
  await createConnection()
    .then((connect) => {
      console.log("Database Created Successfully");
    })
    .catch((err) => {
      throw err;
    });
  await boostrap();
};

main();
