import classes from "./friend-request-list.module.css";
import { FriendRequest, AllIcon } from "@ft-transcendence/libs-frontend-components";

export function FriendRequestList() {
  const user_ID = ["1", "2", "3", "4", "5", "6"];

  return (
    <div className={classes["friendrequest_container"]}>
      <div className={classes["blur_component"]}>
        <AllIcon />
        <div className={classes["friendrequest_content"]}>
          <h2 className={classes["h2_title"]}>Friend request</h2>
          <div className={classes["friendrequest_list"]}>
            {user_ID.map((ID) => (
              <FriendRequest key={ID} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
