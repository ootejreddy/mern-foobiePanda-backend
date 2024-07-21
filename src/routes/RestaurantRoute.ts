import express from "express";
import { param } from "express-validator";
import RestaurantController from "../controllers/RestaurantController";
import { checkUserRoles, jwtCheck, jwtParse } from "../middleware/auth";
const router = express.Router();

router.get(
  "/:restaurantId",
  param("restaurantId")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("RestaurantId parameter must be a valid string"),
  RestaurantController.getRestaurant
);
router.get(
  "/",
  jwtCheck,
  jwtParse,
  checkUserRoles,
  RestaurantController.getAllRestaurants
);

router.get(
  "/search/:city",
  param("city")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("City paramter must be a valid string"),
  RestaurantController.searchRestaurant
);

export default router;
