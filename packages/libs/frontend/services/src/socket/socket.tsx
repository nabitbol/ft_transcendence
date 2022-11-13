import axios from "axios";
import authHeader from "../auth-header/auth-header";
import { UserDto } from "@ft-transcendence/libs-shared-types";

const URL = `http://${process.env['NX_HOST_NAME']}:${process.env['NX_BACKEND_PORT']}/`; //process.env['REACT_APP_URL_TO_BACK'] ;

class SocketService {
  async requestRoomUsers(nameRoom: string): Promise<UserDto[]> {
    try {
      const ret = await axios.get(URL + "chat/" + nameRoom + "/room_users", {
        headers: authHeader(),
      });
      return ret.data.users;
    } catch (err) {
      throw Error(err);
    }
  }
}

const Socket = new SocketService();

export { Socket };
