import { Backdrop } from "../../layout/backdrop/backdrop";
import classes from "./game-invitation-form.module.css";

type GameInvitationForm = {
  acceptInvitation: () => void;
  closeModal: () => void;
  cancelInvitation: () => void;
};

const GameInvitationForm: React.FC<GameInvitationForm> = (props: GameInvitationForm) => {

  const closeModal = () => {
    props.cancelInvitation();
    props.closeModal();
  };
  
  return (
    <div>
      <Backdrop closeBackdrop={closeModal} />
      <div className={classes['game_invitation_form']}>
        <span className={classes['game_invitation_span']}>
          You have been invited to play
        </span>
        <div className={classes['game_invitation_button_holder']}>
          <button className={classes['game_invitation_btn']}
            onClick={closeModal}>
            Refuse
          </button>
          <button
            className={classes['game_invitation_btn_alt']}
            onClick={() => {
              props.acceptInvitation();
              props.closeModal();
            }}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}

export { GameInvitationForm }