import axios from "axios";
import authHeader from './authHeader.service';

const URL = process.env.REACT_APP_URL_TO_BACK + "/auth/";

class AuthService {
  async login(user_pseudo: string, user_password: string) {
    return axios
      .post(URL + "login", {
        user_pseudo,
        user_password
      })
      .then(response => {
        if (response.data)
          localStorage.setItem('userdata', JSON.stringify(response.data));
        return response.data;
      });
  }

  logout() {
    localStorage.removeItem('userdata');
  }

  async register(user_pseudo: string, user_mail: string, user_password: string) {
    return axios.post(URL + "register", {
      user_pseudo,
      user_mail,
      user_password
    });
  }

  getCurrentUser() {
      const tmp = localStorage.getItem('userdata');
      if (tmp)
        return JSON.parse(tmp);
  }

 async sendApiCode(code: any) {
    return await axios.get(URL + "login/api?code=" + code)
      .then(response => {
        if (response.data)
          localStorage.setItem('userdata', JSON.stringify(response.data));
        return response.data;
      })
  }

  async requestQr() {
    return await axios.get(URL + "generateQr",
    { headers : authHeader(),
      responseType: 'blob',
    })
    .then(response => {
        if (response.data)
        {
          console.log(response.data);
          return response.data;
        }
      }).catch((error) => {
        console.log(error);
        return error;
    });
  }

  async ActivateTwoFa(TwoFaCode :string ) {
    const header = { headers: authHeader(),
      twoFactorAuthentication: TwoFaCode};
    return await axios.get(URL + "activateTwoFa", header)
    .catch((error) => {
        console.log(error);
        return error;
    });
  }

}

export default new AuthService();