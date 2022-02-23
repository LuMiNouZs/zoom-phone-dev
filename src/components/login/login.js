import { useState, useEffect } from "react";
import "./login.css";
import {
  Container,
  Image,
  Form,
  FormGroup,
  FormControl,
  FloatingLabel,
  Button,
  Row,
} from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { httpClient } from "./../../utils/HttpClient";
import { server } from "../../constants";
//import { Audio } from "react-loader-spinner";

const Login = () => {
  const [, updateState] = useState();
  const forceUpdate = () => {
    updateState({}, []);
  };

  // const [user, setUser] = useState([]);
  const [code, setCode] = useState();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [profile, setProfile] = useState("");
  const [Loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const inputUsername = (e) => {
    setUsername(e.target.value);
    // console.log(e.target.value);
  };

  const inputPassword = (e) => {
    setPassword(e.target.value);
    // console.log(e.target.value);
  };

  const clickLogin = (e) => {
    console.log("Login!!!!");

    console.log(query.get("code"));
    setCode(query.get("code"));
    submitLogin({ username: username, password: password });
    e.preventDefault();
  };

  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };

  const submitLogin = (credential) => {
    if (query.get("code")) {
      httpClient
        .post(server.LOGIN_URL, credential)
        .then((result) => {
          // console.log(result);
          if (result.data.auth) {
            let token = result.data.token;
            let profileName = result.data.customer;
            let userId = result.data.userId;
            localStorage.setItem(server.TOKEN_KEY, token);
            localStorage.setItem(server.PROFILE_NAME, profileName);
            localStorage.setItem(server.PROFILE_ID, userId);
            setProfile(userId);

            httpClient
              .post(server.OAUTH_URL, { code: query.get("code") })
              .then((result) => {
                if (result.data.access_token) {
                  let accessToken = result.data.access_token;
                  let refreshToken = result.data.refresh_token;
                  localStorage.setItem(server.ACCESS_TOKEN, accessToken);
                  localStorage.setItem(server.REFRESH_TOKEN, refreshToken);
                  navigate("/phoneTransfer", { state: { profile } });
                } else if (result.data.reason) {
                  alert(
                    "Warning : This user can't authenticate. \n" +
                      JSON.stringify(result.data)
                  );
                  navigate("/login?code=" + query.get("code"));
                }
              })
              .catch((err) => {
                alert(JSON.stringify(err));
              });
          } else {
            alert(
              "Warning : username or password incorrect, \n" +
                JSON.stringify(result.data)
            );
            navigate("/login?code=" + query.get("code"));
          }
        })
        .catch((err) => {
          alert(JSON.stringify(err));
        });
    } else {
      alert("Warning : Can't found Code OAuth2");
      navigate("/login");
    }
  };

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    autoLogin();
  }, []);

  let query = useQuery();

  const autoLogin = () => {
    let token = localStorage.getItem(server.TOKEN_KEY);
    let profileName = localStorage.getItem(server.PROFILE_NAME);
    let profileId = localStorage.getItem(server.PROFILE_ID);
    let accessToken = localStorage.getItem(server.ACCESS_TOKEN);
    let refreshToken = localStorage.getItem(server.REFRESH_TOKEN);
    setProfile(profileId);
    if (token && accessToken && refreshToken) {
      //refresh token before auto login
      httpClient
        .post(server.REFRESH_TOKEN_URL, { refreshToken: refreshToken })
        .then((result) => {
          if (result.data.access_token) {
            let accessToken = result.data.access_token;
            let refreshToken = result.data.refresh_token;
            localStorage.setItem(server.ACCESS_TOKEN, accessToken);
            localStorage.setItem(server.REFRESH_TOKEN, refreshToken);
            console.log("auto login");
            navigate("/phoneTransfer", { state: { profile } });
          } else if (result.data.reason) {
            alert(
              "Warning : Can't refresh token authenticate. \n" +
                JSON.stringify(result.data)
            );
            localStorage.removeItem(server.TOKEN_KEY);
            localStorage.removeItem(server.PROFILE_NAME);
            localStorage.removeItem(server.PROFILE_ID);
            localStorage.removeItem(server.ACCESS_TOKEN);
            localStorage.removeItem(server.REFRESH_TOKEN);
            console.log("can't refresh token");
            navigate("/");
          }
        })
        .catch((err) => {
          alert(JSON.stringify(err));
          console.log("Error");
        });
    }
  };

  return (
    <div className="login-page">
      <div className="form-signin">
        <Container className="container-c p-5 m-2 bg-light rounded">
          <Image
            className="my-2"
            src={process.env.PUBLIC_URL + "/images/img-home-logo-with-zoom.png"}
            thumbnail
          />
          <h3 className="header text-center mb-2">SIGN IN</h3>
          <Form>
            <FormGroup controlId="formLogin">
              <FloatingLabel controlId="floatingInput" label="User Name">
                <FormControl
                  className="mb-2"
                  name="username"
                  type="text"
                  placeholder="Enter Your Username."
                  onChange={inputUsername}
                />
              </FloatingLabel>
              <FloatingLabel controlId="floatingInputPassword" label="Password">
                <FormControl
                  className="mb-2"
                  name="password"
                  type="password"
                  placeholder="Enter Your Password."
                  onChange={inputPassword}
                />
              </FloatingLabel>
            </FormGroup>
            <Row className="px-3 ">
              <Button
                className="button-c"
                role="button"
                type="submit"
                onClick={clickLogin}
              >
                Sign In
              </Button>
              <Row className="px-1 mt-2">
                <div className="col align-self-end">
                  <a
                    href="https://go.zoom.us/oauth/authorize?response_type=code&client_id=nmMxOM19SbKzO569etJieg&redirect_uri=https://sandbox.1-to-all.com/zoomphone/login"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src="https://gomarketplacecontent.zoom.us/zoom_marketplace/img/add_to_zoom.png"
                      height={32}
                      alt="Add to ZOOM"
                    />
                  </a>
                </div>
              </Row>
            </Row>
            <Row className="px-3"></Row>
          </Form>
        </Container>
      </div>
    </div>
  );
};

export default Login;
