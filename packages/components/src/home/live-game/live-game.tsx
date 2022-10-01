import classes from "./live-game.module.css";

export function LiveGame({ game_id }) {
  const name = "eswox";
  const lvl = game_id;
  const name_j2 = "erzow";
  const lvl_j2 = game_id;

  function clickme_spectate_button() {
    console.log("click");
  }

  return (
    <div className={classes['div']}>
      <h2 className={classes['h2_vs']}>VS</h2>
      <button
        className={classes['button_spectate']}
        onClick={clickme_spectate_button}
      >
        Spectate
      </button>
      <div className={classes['div_j1']}>
        <img
          src={require("/home/florian/Bureau/42/ft_transcendence/assets/notes.assets/project.visualisation.assets/database.png")}
          alt={"user avatar"}
          height="75"
          width="75"
          className={classes['img_j1']}
        />
        <p className={classes['p_usr_j1']}>
          <strong>{name}</strong>
        </p>
        <p className={classes['p_lvl_j1']}>
          <strong>Lvl: {lvl}</strong>
        </p>
      </div>
      <div className={classes['div_j2']}>
        <img
          src={require("/home/florian/Bureau/42/ft_transcendence/assets/notes.assets/project.visualisation.assets/database.png")}
          height="75"
          width="75"
          className={classes['img_j2']}
          alt='player_2'
        />
        <p className={classes['p_usr_j2']}>
          <strong>{name_j2}</strong>
        </p>
        <p className={classes['p_lvl_j2']}>
          <strong>Lvl: {lvl_j2}</strong>
        </p>
      </div>
    </div>
  );
}
