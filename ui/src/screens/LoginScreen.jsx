/**
 * Copyright (c) 2023 Cisco Systems, Inc. and its affiliates All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col, Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import "../index.css";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      console.log(res);
      if (res.status === false) {
        toast.error(res.message, {
          className: "toast-container-custom",
          autoClose: 500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        return;
      }
      dispatch(setCredentials({ ...res }));
      toast.success("Successfully logged in!", {
        className: "toast-container-custom",
        autoClose: 500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      navigate("/");
    } catch (err) {
      toast.error(err?.data?.message || err.error, {
        className: "toast-container-custom",
        autoClose: 500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  };

  return (
    <Container>
      <Row className="bg-white rounded" style={{ marginTop: "5vh" }}>
        <Col md={5} className="rounded p-5" style={{ margin: "2vh" }}>
          <Row>
            <Col md={12} className="rounded card border p-5">
              <h4
                className="bg-light mx-3"
                style={{
                  textAlign: "center",
                  paddingTop: "2vh",
                  paddingBottom: "2vh",
                }}
              >
                Login
              </h4>

              <Form onSubmit={submitHandler}>
                <Form.Group className="my-4" controlId="email">
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    required
                    pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
                    onChange={(e) => setEmail(e.target.value)}
                  ></Form.Control>
                  <Form.Text muted style={{ fontSize: "1.25vh" }}>
                    Please enter a valid email address.
                  </Form.Text>
                </Form.Group>

                <Form.Group className="my-4" controlId="password">
                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    required
                    pattern="^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$"
                    onChange={(e) => setPassword(e.target.value)}
                  ></Form.Control>
                  <Form.Text muted style={{ fontSize: "1.25vh" }}>
                    Password must include:
                    <div>1. at least 8 characters</div>
                    <div>2. at least one uppercase letter</div>
                    <div>3. at least one lowercase letter</div>
                    <div>4. at least one digit</div>
                    <div>5. at least one special character (@$!%*#?&)</div>
                  </Form.Text>
                </Form.Group>

                <Button
                  disabled={isLoading}
                  type="submit"
                  variant="dark"
                  className="mt-3"
                >
                  Login
                </Button>
              </Form>

              {isLoading && <Loader />}

              <Row className="pt-4">
                <Col style={{ fontSize: "1.25vh" }}>
                  New Customer? <Link to="/register">Create new account</Link>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>

        <Col md={6} className="rounded p-5" style={{ margin: "2vh" }}>
          <Row>
            <Col md={12} className="p-5">
              <h1 className="text-center">$100 bonus on us!</h1>
              <p className="text-center">
                Open an eligible account with qualifying electronic deposits and
                get $100 bonus.
              </p>
            </Col>
          </Row>
          <Row>
            <Col md={12} style={{ padding: "10vh", paddingTop: "0" }}>
              <img
                src="./src/assets/card.png"
                // src="https://via.placeholder.com/400x400"
                alt="card"
                className="img-fluid"
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginScreen;
