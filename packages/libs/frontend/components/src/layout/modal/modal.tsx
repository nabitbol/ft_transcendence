import classes from "./modal.module.css";

type ModalProps = {
  removeFunction: () => void;
  closeModal: () => void;
};

const Modal: React.FC<ModalProps> = (props: ModalProps) => {
  return (
    <div className={classes['modal']}>
      <p>Are you sure ?</p>
      <button className={classes['btn']} onClick={props.closeModal}>
        Cancel
      </button>
      <button
        className={classes['btn_alt']}
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

export {Modal}