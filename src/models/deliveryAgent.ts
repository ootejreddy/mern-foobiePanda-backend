import mongoose from "mongoose";

const deliveryAgentSchema = new mongoose.Schema({
  auth0Id: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  addressLine1: {
    type: String,
  },
  city: {
    type: String,
  },
  country: {
    type: String,
  },
  role: {
    type: String,
    enum: ["USER", "DELIVERY"],
  },
});

const DeliveryAgent = mongoose.model("DeliveryAgent", deliveryAgentSchema);
export default DeliveryAgent;
