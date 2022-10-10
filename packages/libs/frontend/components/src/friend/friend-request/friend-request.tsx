import classes from "./friend-request.module.css";
import { getPathToImage } from "@ft-transcendence/libs-shared-get-config";

export function FriendRequest(props: {friend_request: string}) {
  const name = props.friend_request;

  function clickme_decline() {
    console.log("friend no more");
  }

  function clickme_accept() {
    console.log("got a new friend");
  }

  return (
    <div className={classes['div']}>
      <img
        src={getPathToImage("friend")}
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
