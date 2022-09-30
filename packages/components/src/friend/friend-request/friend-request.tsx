import classes from "./friend-request.module.css";

export default function FriendRequest({ user_id }) {
  const name = "erzow";

  function clickme_decline() {
    console.log("friend no more");
  }

  function clickme_accept() {
    console.log("got a new friend");
  }

  return (
    <div className={classes.div}>
      <img
        src={require("../../img/avatar2.jpg")}
        alt={"user avatr"}
        height="60"
        width="60"
        className={classes.img}
      />
      <p className={classes.p_usr}>
        <strong>{name}</strong>
      </p>
      <button className={classes.button_accept} onClick={clickme_accept}>
        Accept
      </button>
      <button className={classes.button_decline} onClick={clickme_decline}>
        Decline
      </button>
    </div>
  );
}
