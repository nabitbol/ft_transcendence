import classes from "./backdrop.module.css";

type BackdropProps = {
  closeBackdrop: () => void;
};

const Backdrop: React.FC<BackdropProps> = (props: BackdropProps) => {
  return <div className={classes["backdrop"]} onClick={props.closeBackdrop} />;
};

export { Backdrop };
