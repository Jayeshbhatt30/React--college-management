import React, { Component } from "react";
import "../index.css";
import { Link } from "react-router-dom";
import "../App.css";
class SignUp extends Component {
  constructor() {
    super();

    this.state = {
      data: [],
      department: [],
      email: "",
      password: "",
      name: "",
      phone: "",
      dept: "",

      hasAgreed: false
    };
  }
  handleSubmit = event => {
    event.preventDefault();

    var data = {
      name: this.state.name,
      password: this.state.password,
      email: this.state.email,
      dept: this.state.dept,
      phone: this.state.phone
    };
    console.log("hello", data);
    fetch("http://localhost:5000/users/add", {
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
      })
      .catch(function(err) {
        console.log(err);
      });
  };

  handleChange = e => {
    let target = e.target;
    let value = target.value;
    let name = target.name;

    this.setState({
      [name]: value
    });
    console.log(name);
  };

  componentDidMount() {
    fetch("http://localhost:5000/departments")
      .then(res => {
        if (res.status > 200) {
          throw new Error("Bad response from server");
        }

        return res.json();
      })
      .then(data => {
        this.setState({ data });
      })
      .catch(err => {
        console.log("caught it!", err);
      });
    fetch("http://localhost:5000/departments/dept_name")
      .then(res => {
        if (res.status > 200) {
          throw new Error("Bad response from server");
        }

        return res.json();
      })
      .then(data => {
        this.setState({ department: data });
        console.log("hey", this.state.department);
      })
      .catch(err => {
        console.log("caught it!", err);
      });
  }
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
              <label>FULL NAME</label>
              <input
                type="text"
                className="form-control"
                placeholder=" Enter Your Full Name"
                name="name"
                value={this.state.name}
                onChange={this.handleChange}
              />
            </div>

            <div className="form-group">
              <label>PASSWORD</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Your Password"
                value={this.state.password}
                name="password"
                onChange={this.handleChange}
              />
            </div>

            <div className="form-group">
              <label>E-MAIL ADDRESS</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter Your email"
                name="email"
                value={this.state.email}
                onChange={this.handleChange}
              />
            </div>

            <div className="form-group">
              <label>PHONE NO</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter Your Phone No"
                name="phone"
                value={this.state.phone}
                onChange={this.handleChange}
              />
            </div>
            <div className="form-group">
              <label>DEPARTMENT</label>

              <select
                className="form-control"
                name="dept"
                value={this.state.dept}
                onChange={this.handleChange}
              >
                <option>select</option>
                {this.state.department.map(user => {
                  return <option key={user.dept_name}>{user.dept_name}</option>;
                })}
              </select>
            </div>

            <button type="submit" className="btn btn-primary btn-block">
              Sign Up
            </button>
            <p className="forgot-password text-right">
              Already registered <a href="#">sign in?</a>
            </p>
          </div>
        </div>
      </form>
    );
  }
}
export default SignUp;
