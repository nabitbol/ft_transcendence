import { Component } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import AuthService from "../services/authReq.service";

type MyState = { currentUser: any };
class App extends Component<any, MyState> {

	constructor(props) {
		super(props);
		this.state = { currentUser: undefined };
	}

	componentDidMount() {
		const user = AuthService.getCurrentUser();
		if (user)
			this.setState({ currentUser: user });
	}

	render() {
    const { currentUser } = this.state;
    return (
      <div>
        <nav className="navbar navbar-expand navbar-dark bg-dark">
          <div className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link to={"/home"} className="nav-link">
                Home
              </Link>
            </li>
          </div>
          {currentUser ? (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/profile"} className="nav-link">
                  Profile
                </Link>
              </li>
              <li className="nav-item">
                <a href="/auth" className="nav-link" onClick={AuthService.logout}>
                  LogOut
                </a>
              </li>
            </div>
          ) : (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/auth"} className="nav-link">
                  Sign in
                </Link>
              </li>
            </div>
          )}
        </nav>
      </div>
    );
  }
}

export default App;