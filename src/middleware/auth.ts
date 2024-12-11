import { NextFunction, Request, Response } from "express";
import { auth } from "express-oauth2-jwt-bearer";
import jwt from "jsonwebtoken";
import User from "../models/user";
import axios from "axios";
import {
  getUserRoles,
  Role,
  getAccessToken,
} from "../controllers/MyUserController";
import DeliveryAgent from "../models/deliveryAgent";

declare global {
  namespace Express {
    interface Request {
      auth0Id: String;
      userId: String;
      role: String;
    }
  }
}

export const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  tokenSigningAlg: "RS256",
});

export const jwtParse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    console.log("The authorization header is empty");
    return res.sendStatus(401);
  }
  // Bearer lshdflshdjkhvjkshdjkvh34h5k3h54jkh
  const token = authorization.split(" ")[1];

  try {
    const decoded = jwt.decode(token) as jwt.JwtPayload;
    const auth0Id = decoded.sub || "";
    const accessToken = await getAccessToken();
    const userRole: Role[] = await getUserRoles(accessToken, auth0Id);
    console.log("The user role from jwt parse is: ", userRole);

    if (userRole[0].name === "USER" || userRole[0].name === "ADMIN") {
      const user = await User.findOne({ auth0Id });
      if (!user) {
        console.log("User not found");
        return res.sendStatus(401);
      }
      req.auth0Id = auth0Id as string;
      req.userId = user._id?.toString() || "";
      req.role = user.role || "";
      next();
    } else if (userRole[0].name === "DELIVERY") {
      const deliveryAgent = await DeliveryAgent.findOne({ auth0Id });
      if (!deliveryAgent) {
        console.log("Delivery Agent not found");
        return res.sendStatus(401);
      }
      req.auth0Id = auth0Id as string;
      req.userId = deliveryAgent._id?.toString() || "";
      req.role = deliveryAgent.role || "";
      next();
    }
  } catch (error) {
    return res.sendStatus(401);
  }
};

export async function checkUserRoles(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const domain = process.env.AUTH0_DOMAIN;
  const auth0Id = req.auth0Id;

  // console.log("The auth0Id from checkUserRoles is: ", auth0Id);

  const accessToken = await getAccessToken();

  const response: Role[] = await getUserRoles(accessToken, auth0Id.toString());
  // console.log("The response is: ", response[0].name);

  if (response[0].name !== "ADMIN") {
    console.log("Unauthorized user");
    return res.sendStatus(401);
  }
  next();
}

// Function to get an access token
// export async function getAccessToken(): Promise<string> {
//   const clientId = process.env.AUTH0_CLIENT_ID;
//   const clientSecret = process.env.AUTH0_CLIENT_SECRET;
//   const domain = process.env.AUTH0_DOMAIN;
//   const response = await axios.post(`https://${domain}/oauth/token`, {
//     client_id: clientId,
//     client_secret: clientSecret,
//     audience: `https://${domain}/api/v2/`,
//     grant_type: "client_credentials",
//   });
//   // console.log("The access token is: ", response.data.access_token);
//   // console.log("The get access token response is: ", JSON.stringify(response));
//   return response.data.access_token;
// }
