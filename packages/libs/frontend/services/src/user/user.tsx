import axios from "axios";
import authHeader from "../auth-header/auth-header";
import { AuthReq } from '@ft-transcendence/libs-frontend-services'
import { UserDto, MatchDto } from "@ft-transcendence/libs-shared-types";

const URL = "http://localhost:3333/"//process.env['REACT_APP_URL_TO_BACK'] ;

class UserService {

  async requestUserMatchInfo() : Promise<MatchDto[]> {
    const user_info: any = AuthReq.getCurrentUser();
    try {
      const ret = await axios.get(URL + "match/" + user_info.name, {
        headers: authHeader()
      });
      return ret.data.matches;
    } catch (err) {
        console.log('error ici');
        throw Error(err);
    }
  }

  async requestUserInfo(): Promise<UserDto> {
    const user_info: any = AuthReq.getCurrentUser();
    try {
      const ret = await axios.get(URL + "user/" + user_info.name, {
        headers: authHeader()
      });
      return ret.data.user;
    } catch (err) {
        throw Error(err);
    }
  }
}

const User = new UserService();

export { User };