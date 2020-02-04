import React, { Component } from "react";
import AdminLayout from "layouts/Admin.jsx";
import { createBrowserHistory } from "history";
import { Router, Route, Switch } from "react-router-dom";
import UserProfile from "./views/UserProfile";
import Login from "./components/login.component";
import SignUp from "./components/signup.component";
class Paper extends Component {
  constructor(props) {
    super(props);
    const token = localStorage.getItem("token");
    let loggedIn = true;
    if (token == null) {
      loggedIn = false;
    }
    this.state = {
      loggedIn
    };
  }

  render() {
    const hist = createBrowserHistory();
    // if (this.state.loggedIn === false) {
    // return <Redirect to="/" />;
    // }
    return (
      <Router history={hist}>
        <Switch>
          <Route path="/sign-up" component={SignUp} />
          <Route path="/admin" render={props => <AdminLayout {...props} />} />
          <Route exact path="/" component={Login} />
          <Route exact path="/sign-in" component={Login} />
          <Route path="/admin/user" component={UserProfile} />
        </Switch>
      </Router>
    );
  }
}

export default Paper;
