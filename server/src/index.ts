import "reflect-metadata";
import { createConnection } from "typeorm";
import bootsrap from "./app";
import cloudinary from "cloudinary";
import configs from "./configs";
require("./cron");

cloudinary.v2.config(configs.cloudinary);

const main = async () => {
  console.log(__dirname, process.cwd());

  await createConnection()
    .then((connect) => {
      console.log("Database Host:", configs.database.host);
      console.log("Connection Name:", connect.name);
      console.log("Database Created Successfully");
    })
    .catch((err) => {
      console.log(err);
    });
  await bootsrap();
};

main();
