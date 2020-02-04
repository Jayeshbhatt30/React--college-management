import React, { Component } from "react";
import Pagination from "./pagination";
import { Grid, Row, Col, Table } from "react-bootstrap";
import Modal from "react-responsive-modal";
import Card from "components/Card/Card.jsx";
import { paginate } from "../utils/paginate";
class UserProfile extends Component {
  constructor() {
    super();
    this.state = {
      users: [],
      department: [],
      open: false,
      name: "",
      email: "",
      password: "",
      phone: "",
      dept_id: "",
      currentPage: 1,
      pageSize: 4
    };
  }

  onOpenModal = member => {
    this.setState({
      open: true,
      id: member.userId,
      name: member.userName,
      email: member.userEmail,
      password: member.userPasswd,
      phone: member.phoneNo,
      dept_id: member.dept_id
    });
  };

  onCloseModal = () => {
    this.setState({ open: false });
  };

  logChange = e => {
    this.setState({
      [e.target.name]: e.target.value //setting value edited by the admin in state.
    });
  };

  handleSubmit = event => {
    event.preventDefault();

    var data = {
      name: this.state.name,
      email: this.state.email,
      dept_id: this.state.dept_id,
      password: this.state.password,
      phone: this.state.phone,
      id: this.state.id
    };

    if (data.dept_id === "select" || data.dept_id === "") {
      alert("please select department id");
    } else {
      if (window.confirm("Are you sure you want to Edit")) {
        fetch("/users/edit", {
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
      }
    }
  };

  componentDidMount() {
    console.log("jdfhjdf", localStorage.getItem("token"));
    fetch("/users", {
      method: "Get",
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer" + localStorage.getItem("token")
      }
    })
      .then(res => {
        if (res.status >= 400) {
          throw new Error("Bad Response from server");
        }
        return res.json();
      })
      .then(data => {
        this.setState({ users: data });
      })
      .catch(err => {
        console.log("caught it!", err);
      });

    fetch("/departments/dept_name", { method: "Get" })
      .then(res => {
        if (res.status >= 400) {
          throw new Error("Bad Response from server");
        }
        return res.json();
      })
      .then(data => {
        this.setState({ department: data });
      })
      .catch(err => {
        console.log("caught it!", err);
      });
  }

  handleDelete(member) {
    var data = {
      id: member.userId
    };

    const users = this.state.users.filter(m => m.userId !== member.userId);
    this.setState({ users });

    fetch("/users/update", {
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
  }

  handlePageChange = page => {
    this.setState({ currentPage: page });
  };
  render() {
    const { length: count } = this.state.users;
    const { pageSize, currentPage, users: allUsers } = this.state;
    const users = paginate(allUsers, currentPage, pageSize);
    return (
      <div className="content">
        <Grid fluid>
          <Row>
            <Col md={12}>
              <Card
                title="User List"
                ctTableFullWidth
                ctTableResponsive
                content={
                  <Table striped hover>
                    <thead>
                      <tr>
                        <th>userId</th>
                        <th>userName</th>
                        <th>UserPasswd</th>
                        <th>UserEmail</th>
                        <th>PhoneNo</th>
                        <th>dept_id</th>
                        <th>created_on</th>
                        <th>updated_on</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(member => (
                        <tr key={member.id}>
                          <td>{member.userId} </td>
                          <td>{member.userName}</td>
                          <td>{member.userPasswd}</td>
                          <td>{member.userEmail}</td>
                          <td>{member.phoneNo}</td>
                          <td>{member.dept_id}</td>
                          <td>{member.created_on}</td>
                          <td>{member.updated_on}</td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-info btn-xs"
                              onClick={() => this.onOpenModal(member)}
                            >
                              Edit
                            </button>
                            <Modal
                              open={this.state.open}
                              onClose={this.onCloseModal}
                            >
                              <form
                                onSubmit={this.handleSubmit}
                                className="text-center border border-light "
                              >
                                <p>update details</p>
                                <div className="form-row mb-4">
                                  <div className="col-m-6">
                                    <input
                                      type="text"
                                      className="form-control"
                                      name="name"
                                      defaultValue={member.userName || " "}
                                      placeholder="username"
                                      onChange={this.logChange}
                                      required
                                    />
                                  </div>
                                  <div className="col-m-6">
                                    <input
                                      type="password"
                                      class="form-control"
                                      name="password"
                                      defaultValue={member.userPasswd}
                                      placeholder="userpasswd"
                                      aria-describedby="defaultRegisterFormPasswordHelpBlock"
                                      onChange={this.logChange}
                                      required
                                    />
                                  </div>
                                </div>
                                <input
                                  type="email"
                                  className="form-control mb-4"
                                  name="email"
                                  defaultValue={member.userEmail || ""}
                                  placeholder="usermail"
                                  onChange={this.logChange}
                                  required
                                />

                                <input
                                  type="text"
                                  className="form-control"
                                  name="phone"
                                  defaultValue={member.phoneNo || ""}
                                  placeholder="Phone number"
                                  onChange={this.logChange}
                                  required
                                />
                                <select
                                  className="form-control"
                                  name="dept_id"
                                  defaultValue={member.dept_id || ""}
                                  value={this.state.dept_id}
                                  placeholder="Dept_name"
                                  onChange={this.logChange}
                                  required
                                >
                                  <option preventDefault>select</option>
                                  {this.state.department.map(user => {
                                    return (
                                      <option key={user.dept_id}>
                                        {user.dept_id}
                                      </option>
                                    );
                                  })}
                                </select>

                                <button
                                  className="btn btn-info my-4 btn-block"
                                  type="submit"
                                  required
                                  onClick={() => {
                                    this.onCloseModal();
                                  }}
                                >
                                  Save Details
                                </button>
                              </form>
                            </Modal>
                            &nbsp;&nbsp;
                            <button
                              type="button"
                              className="btn btn-danger btn-xs"
                              onClick={() => {
                                if (
                                  window.confirm(
                                    "Are you sure you want to delete"
                                  )
                                )
                                  this.handleDelete(member);
                              }}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                }
              />
            </Col>
          </Row>
        </Grid>
        <Pagination
          itemsCount={count}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={this.handlePageChange}
        />
      </div>
    );
  }
}

export default UserProfile;
