import nodemailer from "nodemailer";
import { env } from "../env";

// const account = await nodemailer.createTestAccount();

export const mail = nodemailer.createTransport({
  host: env.EMAIL_HOST,
  service: env.EMAIL_SERVICE,
  port: 465,
  secure: true,
  auth: {
    user: env.EMAIL_ADDRESS,
    pass: env.EMAIL_PASSWORD,
  },
});
