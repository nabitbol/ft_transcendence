import axios from "axios";

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
    })
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('userdata'));
  }
  
}

export default new AuthService();