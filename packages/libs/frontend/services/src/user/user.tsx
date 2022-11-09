import axios from "axios";
import authHeader from "../auth-header/auth-header";
import { AuthReq } from "@ft-transcendence/libs-frontend-services";
import {
  UserDto,
  MatchDto,
  AchievementDto,
} from "@ft-transcendence/libs-shared-types";

const URL = `http://${process.env['HOSTNAME']}:${process.env['BACKEND_PORT']}/`; //process.env['REACT_APP_URL_TO_BACK'] ;

class UserService {
  async requestUserMatchInfo(name: string): Promise<MatchDto[]> {
    try {
      const ret = await axios.get(URL + "match/" + name, {
        headers: authHeader(),
      });
      return ret.data.matches;
    } catch (err) {
      throw Error(err);
    }
  }

  async requestUserProfileInfo(name: string): Promise<UserDto> {
    try {
      const ret = await axios.get(URL + "user/" + name, {
        headers: authHeader(),
      });
      return ret.data.user;
    } catch (err) {
      throw Error(err);
    }
  }

  async requestUserInfo(user_name: string): Promise<UserDto> {
    try {
      const ret = await axios.get(URL + "user/" + user_name, {
        headers: authHeader(),
      });
      return ret.data.user;
    } catch (err) {
      throw Error(err);
    }
  }

  async requestUserInfoForChat(): Promise<UserDto> {
    const user_info: any = AuthReq.getCurrentUser();
    try {
      const ret = await axios.get(URL + "user/" + user_info.name, {
        headers: authHeader(),
      });
      return ret.data.user;
    } catch (err) {
      throw Error(err);
    }
  }

  async sendFriendRequest(name_receiver: string): Promise<any> {
    const user_info: any = AuthReq.getCurrentUser();
    const data: any = { name_receiver, name_sender: user_info.name };
    const headers = authHeader();

    return axios
      .post(
        URL + "user/" + user_info.name + "/friend_request",
        { data },
        { headers }
      )
      .then((response) => {
        return response.data;
      });
  }

  async removeFriendRequest(name_to_delete: string): Promise<any> {
    const user_info: any = AuthReq.getCurrentUser();
    const headers = authHeader();

    return axios
      .post(
        URL + "user/" + user_info.name + "/remove_friend_request",
        { name_to_delete },
        { headers }
      )
      .then((response) => {
        return response.data;
      });
  }

  async requestUserFriendRequest(): Promise<string[]> {
    const user_info: any = AuthReq.getCurrentUser();
    try {
      const ret = await axios.get(
        URL + "user/" + user_info.name + "/friend_request",
        {
          headers: authHeader(),
        }
      );
      return ret.data.friendsRequest;
    } catch (err) {
      throw Error(err);
    }
  }

  async addFriend(name: string): Promise<any> {
    const user_info: any = AuthReq.getCurrentUser();
    const headers = authHeader();

    return axios
      .post(URL + "user/" + user_info.name + "/friend", { name }, { headers })
      .then((response) => {
        return response.data;
      });
  }

  async removeFriend(name: string): Promise<any> {
    const user_info: any = AuthReq.getCurrentUser();
    const headers = authHeader();

    return axios
      .post(
        URL + "user/" + user_info.name + "/remove_friend",
        { name },
        { headers }
      )
      .then((response) => {
        return response.data;
      });
  }

  async requestUserFriend(): Promise<UserDto[]> {
    const user_info: any = AuthReq.getCurrentUser();
    try {
      const ret = await axios.get(URL + "user/" + user_info.name + "/friend", {
        headers: authHeader(),
      });
      return ret.data.response;
    } catch (err) {
      throw Error(err);
    }
  }

  async requestGeneralLadder(): Promise<UserDto[]> {
    const user_info: any = AuthReq.getCurrentUser();
    try {
      const ret = await axios.get(
        URL + "user/" + user_info.name + "/general_ladder",
        {
          headers: authHeader(),
        }
      );
      return ret.data.response;
    } catch (err) {
      throw Error(err);
    }
  }

  async requestFriendLadder(): Promise<UserDto[]> {
    const user_info: any = AuthReq.getCurrentUser();
    try {
      const ret = await axios.get(
        URL + "user/" + user_info.name + "/friend_ladder",
        {
          headers: authHeader(),
        }
      );
      return ret.data.response;
    } catch (err) {
      throw Error(err);
    }
  }

  async updateUserAchievement() {
    const user_info: any = AuthReq.getCurrentUser();
    const headers = authHeader();
    try {
      await axios.get(URL + "user/" + user_info.name + "/update_achievement", {
        headers,
      });
    } catch (err) {
      throw Error(err);
    }
  }

  async requestAchievement(name: string): Promise<AchievementDto[]> {
    try {
      const ret = await axios.get(
        URL + "user/" + name + "/user_achievement",
        {
          headers: authHeader(),
        }
      );
      return ret.data.response;
    } catch (err) {
      throw Error(err);
    }
  }

  async requestUserAchievement(): Promise<AchievementDto[]> {
    const user_info: any = AuthReq.getCurrentUser();
    try {
      const ret = await axios.get(
        URL + "user/" + user_info.name + "/user_achievement",
        {
          headers: authHeader(),
        }
      );
      return ret.data.response;
    } catch (err) {
      throw Error(err);
    }
  }

  async getBase64(file: any) {
    return new Promise((resolve) => {
      let baseURL: string | ArrayBuffer;
      const reader = new FileReader();

      reader.readAsDataURL(file);
      reader.onload = () => {
        baseURL = reader.result;
        resolve(baseURL);
      };
    });
  }

  async sendImage(file: any) {
    const user_info: any = AuthReq.getCurrentUser();
    const headers = authHeader();

    axios.post(
      URL + "user/" + user_info.name + "/image",
      { file },
      { headers }
    );
  }

  async verifUserName(name: string): Promise<UserDto> {
    try {
      const ret = await axios.get(URL + "user/" + name, {
        headers: authHeader(),
      });
      return ret.data.user;
    } catch (err) {
      throw Error(err);
    }
  }

  async changeName(name: string) {
    const user_info: any = AuthReq.getCurrentUser();
    try {
      await axios
        .put(
          URL + "user/" + user_info.name + "/name",
          { name },
          { headers: authHeader() }
        )
        .then((response) => {
          if (response.data)
            localStorage.setItem("userdata", JSON.stringify(response.data));
          return response.data;
        });
    } catch (err) {
      throw Error(err);
    }
  }
}

const User = new UserService();

export { User };
