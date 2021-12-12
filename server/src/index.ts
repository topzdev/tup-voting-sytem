import "reflect-metadata";
import { createConnection } from "typeorm";
import bootsrap from "./app";
import cloudinary from "cloudinary";
import configs from "./configs";

cloudinary.v2.config(configs.cloudinary);

const main = async () => {
  await createConnection()
    .then((connect) => {
      console.log("Database Created Successfully");
    })
    .catch((err) => {
      console.log(err);
    });
  await bootsrap();
};

main();
