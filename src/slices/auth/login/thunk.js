// Include Both Helper File with needed methods
import { getFirebaseBackend } from "../../../helpers/firebase_helper";
import {
  postFakeLogin,
  postJwtLogin,
  postSocialLogin,
} from "../../../helpers/fakebackend_helper";

import {
  loginSuccess,
  logoutUserSuccess,
  apiError,
  reset_login_flag,
} from "./reducer";


// Traditional login (email + password)
export const loginUser = (user, history) => async (dispatch) => {
  try {
    let response;

    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      let fireBaseBackend = getFirebaseBackend();
      response = fireBaseBackend.loginUser(user.email, user.password);
    } else if (process.env.REACT_APP_DEFAULTAUTH === "jwt") {
      response = postJwtLogin({
        email: user.email,
        password: user.password,
      });
    } else if (process.env.REACT_APP_DEFAULTAUTH) {
      response = postFakeLogin({
        email: user.email,
        password: user.password,
      });
    }

    const data = await response;

    if (data) {
      sessionStorage.setItem("authUser", JSON.stringify(data));

      if (process.env.REACT_APP_DEFAULTAUTH === "fake") {
        const parsed = JSON.parse(JSON.stringify(data));
        if (parsed.status === "success") {
          dispatch(loginSuccess(parsed.data));
          history("/dashboard");
        } else {
          dispatch(apiError(parsed));
        }
      } else {
        dispatch(loginSuccess(data));
        history("/dashboard");
      }
    }
  } catch (error) {
    dispatch(apiError(error));
  }
};

// New OTP login (phone + verified)
export const loginWithOtp = (phone, history) => async (dispatch) => {
  try {
    // You may want to verify phone against a real backend here
    const response = {
      status: "success",
      data: {
        phone,
        type: "otp",
        token: "dummy-token", // Replace with real token if applicable
      },
    };

    if (response.status === "success") {
      sessionStorage.setItem("authUser", JSON.stringify(response.data));
      dispatch(loginSuccess(response.data));
      history("/dashboard");
    } else {
      dispatch(apiError("Invalid OTP login"));
    }
  } catch (error) {
    dispatch(apiError(error));
  }
};

// Logout user
export const logoutUser = () => async (dispatch) => {
  try {
    sessionStorage.removeItem("authUser");
    let fireBaseBackend = getFirebaseBackend();
    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      const response = fireBaseBackend.logout;
      dispatch(logoutUserSuccess(response));
    } else {
      dispatch(logoutUserSuccess(true));
    }
  } catch (error) {
    dispatch(apiError(error));
  }
};

// Social login
export const socialLogin = (type, history) => async (dispatch) => {
  try {
    let response;

    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      const fireBaseBackend = getFirebaseBackend();
      response = fireBaseBackend.socialLoginUser(type);
    }

    const socialdata = await response;

    if (socialdata) {
      sessionStorage.setItem("authUser", JSON.stringify(response));
      dispatch(loginSuccess(response));
      history("/dashboard");
    }
  } catch (error) {
    dispatch(apiError(error));
  }
};

// Reset login flag
export const resetLoginFlag = () => async (dispatch) => {
  try {
    const response = dispatch(reset_login_flag());
    return response;
  } catch (error) {
    dispatch(apiError(error));
  }
};
