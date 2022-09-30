import classes from "./modal.module.css";

export default function Modal(props) {
  return (
    <div className={classes.modal}>
      <p>Are you sure ?</p>
      <button className={classes.btn} onClick={props.closeModal}>
        Cancel
      </button>
      <button
        className={classes.btn_alt}
        onClick={() => {
          props.removeFunction();
          props.closeModal();
        }}
      >
        Yes
      </button>
    </div>
  );
}
