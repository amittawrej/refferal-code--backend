import jwt from "jsonwebtoken";
import { ethers } from "ethers";
import crypto from "crypto";
import MetamaskAuth from "../models/metamask.js";
import User from "../models/user.js";

function generateReferralCode() {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

export const nounce = async (req, res) => {
  const { userAddress } = req.query;
  const nonce = crypto.randomBytes(16).toString("hex");
  try {
    const authRecord = new MetamaskAuth({
      userAddress,
      nonce,
    });
    await authRecord.save();
    res.json({ nonce });
  } catch (error) {
    console.error("Error saving nonce:", error);
    res.status(500).json({ error: "Server error while generating nonce" });
  }
};

export const metamaskLogin = async (req, res) => {
  const { userAddress, signature, nonce, referralCode } = req.body;
  try {
    const authRecord = await MetamaskAuth.findOne({ userAddress, nonce });
    if (!authRecord) {
      return res.status(400).json({ error: "Invalid or expired nonce" });
    }

    const message = `Sign this message to authenticate: ${nonce}`;
    const recoveredAddress = ethers.utils.verifyMessage(message, signature);

    if (recoveredAddress.toLowerCase() === userAddress.toLowerCase()) {
      console.log("User authenticated:", userAddress);

      await MetamaskAuth.deleteOne({ _id: authRecord._id });
      console.log(userAddress);


      let user = await User.findOne({ userId: userAddress });

      if (!user) {
        if (!userAddress) {
          return res.status(400).json({ error: "User address is invalid." });
        }
        user = new User({
          userId: userAddress,
          referralCode: generateReferralCode(),
          points: 0,
        });

        if (referralCode) {
          const referee = await User.findOne({ referralCode });
          if (referee) {
            referee.points += 10; 
            await referee.save();
          } else {
            return res.status(400).json({ message: "Invalid referral code." });
          }
        }
        await user.save();
      }

      const accessToken = jwt.sign(
        { id: user._id },
        process.env.JWT_ACCESS_SECRET,
        {
          expiresIn: "1h",
        }
      );
      const refreshToken = jwt.sign(
        { id: user._id },
        process.env.JWT_REFRESH_SECRET,
        {
          expiresIn: "7d",
        }
      );

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,  
        secure: process.env.NODE_ENV === 'production', 
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax', 
        maxAge: 7 * 24 * 60 * 60 * 1000, 
      });
   
      res.status(200).json({
        token:accessToken,
        user: {
          userId: user._id,
          referralCode: user.referralCode,
          points: user.points,
        },
      });
    } else {
      res.status(401).json({ error: "Signature verification failed" });
    }
  } catch (error) {
    console.error("Error verifying signature:", error);
    res.status(500).json({ error: "Server error during verification" });
  }
};
