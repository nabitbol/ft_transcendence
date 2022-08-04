import React from "react";
import AuthService from "../services/authReq.service";

const Profile = () => {
  const currentUser = AuthService.getCurrentUser();
  	return (
    <div className="container">
      <header className="jumbotron">
        <h3>
          <strong>{currentUser.user_pseudo}</strong> Profile
        </h3>
      </header>
      <p>
        <strong>Token:</strong> {currentUser.user_JWT.substring(0, 20)} ...{" "}
        {currentUser.user_JWT.substr(currentUser.user_JWT.length - 20)}
      </p>
      <p>
        <strong>Id:</strong> {currentUser.user_id}
      </p>
      <p>
        <strong>Email:</strong> {currentUser.user_mail}
      </p>
    </div>
  );
};

export default Profile;
