import mongoose from "mongoose";
import { string } from "zod";
const paymentSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  totalAmount: {
    type: Number,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
  },
});

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
