import { Worker } from "bullmq";
import IORedis from "ioredis";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// Create a Redis connection
const connection = new IORedis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
  tls: {},
});
// Create the BullMQ worker with the Redis connection
const worker = new Worker(
  "emailQueue",
  async (job) => {
    const { to, subject, text } = job.data;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USERNAME,
        pass: process.env.GMAIL_PASSWORD, // Use environment variables for security
      },
      // tls: {
      //   rejectUnauthorized: false, // ❗Use only for dev/testing
      // },
    });

    const mailOptions = {
      from: process.env.GMAIL_USERNAME,
      to,
      subject,
      text,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error occurred:", error.message);
      } else {
        console.log(
          process.env.REDIS_URL,
          process.env.GMAIL_USERNAME,
          process.env.GMAIL_PASSWORD
        );
        console.log("Message sent:", info.messageId);
        console.log(`Email sent to ${to}`);
      }
    });
  },
  { connection } // 👈 Pass the Redis connection
);
