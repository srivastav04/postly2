import User from "./models/user.js";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { Queue } from "bullmq";
import IORedis from "ioredis";
import dotenv from "dotenv";
dotenv.config();

// Reuse or create Redis connection
const connection = new IORedis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
  tls: {},
});
const emailQueue = new Queue("emailQueue", { connection });

// 🔧 Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 📦 Configure storage to upload directly to Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "postly",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    public_id: (req, file) =>
      `${Date.now()}_${file.originalname.split(".")[0]}`,
  },
});

export const upload = multer({ storage });
export const authController = async (req, res) => {
  const userId = req.auth().userId;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const user = await User.findOne({ userId });
    console.log(user);

    if (!user) {
      return res.status(200).json({ found: null });
    }
    return res.status(200).json({ found: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const setProfile = async (req, res) => {
  const { userId, userName, bio, email } = req.body;
  const avatar = req.file ? req.file.path : req.body.avatar;

  try {
    // ✅ Check if username exists
    const existingUser = await User.findOne({ userName });
    if (existingUser) {
      return res.status(400).json({ error: "Username is already taken" });
    }

    // ✅ Save new user
    const user = new User({
      userId,
      userName,
      email,
      bio,
      profilePicture: avatar,
    });

    await user.save();

    // ✅ Add email job to BullMQ
    emailQueue.add("sendEmail", {
      to: email,
      subject: "Welcome to Postly!",
      text: `Hi ${userName}, welcome aboard! Your profile has been successfully created.\n\n`,
    });
    console.log("Email job added to queue for:", email);

    return res.status(200).json({
      message: "Profile saved successfully",
      // user,
    });
  } catch (error) {
    console.error("Error in setProfile:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
