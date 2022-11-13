import classes from "./friend-list.module.css";
import starsClasses from "../../stars.module.css";
import { Friend } from "@ft-transcendence/libs-frontend-components";
import { useState } from "react";
import { User } from "@ft-transcendence/libs-frontend-services"
import { AllIcon } from "@ft-transcendence/libs-frontend-components";
import { UserDto } from "@ft-transcendence/libs-shared-types";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function FriendList() {
  const [user_name, setUserName] = useState("");
  const [message, setMessage] = useState("");
  const [friend_ID, setFriend] = useState<UserDto[]>(undefined);
  const navigate = useNavigate();
  const onChangeUserName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target.value);
  };

  function clickme_add_user() {
    User.sendFriendRequest(user_name).then(
      () => {
        setMessage("");
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        setMessage(resMessage);
      }
    );
    setUserName("");
  }

  const getAnswer = async () => {
    try {
      const response: UserDto[] = await User.requestUserFriend();
      setFriend(response);
    } catch (err) {
      navigate("/error");
      window.location.reload();
    }
  };

  useEffect(() => {
    getAnswer();
  }, []);

  return !friend_ID ? null : (
    <div className={classes["friendlist_container"]}>
      <div className={`${starsClasses["space"]} ${starsClasses["stars1"]}`}></div>
      <div className={`${starsClasses["space"]} ${starsClasses["stars2"]}`}></div>
      <div className={`${starsClasses["space"]} ${starsClasses["stars3"]}`}></div>
      <div className={`${starsClasses["space"]} ${starsClasses["stars4"]}`}></div>
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
            {message && (
              <div className="alert alert-danger" role="alert">
                {message}
              </div>
            )}
          </div>
          <div className={classes["friendlist_list"]}>
            {friend_ID.map((ID) => (
              <Friend key={ID.id} user={ID} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
