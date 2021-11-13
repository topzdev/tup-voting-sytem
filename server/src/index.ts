import { connect } from "net";
import "reflect-metadata";
import { createConnection } from "typeorm";
import boostrap from "./app";

require("dotenv").config();

createConnection()
  .then((connect) => {
    console.log("Database Created Successfully");
    boostrap();
  })
  .catch((err) => {
    throw err;
  });
