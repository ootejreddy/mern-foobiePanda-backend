import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import MyUserRoute from "./routes/MyUserRoute";
import { v2 as cloudinary } from "cloudinary";
import MyRestaurantRoute from "./routes/MyRestaurantRoute";
import RestaurantRoute from "./routes/RestaurantRoute";
import OrderRoute from "./routes/OrderRoute";

mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING as string)
  .then(() => console.log("Connected to the datbase"))
  .catch((err) => console.log("Database Connection Failed: ", err));

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const app = express();

app.use(cors());
//* this raw data is used by the stripe for signature verification
app.use("/api/order/checkout/webhook", express.raw({ type: "*/*" }));

//* middleware which will convert req body to json automatically
app.use(express.json());
app.get("/health", async (req: Request, res: Response) => {
  res.send({ message: "Health OK!" });
});
app.use("/api/my/user", MyUserRoute);
app.use("/api/my/restaurant", MyRestaurantRoute);
app.use("/api/restaurant", RestaurantRoute);
app.use("/api/order", OrderRoute);

app.listen(8000, () => {
  console.log("server started on localhost:8000");
});
