import "./header.css";
import { Container, Button } from "react-bootstrap";
import { useState } from "react";
import { server } from "../../constants";
import { useNavigate } from "react-router-dom";

const Header = (props) => {
  // const [, updateState] = useState();
  // const forceUpdate = () => {
  //   updateState({}, []);
  // };
  const navigate = useNavigate();

  const onSignout = (e) => {
    localStorage.removeItem(server.TOKEN_KEY);
    localStorage.removeItem(server.PROFILE_NAME);
    localStorage.removeItem(server.PROFILE_ID);
    localStorage.removeItem(server.ACCESS_TOKEN);
    localStorage.removeItem(server.REFRESH_TOKEN);
    // forceUpdate();
    navigate("/login");
  };
  return (
    <header className="p-3 bg-dark text-white">
      <div className="container">
        <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
          <img
            className=" me-2"
            height={80}
            alt=". . ."
            src={process.env.PUBLIC_URL + "/images/img-home-logo-with-zoom.png"}
          />

          <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
            <li>
              <a href="#" className="nav-link px-2 text-secondary">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="nav-link px-2 text-white">
                About
              </a>
            </li>
          </ul>
          <form className="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3">
            <input
              type="search"
              className="form-control form-control-dark"
              placeholder="Search..."
              aria-label="Search"
            />
          </form>
          <div className="text-end">
            <button type="button" className="btn btn-outline-warning" onClick={onSignout}>
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
