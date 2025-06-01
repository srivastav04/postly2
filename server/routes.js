import express from "express";

import { requireAuth, getAuth } from "@clerk/express";
import { authController, setProfile, upload } from "./controllers.js";

const router = express.Router();

router.get("/check-auth", requireAuth(), authController);
router.post("/setprofile", upload.single("avatar"), setProfile);

export default router;
