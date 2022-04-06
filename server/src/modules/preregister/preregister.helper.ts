import axios from "axios";
import qs from "qs";
import configs from "../../configs";
import { GoogleTokensResult } from "../auth/auth.inteface";

export const PREREGISTER_MESSAGES = {
  is_preregistered: {
    title: "You already applied for pre registration",
    message: "Please wait for your application to be approved",
  },
  is_already_registered: {
    title: "You already registered",
    message: "You can now vote to your designated election",
  },
};

const generatePreRegisterElectionError = (election) => {};

const getGoogleTokens = async (code: string): Promise<GoogleTokensResult> => {
  const url = "https://oauth2.googleapis.com/token";

  const values = {
    code,
    client_id: configs.oauth2.client_id,
    client_secret: configs.oauth2.client_secret,
    redirect_uri: configs.oauth2.redirect,
    grant_type: "authorization_code",
  };

  console.log(values);

  try {
    const response = await axios.post<GoogleTokensResult>(
      url,
      qs.stringify(values),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error.response.data.error);
    throw Error(error.message);
  }
};

const getGoogleUserInfo = async ({ id_token, access_token }) => {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
      {
        headers: {
          Authorization: `Bearer ${id_token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.log(error.response.data.error);
    throw Error(error.message);
  }
};

const preregisterHelpers = { getGoogleTokens, getGoogleUserInfo };

export default preregisterHelpers;
