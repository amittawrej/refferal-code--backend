import express from "express";
import { twitterLogin } from "../controller/twitterAuth.js";
import { metamaskLogin, nounce } from "../controller/metamaskAuth.js";

import {authMiddleware,  refreshAccessToken } from "../middleware/authMiddlerware.js";
import User from "../models/user.js";

const router = express.Router();

// Twitter login route
router.post("/auth/twitter", twitterLogin);
router.get("/auth/metamask/nonce", nounce);
router.post("/auth/metamask", metamaskLogin);
router.post("/refresh-token", refreshAccessToken);
router.get("/home", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      message: `Welcome to home`,
      user: {
        id: user._id,
        points: user.points,
        referralCode: user.referralCode,
      },
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
