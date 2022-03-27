import nodemailer, { SendMailOptions } from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import path from "path";
import configs from "../configs";
import { EmailTemplates } from "../modules/mailer/mailer.helper";

export type NewSendMailOptions<T = object> = {
  template: EmailTemplates;
  context: T;
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
      partialsDir: path.resolve(__dirname, "../templates/emails"),
      defaultLayout: false,
    },
    viewPath: path.resolve(__dirname, "../templates/emails"),
    extName: ".hbs",
  })
);

export const sendBulkMail = (messages: NewSendMailOptions[]) => {
  for (let i = 0; i < messages.length; i++) {
    try {
      transporter.sendMail(messages[i]);
    } catch (error) {
      console.log(error);
    }
  }
};

export const sendSingleMail = (message: NewSendMailOptions) => {
  try {
    transporter.sendMail(message);
  } catch (error) {
    console.log(error);
  }
};
