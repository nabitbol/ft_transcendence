import styles from "./user-list.module.css";

/* eslint-disable-next-line */
export interface UserListProps {}

export function UserList(props: UserListProps) {
  return (
    <div className={styles["container"]}>
      <h1>Welcome to UserList!</h1>
    </div>
  );
}

export default UserList;
