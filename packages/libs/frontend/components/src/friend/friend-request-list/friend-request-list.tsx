import classes from "./friend-request-list.module.css";
import starsClasses from "../../stars.module.css";
import { useState } from "react";
import { useEffect } from "react";
import { User } from "@ft-transcendence/libs-frontend-services";
import { useNavigate } from "react-router-dom";
import { FriendRequest, AllIcon } from "@ft-transcendence/libs-frontend-components";

export function FriendRequestList() {
  const [friendRequest_ID, setFriendRequest] = useState<string[]>(undefined);
  const navigate = useNavigate();

  const getAnswer = async () => {
    try {
      const response: string[] = await User.requestUserFriendRequest();
      setFriendRequest(response);
    } catch (err) {
      navigate("/error");
      window.location.reload();
    }
  };

  useEffect(() => {
    getAnswer();
  }, []);

  return !friendRequest_ID ? null : (
    <div className={classes["friendrequest_container"]}>
      <div className={`${starsClasses["space"]} ${starsClasses["stars1"]}`}></div>
      <div className={`${starsClasses["space"]} ${starsClasses["stars2"]}`}></div>
      <div className={`${starsClasses["space"]} ${starsClasses["stars3"]}`}></div>
      <div className={`${starsClasses["space"]} ${starsClasses["stars4"]}`}></div>
      <div className={classes["blur_component"]}>
        <AllIcon />
        <div className={classes["friendrequest_content"]}>
          <h2 className={classes["h2_title"]}>Friend request</h2>
          <div className={classes["friendrequest_list"]}>
            {friendRequest_ID.map((ID) => (
              <FriendRequest key={ID} friend_request={ID} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
