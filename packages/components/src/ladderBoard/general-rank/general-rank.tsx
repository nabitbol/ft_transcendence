import classes from "./general-rank.module.css";

function GeneralRank({ user_id, rank }) {
  const name = "eswox";
  const lvl = user_id;
  const winrate = "10";
  const elo = "500";

  return (
    <div className={classes.div}>
      <h2 className={classes.h2_rank}>
        <strong>{rank}</strong>
      </h2>

      <img
        src={require("/home/florian/Bureau/42/ft_transcendence/assets/notes.assets/project.visualisation.assets/database.png")}
        alt={"user avatar"}
        height="50"
        width="50"
        className={classes.img}
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

export {GeneralRank}