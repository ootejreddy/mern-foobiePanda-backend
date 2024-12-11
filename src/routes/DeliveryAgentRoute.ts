import express from "express";
import { checkUserRoles, jwtCheck, jwtParse } from "../middleware/auth";
import DeliveryAgentController from "../controllers/DeliveryAgentController";
const router = express.Router();
router.get("/", jwtCheck, jwtParse, DeliveryAgentController.getDeliveryAgents);
export default router;
