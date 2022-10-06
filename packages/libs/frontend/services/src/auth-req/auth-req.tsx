import axios from "axios";
import authHeader from "../auth-header/auth-header";

const URL = process.env['REACT_APP_URL_TO_BACK'] + "/auth/";

class AuthReqService {
  async login(user_pseudo: string, user_password: string) {
    return axios
      .post(URL + "login", {
        user_pseudo,
        user_password,
      })
      .then((response) => {
        if (response.data)
          localStorage.setItem("userdata", JSON.stringify(response.data));
        return response.data;
      });
  }

  logout() {
    localStorage.removeItem("userdata");
  }

  async register(
    user_pseudo: string,
    user_mail: string,
    user_password: string
  ) {
    return axios.post(URL + "register", {
      user_pseudo,
      user_mail,
      user_password,
    });
  }

  getCurrentUser() {
    const tmp = localStorage.getItem("userdata");
    if (tmp) return JSON.parse(tmp);
  }

  async sendApiCode(code: any) {
    return await axios.get(URL + "login/api?code=" + code).then((response) => {
      if (response.data)
        localStorage.setItem("userdata", JSON.stringify(response.data));
      return response.data;
    });
  }

  async requestQr() {
    return axios.get(URL + "generateQr", {
      headers: authHeader(),
      responseType: "blob",
    });
  }

  async ActivateTwoFa(TwoFaCode: string) {
    const twoFactorAuthentication: string = TwoFaCode;
    const headers = authHeader();
    try {
      return await axios.post(
        URL + "activateTwoFa",
        { twoFactorAuthentication },
        { headers }
      );
    } catch (err) {
      throw Error("Users not found");
    }
  }

  async ValidateTwoFa(TwoFaCode: string) {
    const twoFactorAuthentication: string = TwoFaCode;
    const headers = authHeader();
    return await axios
      .post(URL + "TwoFa", { twoFactorAuthentication }, { headers })
      .then((response) => {
        if (response.data) {
          this.logout();
          localStorage.setItem("userdata", JSON.stringify(response.data));
        }
        return response.data;
      });
  }
}

const AuthReq = new AuthReqService();

export { AuthReq };