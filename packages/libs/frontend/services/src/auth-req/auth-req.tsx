import axios from "axios";
import authHeader from "../auth-header/auth-header";
import { UserDto } from "@ft-transcendence/libs-shared-types";

const URL = `http://${process.env['NX_HOST_NAME']}:${process.env['NX_BACKEND_PORT']}/auth/`//process.env['REACT_APP_URL_TO_BACK'] + "/auth/";

class AuthReqService {
  async login(user_pseudo: string, user_password: string) {
    const user = { name: user_pseudo, password: user_password };
    return axios
      .post(URL + "login", user)
      .then((response) => {
        if (response.data)
          localStorage.setItem("userdata", JSON.stringify(response.data));
        return response.data;
      });
  }

  logout() {
    localStorage.removeItem("userdata");
    window.location.reload();
  }

  async register(user_pseudo: string, user_mail: string, user_password: string) {
    const user: UserDto = { name: user_pseudo, password: user_password, email: user_mail, image: "" };

    return axios.post(URL + "register", user);
  }

  getCurrentUser() {
    const tmp = localStorage.getItem("userdata");
    if (tmp)
      return JSON.parse(tmp);
  }

  async sendApiCode(code: string) {
    const ret: any = await axios.get(URL + "login/api?code=" + code)
    .catch (function (error){
      if (error.response) {
        throw new Error(error.response);
      }});
      if (ret.data) {
        localStorage.setItem("userdata", JSON.stringify(ret.data));
      }
      return ret.data;
    }

  async requestQr(): Promise<any> {
    try {
      const ret = await axios.get(URL + "generateQr", {
        headers: authHeader(),
        responseType: "blob",
      });
      return ret.data;
    } catch (err) {
      throw Error(err);
    }
  }

  async ActivateTwoFa(TwoFaCode: string) {
    const twoFA: string = TwoFaCode;
    const headers = authHeader();
    return await axios.post(
      URL + "activateTwoFa",
      { twoFA },
      { headers }
    );
  }

  async ValidateTwoFa(TwoFaCode: string) {
    const twoFA: string = TwoFaCode;
    const headers = authHeader();
    return await axios
      .post(URL + "TwoFa", { twoFA }, { headers })
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
