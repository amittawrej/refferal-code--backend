import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res
      .status(401)
      .json({ message: "No token provided, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

export const refreshAccessToken = async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token provided" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const newAccessToken = jwt.sign(
      { id: user._id },
      process.env.JWT_ACCESS_SECRET,
      {
        expiresIn: "1h",
      }
    );
    const newRefreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: "7d",
      }
    );
    res.cookie("refreshToken", newRefreshToken, {
          // httpOnly: true,  
          secure: process.env.NODE_ENV === 'production', 
          sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax', 
          maxAge: 7 * 24 * 60 * 60 * 1000, 
    });
    return res.status(200).json({ token: newAccessToken });
  } catch (error) {
    console.error("Refresh token error:", error);
    return res
      .status(403)
      .json({ message: "Invalid or expired refresh token" });
  }
};
