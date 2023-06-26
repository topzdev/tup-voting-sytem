import nodemailer, { SendMailOptions } from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import path from "path";
import configs from "../configs";
import { EmailTemplates } from "../modules/mailer/mailer.helper";
import mg from "nodemailer-mailgun-transport";
export type NewSendMailOptions<T = object> = {
  template: EmailTemplates;
  context: T;
} & SendMailOptions;

const auth = {
  auth: {
    api_key: configs.mailgun.api_key || "",
    domain: configs.mailgun.domain || "",
  },
};

// const transporter = nodemailer.createTransport(mg(auth));

// const transporter = nodemailer.createTransport({
//   host: configs.nodemailer.host,
//   port: configs.nodemailer.port,
//   auth: {
//     user: configs.nodemailer.username,
//     pass: configs.nodemailer.password,
//   },
// });

// transporter.use(
//   "compile",
//   hbs({
//     viewEngine: {
//       extname: ".html",
//       partialsDir: path.resolve(__dirname, "../templates/emails"),
//       defaultLayout: false,
//     },
//     viewPath: path.resolve(__dirname, "../templates/emails"),
//     extName: ".hbs",
//   })
// );

export const sendBulkMail = (messages: NewSendMailOptions[]) => {
  // for (let i = 0; i < messages.length; i++) {
  //   transporter.sendMail(messages[i], (err, info) => {
  //     if (err) {
  //       console.log(`Error: ${err}`);
  //     } else {
  //       console.log(`Response: ${info}`);
  //       console.log(info);
  //     }
  //   });
  // }
};

export const sendSingleMail = (message: NewSendMailOptions) => {
  // transporter.sendMail(message, (err, info) => {
  //   if (err) {
  //     console.log(`Error: ${err}`);
  //   } else {
  //     console.log(info);
  //     console.log(`Response: ${info}`);
  //   }
  // });
};
