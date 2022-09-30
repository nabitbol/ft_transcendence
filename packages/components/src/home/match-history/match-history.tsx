import classes from "./match-history.module.css";
import { PastGame } from "@ft-transcendence/components";

export default function MatchHistory() {
  const ID = ["1", "2", "3", "4", "5"];

  return (
    <div className={classes.div}>
      {ID.map((ID) => (
        <PastGame game_id={ID} key={ID} />
      ))}
    </div>
  );
}
