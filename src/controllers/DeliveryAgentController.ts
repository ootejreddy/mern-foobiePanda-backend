import { Request, Response } from "express";
import DeliveryAgent from "../models/deliveryAgent";

const getDeliveryAgents = async (req: Request, res: Response) => {
  try {
    const deliveryAgents = await DeliveryAgent.find();
    res.status(201).json(deliveryAgents);
  } catch (error) {
    res
      .status(500)
      .json({ message: "couldn't able to get the delivery agent details" });
  }
};
export default {
  getDeliveryAgents,
};
