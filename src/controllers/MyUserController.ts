import { Request, Response } from "express";
import User from "../models/user";

const createCurrentUser = async (req: Request, res: Response) => {
  try {
    const { auth0Id } = req.body;
    console.log("The auth id is: ", auth0Id);

    const existingUser = await User.findOne({ auth0Id });
    if (existingUser) {
      return res.status(200).send("User already exists");
    }
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser.toObject());
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error Creating user" });
  }
};

const updateCurrentUser = async (req: Request, res: Response) => {
  try {
    const { name, addressLine1, country, city } = req.body;
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    //* specific updates because no need to change the Oauth id
    user.name = name;
    user.addressLine1 = addressLine1;
    user.country = country;
    user.city = city;
    await user.save();
    res.send(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error Updating user" });
  }
};

const getCurrentUser = async (req: Request, res: Response) => {
  const user = await User.findOne({ _id: req.userId });
  if (!user) {
    return res.status(404).json({ message: "user not found" });
  }
  return res.status(200).json(user);
};

export default { createCurrentUser, updateCurrentUser, getCurrentUser };
