import nodemailer from "nodemailer";
import { MailOptions } from "nodemailer/lib/json-transport";

interface Options {
  email: string;
  subject: string;
  textMessage: string;
}

export const sendEmail = async (options: Options) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions: MailOptions = {
    from: process.env.EMAIL_USER,
    to: options.email,
    subject: options.subject,
    text: options.textMessage,
  };

  await transporter.sendMail(mailOptions);
};
