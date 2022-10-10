import classes from "./friend-list.module.css";
import { Friend } from "@ft-transcendence/libs-frontend-components";
import { useState } from "react";
import { AllIcon } from "@ft-transcendence/libs-frontend-components";

export function FriendList() {
  const [user_name, setUserName] = useState("");

  const friend_ID = ["1", "2", "3", "4", "5", "6", "7"];
  const onChangeUserName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target.value);
  };

  function clickme_add_user() {
    console.log(user_name);
    setUserName("");
  }

  return (
    <div className={classes["friendlist_container"]}>
      <div className={classes["blur_component"]}>
        <AllIcon />
        <div className={classes["friendlist_content"]}>
          <h2 className={classes["h2_title"]}>Friend list</h2>
          <div className={classes["button_container"]}>
            <button
              className={classes["button_add_user"]}
              onClick={clickme_add_user}
            >
              Add user
            </button>
            <input
              type="text"
              value={user_name}
              onChange={onChangeUserName}
              className={classes["input_add_user"]}
            />
          </div>
          <div className={classes["friendlist_list"]}>
            {friend_ID.map((friend_ID) => (
              <Friend user_id={friend_ID} key={friend_ID} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
