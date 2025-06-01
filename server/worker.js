import { Worker } from "bullmq";
import IORedis from "ioredis";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// Create a Redis connection
const connection = new IORedis({
  host: "localhost", // or the Redis container name if inside Docker Compose
  port: 6379,
  maxRetriesPerRequest: null, // 🔥 REQUIRED by BullMQ
});
// Create the BullMQ worker with the Redis connection
const worker = new Worker(
  "emailQueue",
  async (job) => {
    const { to, subject, text, html } = job.data;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "srivastavkancharala@gmail.com",
        pass: "fltt bugl mayz tbvm",
      },
      tls: {
        rejectUnauthorized: false, // ❗Use only for dev/testing
      },
    });

    const mailOptions = {
      from: "srivastavkancharala@gmail.com",
      to,
      subject,
      text,
      html,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error occurred:", error.message);
      } else {
        console.log("Message sent:", info.messageId);
        console.log(`Email sent to ${to}`);
      }
    });
  },
  { connection } // 👈 Pass the Redis connection
);
