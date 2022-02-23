// import { useState } from "react";
import "./App.css";
import Header from "./components/header/header";
import Login from "./components/login/login";
import Footer from "./components/footer/footer";
import PhoneTransfer from "./components/phoneTransfer/phoneTransfer";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import { server } from "./constants";

const PrivateRoute = ({ children }) =>
  isLoggedIn() === true ? children : <Navigate to="/login" />;

const isLoggedIn = () => {
  return localStorage.getItem(server.TOKEN_KEY) != null;
};

const App = () => {
  // const [, updateState] = useState();
  // const forceUpdate = () => {
  //   updateState();
  // };

  console.log("Re-Rendering...");

  const LoginRedirect = () => <Navigate to="/login" />;

  return (
    <div className="App">
      <Router basename={"/zoomphone"}>
        <Routes>
          <Route path={"/"} element={<LoginRedirect />} />
          <Route path={"/login"} element={<Login />} />
          <Route
            path={"/phoneTransfer"}
            element={
              <PrivateRoute>
                <Header />
                <PhoneTransfer />
              </PrivateRoute>
            }
          />
          <Route
            path={"/*"}
            element={<h2 className="mt-5 p2 text-center">Page Not Found</h2>}
          />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
};

export default App;
