import { AllIcon, Tmp } from "@ft-transcendence/libs-frontend-components";
import styles from "./chat-page.module.css";

function ChatPage() {
  return (
    <div>
      <div className={styles["navBar"]}>
        <AllIcon />
      </div>
      <Tmp />
    </div>
  );
}
export { ChatPage };
