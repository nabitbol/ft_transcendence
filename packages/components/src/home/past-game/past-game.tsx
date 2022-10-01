import classes from "./past-game.module.css";

export function PastGame({ game_id }) {
  const name = "Eswox";
  const score = game_id;
  const result = "Win";
  const name_j2 = "Erzow";
  const score_j2 = "0";
  const result_j2 = "Lose";

  return (
    <div className={classes.div}>
      <h2 className={classes.h2_vs}>-</h2>
      <div className={classes.div_j1}>
        <img
          src={require("/home/florian/Bureau/42/ft_transcendence/assets/notes.assets/project.visualisation.assets/database.png")}
          height="50"
          width="50"
          className={classes.img_j1}
        />
        <p className={classes.p_usr_j1}>
          <strong>{name}</strong>
        </p>
        <h2 className={classes.h2_score_j1}>
          <strong>{score}</strong>
        </h2>
        <p className={classes.p_result_j1}>
          <strong>{result}</strong>
        </p>
      </div>
      <div className={classes.div_j2}>
        <img
          src={require("/home/florian/Bureau/42/ft_transcendence/assets/notes.assets/project.visualisation.assets/database.png")}
          height="50"
          width="50"
          className={classes.img_j2}
        />
        <p className={classes.p_usr_j2}>
          <strong>{name_j2}</strong>
        </p>
        <h2 className={classes.h2_score_j2}>
          <strong>{score_j2}</strong>
        </h2>
        <p className={classes.p_result_j2}>
          <strong>{result_j2}</strong>
        </p>
      </div>
    </div>
  );
}
