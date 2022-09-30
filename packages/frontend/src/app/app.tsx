// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { WelcomePage } from "@ft-transcendence/pages";

import { Route, Routes } from "react-router-dom";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
    </Routes>
  );
};

export default App;
