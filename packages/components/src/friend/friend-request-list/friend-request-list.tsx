import classes from "./friend-request-list.module.css";
import { FriendRequest } from "@ft-transcendence/components";

export default function FriendRequestList() {
  const user_ID = ["1", "2", "3", "4", "5", "6"];

  return (
    <div className={classes.friendrequest_container}>
      <div className={classes.friendrequest_content}>
        <h2 className={classes.h2_title}>Friend request</h2>
        <div className={classes.friendrequest_list}>
          {user_ID.map((user_ID) => (
            <FriendRequest user_id={user_ID} key={user_ID} />
          ))}
        </div>
      </div>
    </div>
  );
}
