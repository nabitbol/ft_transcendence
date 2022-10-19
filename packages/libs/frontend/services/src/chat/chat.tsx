import axios from "axios";
import authHeader from "../auth-header/auth-header";
import { RoomDto, UserDto } from "@ft-transcendence/libs-shared-types";

const URL = "http://localhost:3333/"; //process.env['REACT_APP_URL_TO_BACK'] ;

class chatServices {
  async requestRoomUsers(nameRoom: string): Promise<UserDto[]> {
    try {
      const ret = await axios.get(URL + "chat/" + nameRoom + "/room_users", {
        headers: authHeader(),
      });
      return ret.data.response;
    } catch (err) {
      throw Error(err);
    }
  }

  async requestUserRooms(): Promise<RoomDto[]> {
    try {
      const ret = await axios.get(URL + "chat/user_rooms", {
        headers: authHeader(),
      });
      console.log(ret);
      return ret.data.response;
    } catch (err) {
      throw Error(err);
    }
  }

  async createRoom(name: string, password?: string | undefined) {
    const data = { name: name, password: password };
    const ret = await axios.get(URL + "chat/user_rooms", {
      headers: authHeader(),
      data,
    });
    return ret.data.response;
  }
}

const Chat = new chatServices();

export { Chat };