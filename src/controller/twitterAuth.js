import jwt from "jsonwebtoken";
import User from "../models/user.js";


export const twitterLogin = async (req, res) => {
  const { userId, referralCode } = req.body;
  if (!userId) {
    return res.status(400).json({
      message:
        "Please provide all required details",
    });
  }
  if (referralCode) {
    const referee = await User.findOne({ referralCode });
    if (!referee) {
      return res.status(400).json({ message: "Invalid referral code." });
    }
  }
  try {
    let user = await User.findOne({ userId });

    if (!user) {
      if (referralCode) {
        const referee = await User.findOne({ referralCode });

        if (!referee) {
          return res.status(400).json({ message: "Invalid referral code." });
        }
        if (referee) {
          referee.points += 10;
          await referee.save();
        }
      }
      user = new User({
        userId,
        referralCode: generateReferralCode(),
        points: 0,
      });

      await user.save();
    }

    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_ACCESS_SECRET, {
      expiresIn: "1h",
    });
    const refreshToken = jwt.sign({ id: user._id },process.env.JWT_REFRESH_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,  
      secure: process.env.NODE_ENV === 'production', 
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax', 
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    });

    res.status(200).json({
      token: accessToken,
      user: {
        userId: user._id,
        referralCode: user.referralCode,
        points: user.points,
      },
    });
  } catch (error) {
    console.error("Twitter login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

function generateReferralCode() {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}
