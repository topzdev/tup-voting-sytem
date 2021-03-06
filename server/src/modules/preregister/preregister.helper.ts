import axios from "axios";
import qs from "qs";
import configs from "../../configs";
import { HttpException } from "../../helpers/errors/http.exception";
import { GoogleTokensResult, GoogleUserInfo } from "../auth/auth.inteface";
import { Election } from "../election/entity/election.entity";

export const PREREGISTER_MESSAGES = {
  is_preregistered: {
    title: "You already pre-registered",
    body: "Please wait for your application to be approved",
  },
  is_already_registered: {
    title: "You already registered",
    body: "You can now vote to your designated election",
  },
  electionNotFound: {
    title: "Election not found",
    body: "The election is not available for pre-registration or not created yet",
  },
  preRegistrationIsClosed: {
    title: "Pre Registration is closed",
    body: "The election is already started and pre-registration is automatically closed",
  },

  somethingWentWrong: {
    title: "Something went wrong",
    body: "Please try again",
  },
};

const generatePreRegisterElectionError = (election: Election | null) => {
  if (!election) {
    return PREREGISTER_MESSAGES.electionNotFound;
  }
  if (election.final_status === "running") {
    return PREREGISTER_MESSAGES.preRegistrationIsClosed;
  }

  if (election.final_status === "archived") {
    return PREREGISTER_MESSAGES.electionNotFound;
  }
};

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
    throw new HttpException("BAD_REQUEST", "Something went wrong");
  }
};

const getGoogleUserInfo = async ({
  id_token,
  access_token,
}): Promise<GoogleUserInfo> => {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
      {
        headers: {
          Authorization: `Bearer ${id_token}`,
        },
      }
    );

    return response.data as GoogleUserInfo;
  } catch (error) {
    console.log(error.response.data.error);
    throw new HttpException("BAD_REQUEST", "Something went wrong");
  }
};

const preregisterHelpers = {
  getGoogleTokens,
  getGoogleUserInfo,
  generatePreRegisterElectionError,
};

export default preregisterHelpers;
