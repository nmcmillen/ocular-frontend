import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import AuthService from "././services/auth.service";
import { useNavigate } from "react-router-dom";
import { useGlobalState } from ".././context/GlobalState";
import jwtDecode from "jwt-decode";
import request from "./services/api.request";

export default function LoginModal() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [state, dispatch] = useGlobalState();
  // const [person, setPerson] = useGlobalState();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  let navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    AuthService.login(username, password).then(async (resp) => {
      let data = await jwtDecode(resp.access);
      let person = await getPerson(data.user_id);

      await dispatch({
        currentUserToken: resp.access,
        currentUser: data,
        person,
      });
      // set person to local storage so it saves there
      localStorage.setItem("person", JSON.stringify(person));
      // navigate("/profile");
      window.location.reload(true);
    });
  };

  // new to get user data
  const getPerson = async (user) => {
    console.log("getperson function");
    let options = {
      url: `/api/users/${user}`,
      method: "GET",
    };
    let resp = await request(options);
    console.log(resp);
    return resp.data;
  };

  return (
    <>
      <Button
        className="text-white"
        style={{ padding: "5px" }}
        variant=""
        onClick={handleShow}
      >
        Login
      </Button>

      <Modal centered show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Login to Ocular</Modal.Title>
        </Modal.Header>
        <Form>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="user.ocular"
                name="username"
                onChange={(e) => setUsername(e.target.value)}
                required
                autoFocus
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                minLength="8"
                onChange={(e) => setPassword(e.target.value)}
                required
                autoFocus
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" onClick={handleLogin}>
              {" "}
              Sign In
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}
