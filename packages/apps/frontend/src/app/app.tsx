import {
  WelcomePage,
  ProfilePage,
  AuthApiPage,
  ErrorPage,
  LadderPage,
  HomePage,
  FriendPage,
  FriendRequestPage,
  AchievementPage,
  GamePage,
  ChatPage,
  YourProfilePage,
} from "@ft-transcendence/libs-frontend-pages";
import { Component } from "react";
import { Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  SocketChatContext,
  SocketGameContext,
  socketGame,
  socketChat,
} from "@ft-transcendence/libs-frontend-services";
import { GameInvitation } from "@ft-transcendence/libs-frontend-components";

class App extends Component {
  override render() {
    return (
      <SocketChatContext.Provider value={socketChat}>
        <SocketGameContext.Provider value={socketGame}>
          <GameInvitation />
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/welcome" element={<WelcomePage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/ladder" element={<LadderPage />} />
            <Route path="/profile/:name" element={<ProfilePage />} />
            <Route path="/your_profile" element={<YourProfilePage />} />
            <Route path="/auth/api" element={<AuthApiPage />} />
            <Route path="/friend" element={<FriendPage />} />
            <Route path="/friend_request" element={<FriendRequestPage />} />
            <Route path="/achievement" element={<AchievementPage />} />
            <Route path="/game" element={<GamePage />} />
            <Route path="/error" element={<ErrorPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route
              path="*"
              element={<ErrorPage message="This page doesnt exist !" />}
            />
          </Routes>
        </SocketGameContext.Provider>
      </SocketChatContext.Provider>
    );
  }
}

export default App;
