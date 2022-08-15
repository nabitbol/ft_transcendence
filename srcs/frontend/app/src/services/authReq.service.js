import axios from "axios";
import authHeader from './authHeader.service';

const URL = "http://localhost:3333/auth/";

class AuthService {
  async login(user_pseudo, user_password) {
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

  async register(user_pseudo, user_mail, user_password) {
    return axios.post(URL + "register", {
      user_pseudo,
      user_mail,
      user_password
    });
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('userdata'));
  }

 async sendApiCode(code) {
    return await axios.get(URL + "login/api?code=" + code)
      .then(response => {
        if (response.data)
          localStorage.setItem('userdata', JSON.stringify(response.data));
            return response.data;
      })
  }

  async requestQr() {
    return await axios.get(URL + "generateQr",
    { headers: authHeader(),
      responseType: 'blob'
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

}

export default new AuthService();