import nodemailer, { SendMailOptions } from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import { type } from "os";
import path from "path";
import configs from "../configs";

type Templates = "voter-credentails" | "election-ended" | "election-started";

type NewSendMailOptions = {
  template: Templates;
} & SendMailOptions;

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  auth: {
    user: configs.nodemailer.username,
    pass: configs.nodemailer.password,
  },
});

transporter.use(
  "compile",
  hbs({
    viewEngine: {
      extname: ".html",
      partialsDir: path.resolve("./**/templates"),
      defaultLayout: false,
    },
    viewPath: path.resolve("./**/templates"),
    extName: ".hbs",
  })
);

const sendBulkMail = (messages: NewSendMailOptions[]) => {
  for (let i = 0; i < messages.length; i++) {
    try {
      transporter.sendMail(messages[i]);
    } catch (error) {
      console.log(error);
    }
  }
};

const sendSingleMail = (message: NewSendMailOptions) => {
  transporter.sendMail(message);
};
