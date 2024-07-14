import { Request, Response } from "express";
import axios from "axios";
import User from "../models/user";

interface Role {
  id: string;
  name: string;
  description: string;
}

const createCurrentUser = async (req: Request, res: Response) => {
  try {
    const { auth0Id } = req.body;
    console.log("The auth id is: ", auth0Id);
    const accessToken = await getAccessToken();
    getUserRoles(accessToken, auth0Id);
    // getUserRoles(auth0Id, req.headers.authorization);
    // getAccessToken();
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

// const getUserRoles = (auth0Id: string, authorization: any) => {
//   var options = {
//     method: "GET",
//     url: `https://dev-b4nhd54dagy2jubp.us.auth0.com/api/v2/users/${auth0Id}/roles`,
//     headers: { authorization: authorization },
//   };
//   axios
//     .request(options)
//     .then(function (response) {
//       console.log("The roles data is: ", response.data);
//     })
//     .catch(function (error) {
//       console.error(error);
//     });
// };

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

// Function to get an access token
async function getAccessToken(): Promise<string> {
  const clientId = process.env.AUTH0_CLIENT_ID;
  const clientSecret = process.env.AUTH0_CLIENT_SECRET;
  const domain = process.env.AUTH0_DOMAIN;
  const response = await axios.post(`https://${domain}/oauth/token`, {
    client_id: clientId,
    client_secret: clientSecret,
    audience: `https://${domain}/api/v2/`,
    grant_type: "client_credentials",
  });
  // console.log("The access token is: ", response.data.access_token);

  return response.data.access_token;
}

async function getUserRoles(
  accessToken: string,
  userId: string
): Promise<Role[]> {
  const domain = process.env.AUTH0_DOMAIN;
  const response = await axios.get(
    `https://${domain}/api/v2/users/${userId}/roles`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  console.log("The roles are: ", response.data);

  return response.data;
}
export default { createCurrentUser, updateCurrentUser, getCurrentUser };
