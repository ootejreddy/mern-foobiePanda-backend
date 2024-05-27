import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import MyUserRoute from "./routes/MyUserRoute";

mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING as string)
  .then(() => console.log("Connected to the datbase"))
  .catch((err) => console.log("Database Connection Failed: ", err));

const app = express();
//* middleware which will convert req body to json automatically
app.use(express.json());
app.use(cors());
app.get("/health", async (req: Request, res: Response) => {
  res.send({ message: "Health OK!" });
});
app.use("/api/my/user", MyUserRoute);

app.listen(8000, () => {
  console.log("server started on localhost:8000");
});
