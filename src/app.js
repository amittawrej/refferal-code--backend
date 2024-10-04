import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoute from "./route/userRoute.js";
import { config } from "dotenv";

config({
  path: "./.env",
});
const port = process.env.PORT || 4000;

const app = express();

export const connectDB = (uri) => {
  mongoose
    .connect(uri, { dbName: "RefferalCode" })
    .then((c) => console.log(`DB connected to ${c.connection.host}`))
    .catch((e) => console.log(e));
};
connectDB(process.env.Mongo_URI);
app.use(cors(
  {
    origin: [process.env.Frontend_URI ,process.env.FIREBASE_URL],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  }
));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Api working");
});

app.use("/api/v1", userRoute);

app.listen(port, () => {
  console.log(`Server is working on http://localhost:${port}`);
});
