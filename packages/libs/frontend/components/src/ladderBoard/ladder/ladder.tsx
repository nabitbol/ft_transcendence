import classes from "./ladder.module.css";
import { GeneralRank, FriendRank, AllIcon } from "@ft-transcendence/libs-frontend-components";
import { useState } from "react";
import { UserDto } from "@ft-transcendence/libs-shared-types";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "@ft-transcendence/libs-frontend-services"

export function Ladder() {
  const [ladder_general, setLadderGeneral] = useState(true);
  const [general_ID, setGeneral] = useState<UserDto[]>(undefined);
  const [friend_ID, setFriend] = useState<UserDto[]>(undefined);
  const navigate = useNavigate();

  function clickme_general_button() {
    setLadderGeneral(true);
  }

  function clickme_friend_button() {
    setLadderGeneral(false);
  }

  const getAnswer = async () => {
    try {
      const response_general: UserDto[] = await User.requestGeneralLadder();
      setGeneral(response_general);
      const response_friend: UserDto[] = await User.requestFriendLadder();
      setFriend(response_friend);
    } catch (err) {
      navigate("/error");
      window.location.reload();
    }
  };

  useEffect(() => {
    getAnswer();
  }, []);

  return !friend_ID ? null : (
    <div className={classes["ladder_container"]}>
      <div className={classes["blur_component"]}>
        <AllIcon />
        <div className={classes["ladder_content"]}>
          <h2 className={classes["h2_title"]}>Ladderboard</h2>
          <div className={classes["button_container"]}>
            <button
              className={classes["button"]}
              onClick={clickme_general_button}
            >
              General
            </button>
            <button className={classes["button"]} onClick={clickme_friend_button}>
              Friend
            </button>
          </div>
          {ladder_general ? (
            <div className={classes["ladder_list"]}>
              {general_ID.map((ID_g) => (
                <GeneralRank key={ID_g.id} user={ID_g}/>
              ))}
            </div>
          ) : (
            <div className={classes["ladder_list"]}>
              {friend_ID.map((ID_f) => (
                <FriendRank key={ID_f.id} user={ID_f} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
