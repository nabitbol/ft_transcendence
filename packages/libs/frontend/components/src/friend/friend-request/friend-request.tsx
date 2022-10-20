import classes from "./friend-request.module.css";
import { getPathToImage } from "@ft-transcendence/libs-shared-get-config";
import { User } from "@ft-transcendence/libs-frontend-services";
import { UserDto } from "@ft-transcendence/libs-shared-types";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function FriendRequest(props: {friend_request: string}) {
  const [friendRequest_ID, setFriendRequest] = useState<UserDto>(undefined);
  const name = props.friend_request;
  const navigate = useNavigate();

  function clickme_decline() {
    User.removeFriendRequest(name);
    window.location.reload();
  }

  function clickme_accept() {
    User.addFriend(name);
    window.location.reload();
  }

  const getAnswer = async () => {
    try {
      const response: UserDto = await User.requestOtherUserInfo(name);
      setFriendRequest(response);
    } catch (err) {
      navigate("/error");
      window.location.reload();
    }
  };

  useEffect(() => {
    getAnswer();
  }, []);

  return !friendRequest_ID ? null :(
    <div className={classes['div']}>
      <img
        src={getPathToImage(friendRequest_ID.image)}
        alt={"user avatr"}
        height="60"
        width="60"
        className={classes['img']}
      />
      <p className={classes['p_usr']}>
        <strong>{name}</strong>
      </p>
      <button className={classes['button_accept']} onClick={clickme_accept}>
        Accept
      </button>
      <button className={classes['button_decline']} onClick={clickme_decline}>
        Decline
      </button>
    </div>
  );
}
