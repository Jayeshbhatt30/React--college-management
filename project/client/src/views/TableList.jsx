/*!

=========================================================
* Light Bootstrap Dashboard React - v1.3.0
=========================================================

* Product Page: https://www.creative-tim.com/product/light-bootstrap-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/light-bootstrap-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { Component } from "react";
import { Grid, Row, Col, Table } from "react-bootstrap";
import Modal from "react-responsive-modal";

import Card from "components/Card/Card.jsx";

// import { thArray, tdArray } from "variables/Variables.jsx";

class TableList extends Component {
  state = {
    department: [],
    dept_name: "",
    open: false
  };
  onOpenModal = member => {
    this.setState({
      open: true,
      id: member.dept_id
    });
  };

  onCloseModal = () => {
    this.setState({ open: false });
  };

  componentDidMount() {
    fetch("/departments", {
      method: "GET"
    })
      .then(res => {
        if (res.status >= 400) {
          throw new Error("Bad response from server");
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

  logChange = e => {
    this.setState({
      [e.target.name]: e.target.value //setting value edited by the admin in state.
    });
  };

  handleSubmit = event => {
    event.preventDefault();

    var data = {
      id: this.state.id,
      dept_name: this.state.dept_name
    };

    fetch("/departments/edit", {
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

  handleDelete(member) {
    var data = {
      id: member.dept_id
    };

    const department = this.state.department.filter(
      m => m.dept_id !== member.dept_id
    );
    this.setState({ department });

    fetch("/departments/update", {
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

  render() {
    return (
      <div className="content">
        <Grid fluid>
          <Row>
            <Col md={12}>
              <Card
                title="Department List"
                ctTableFullWidth
                ctTableResponsive
                content={
                  <Table striped hover>
                    <thead>
                      <tr>
                        <th>Dept_id</th>
                        <th>Department</th>
                        <th>created_on</th>
                        <th>updated_on</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.department.map(member => (
                        <tr key={member.dept_id}>
                          <td>{member.dept_id}</td>
                          <td>{member.dept_name}</td>
                          <td>{member.created_on}</td>
                          <td>{member.updated_on}</td>

                          <td>
                            <button
                              type="button"
                              class="btn btn-info btn-xs"
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
                                action="#!"
                              >
                                <p>update Department</p>

                                <input
                                  type="text"
                                  className="form-control"
                                  name="dept_name"
                                  value={this.state.dept_name}
                                  placeholder="Dept_name"
                                  onChange={this.logChange}
                                  required
                                />

                                <button
                                  class="btn btn-info my-4 btn-block"
                                  type="submit"
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
                              class="btn btn-danger btn-xs"
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
      </div>
    );
  }
}

export default TableList;
