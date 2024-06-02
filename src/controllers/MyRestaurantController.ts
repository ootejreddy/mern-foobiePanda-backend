import { Request, Response } from "express";

import Restaurant from "../models/restaurant";
import cloudinary from "cloudinary";
import mongoose from "mongoose";

const createMyRestaurant = async (req: Request, res: Response) => {
  // console.log("executing the createMyRestaurant");

  try {
    const existingRestaurant = await Restaurant.findOne({ user: req.userId });
    if (existingRestaurant) {
      return res
        .status(409)
        .json({ message: "User restaurant already exists" });
    }
    const image = req.file as Express.Multer.File;
    const base64Image = Buffer.from(image.buffer).toString("base64");
    const dataURI = `data:${image.mimetype};base64,${base64Image}`;
    const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);
    const restaurant = new Restaurant(req.body);
    restaurant.imageUrl = uploadResponse.url;
    restaurant.user = new mongoose.Types.ObjectId(req.userId.toString());
    restaurant.lastUpdated = new Date();
    await restaurant.save();
    res.status(201).send(restaurant);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const updateMyRestaurant = async (req: Request, res: Response) => {
  try {
    const restaurant = await Restaurant.findOne({
      user: req.userId,
    });

    if (!restaurant) {
      return res.status(404).json({ message: "restaurant not found" });
    }

    restaurant.restaurantName = req.body.restaurantName;
    restaurant.city = req.body.city;
    restaurant.country = req.body.country;
    restaurant.deliveryPrice = req.body.deliveryPrice;
    restaurant.estimatedDeliveryTime = req.body.estimatedDeliveryTime;
    restaurant.cuisines = req.body.cuisines;
    restaurant.menuItems = req.body.menuItems;
    restaurant.lastUpdated = new Date();

    if (req.file) {
      const imageUrl = await uploadImage(req.file as Express.Multer.File);
      restaurant.imageUrl = imageUrl;
    }

    await restaurant.save();
    res.status(200).send(restaurant);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const getMyRestaurantDetails = async (req: Request, res: Response) => {
  try {
    const restaurant = await Restaurant.findOne({ user: req.userId });
    if (!restaurant) {
      return res.status(404).json({ message: "restaurant not found" });
    }
    console.log("The restaurant details are: ", restaurant);

    return res.status(200).json(restaurant);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "couldn't able to get the restaurant details" });
  }
};

const uploadImage = async (file: Express.Multer.File) => {
  const image = file;
  const base64Image = Buffer.from(image.buffer).toString("base64");
  const dataURI = `data:${image.mimetype};base64,${base64Image}`;

  const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);
  return uploadResponse.url;
};

export default {
  createMyRestaurant,
  getMyRestaurantDetails,
  updateMyRestaurant,
};
