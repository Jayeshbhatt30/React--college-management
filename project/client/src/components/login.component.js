import React, { Component } from "react";

import { Link } from "react-router-dom";
import "../index.css";
import "../App.css";
class Login extends Component {
  constructor(props) {
    super(props);
    let loggedIn = false;
    this.state = {
      user_verification: [],
      email: "",
      password: "",
      loggedIn
    };
  }
  handleChange = e => {
    let target = e.target;
    let value = target.type === "checkbox" ? target.checked : target.value;
    let name = target.name;

    this.setState({
      [name]: value
    });
  };

  handleSubmit = e => {
    e.preventDefault();

    var data = {
      name: this.state.email,
      password: this.state.password
    };

    fetch("http://localhost:5000/users/signIn", {
      body: JSON.stringify({ data }),
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "content-type": "application/json"
      },
      method: "POST"
    })
      .then(function(response) {
        if (response.status >= 400) {
          throw new Error("Bad response from server");
        }
        return response.json();
      })
      .then(data => {
        if (data.success === true) {
          localStorage.setItem("token", data.token);
          this.props.history.push("admin/user");
          console.log(data.token);
        } else alert("invalid username or password");
      })
      .catch(function(err) {
        console.log(err);
      });
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <nav className="navbar navbar-expand-lg navbar-light fixed-top">
          <div className="container">
            <Link className="navbar-brand" to={"/sign-in"}>
              welcome to Our World
            </Link>
            <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
              <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                  <Link className="nav-link" to={"/sign-in"}>
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to={"/sign-up"}>
                    Sign up
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        <div className="auth-wrapper">
          <div className="auth-inner">
            <div className="form-group">
              <label>Email address</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter email"
                name="email"
                value={this.state.email}
                onChange={this.handleChange}
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter password"
                name="password"
                value={this.state.password}
                onChange={this.handleChange}
              />
            </div>

            <div className="form-group">
              <div className="custom-control custom-checkbox">
                <input
                  type="checkbox"
                  className="custom-control-input"
                  id="customCheck1"
                />
                <label className="custom-control-label" htmlFor="customCheck1">
                  Remember me
                </label>
              </div>
            </div>

            <button
              type="submit"
              omSubmit={this.submit}
              className="btn btn-primary btn-block"
            >
              Submit
            </button>
            <p className="forgot-password text-right">
              Forgot <a href="/">password?</a>
            </p>
          </div>
        </div>
      </form>
    );
  }
}
// export default withRouter(Login);
export default Login;
