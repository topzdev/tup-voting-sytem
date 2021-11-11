import "reflect-metadata";
import { createConnection } from "typeorm";
import boostrap from "./app";

const database = async () => {
  try {
    await createConnection();
    console.log("Database Created Successfully");
  } catch (error) {
    throw error;
  }
};

database();

boostrap();
