import classes from "../../ladderBoard/general-rank/general-rank.module.css";
export default function FriendRank({ user_id, rank }) {
  const name = "erzow";
  const lvl = user_id;
  const winrate = "20";
  const elo = "1500";

  return (
    <div className={classes.div}>
      <h2 className={classes.h2_rank}>
        <strong>{rank}</strong>
      </h2>

      <img
        src={require("../../img/avatar2.jpg")}
        height="50"
        width="50"
        className={classes.img}
        alt="friend_avatar"
      />
      <p className={classes.p_usr}>
        <strong>{name}</strong>
      </p>
      <p className={classes.p_lvl}>
        <strong>Lvl: {lvl}</strong>
      </p>
      <p className={classes.p_winrate}>
        <strong>Win %: {winrate}</strong>
      </p>
      <p className={classes.p_elo}>
        <strong> Elo: {elo}</strong>
      </p>
    </div>
  );
}
