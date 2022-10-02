import classes from "./ladder.module.css";
import { GeneralRank, FriendRank } from "@ft-transcendence/libs-frontend-components";
import { useState } from "react";

export function Ladder() {
  const [ladder_general, setLadderGeneral] = useState(true);
  const general_ID = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
  ];

  const friend_ID = ["3", "4"];
  let tmp = 1;

  function clickme_general_button() {
    setLadderGeneral(true);
  }

  function clickme_friend_button() {
    setLadderGeneral(false);
  }

  /*{friend_ID.map(ID =>( <LiveGame game_id={ID} key={ID}/>))}*/

  return (
    <div className={classes.ladder_container}>
      <div className={classes.ladder_content}>
        <h2 className={classes.h2_title}>Ladderboard</h2>
        <div className={classes.button_container}>
          <button className={classes.button} onClick={clickme_general_button}>
            General
          </button>
          <button className={classes.button} onClick={clickme_friend_button}>
            Friend
          </button>
        </div>
        {ladder_general ? (
          <div className={classes.ladder_list}>
            {general_ID.map((general_ID) => (
              <GeneralRank user_id={general_ID} rank={tmp++} key={general_ID} />
            ))}
          </div>
        ) : (
          <div className={classes.ladder_list}>
            {friend_ID.map((friend_ID) => (
              <FriendRank user_id={friend_ID} rank={tmp++} key={friend_ID} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
