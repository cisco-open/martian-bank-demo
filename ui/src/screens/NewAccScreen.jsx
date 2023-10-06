/**
 * Copyright (c) 2023 Cisco Systems, Inc. and its affiliates All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col, Modal, Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useCreateAccountMutation } from "../slices/accountApiSlice";
import { createAccount } from "../slices/accountSlice";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import "../index.css";
import TermsAndConditionsModal from "../components/AccountTnC";

const NewAccScreen = () => {
  const [validated, setValidated] = useState(false);
  const [address, setAddress] = useState("");
  const [govtId, setGovtId] = useState("");
  const [govtIdNo, setGovtIdNo] = useState("");
  const [accType, setAccType] = useState("");
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const [createNewAccount, { isLoading }] = useCreateAccountMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setValidated(true);

    const form = e.currentTarget;
    if (form.checkValidity()) {
      try {
        // Form data submission
        const data = new FormData();
        data.append("name", userInfo.name);
        data.append("email_id", userInfo.email);
        data.append("address", address);
        data.append("government_id_type", govtId);
        data.append("govt_id_number", govtIdNo);
        data.append("account_type", accType);
        console.log("Sending data: ", {
          name: userInfo.name,
          email_id: userInfo.email,
          address,
          government_id_type: govtId,
          govt_id_number: govtIdNo,
          account_type: accType,
        })

        const res = await createNewAccount(data).unwrap();
        if (res.response) {
          dispatch(createAccount(res));
          toast.success(
            "Congratulations, your account has been created! We have also given you a $100 joining bonus",
            {
              className: "toast-container-custom",
              autoClose: 2000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            }
          );
          navigate("/");
        } else {
          toast.error(`You can only have 1 ${accType} account`, {
            className: "toast-container-custom",
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        }
      } catch (err) {
        console.log(err);
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
    }
  };

  return (
    <div>
      <Container>
        <Row className="bg-white rounded" style={{ marginTop: "5vh" }}>
          {/* Left Column */}
          <Col md={5} className="rounded p-5">
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
                  New Account
                </h4>
                {isLoading ? (
                  <Loader />
                ) : (
                  <Form
                    noValidate
                    validated={validated}
                    onSubmit={handleSubmit}
                  >
                    <Row className="mt-4">
                      <Col md={6}>
                        <Form.Group className="my-3" controlId="name">
                          <Form.Label>Name</Form.Label>
                          <Form.Control
                            type="text"
                            required
                            placeholder="Enter your name"
                            value={userInfo.name}
                            disabled
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="my-3" controlId="email">
                          <Form.Label>Email address</Form.Label>
                          <Form.Control
                            type="email"
                            required
                            placeholder="Enter your email address"
                            value={userInfo.email}
                            disabled
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Form.Group className="my-3" controlId="acc_type">
                        <Form.Label>Account type</Form.Label>
                        <Form.Select
                          value={accType}
                          multiple={false}
                          onChange={(e) => setAccType(e.target.value)}
                          aria-label="Select account type"
                        >
                          <option value="">Select your account type</option>
                          <option value="Checking">Checking</option>
                          <option value="Savings">Savings</option>
                          <option value="Investment">Investment</option>
                          <option value="Money Market">Money Market</option>
                        </Form.Select>
                      </Form.Group>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="my-3" controlId="govt_id">
                          <Form.Label>ID type</Form.Label>
                          <Form.Select
                            value={govtId}
                            multiple={false}
                            onChange={(e) => setGovtId(e.target.value)}
                            aria-label="Select your ID type"
                          >
                            <option value="">Select your ID type</option>
                            <option value="Passport">Passport</option>
                            <option value="DriverLicense">
                              Driver's License
                            </option>
                            <option value="AadharCard">SSN</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="my-3" controlId="govt_id_no">
                          <Form.Label>ID number</Form.Label>
                          <Form.Control
                            type="text"
                            required
                            placeholder="Enter your ID number"
                            value={govtIdNo}
                            onChange={(e) => setGovtIdNo(e.target.value)}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Form.Group className="my-3" controlId="address">
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                          type="text"
                          required
                          placeholder="Enter your residential address"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                        />
                      </Form.Group>
                    </Row>

                    <Row>
                      <Col>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <Form.Group controlId="checkbox">
                            <Form.Check
                              type="checkbox"
                              checked={isCheckboxChecked}
                              onChange={(e) =>
                                setIsCheckboxChecked(e.target.checked)
                              }
                              required
                            />
                          </Form.Group>
                          <div
                            onClick={() => setShowModal(true)}
                            style={{
                              textDecoration: "underline",
                              color: "blue",
                            }}
                          >
                            Terms and Conditions
                          </div>
                          {(showModal || !isCheckboxChecked) && (
                            <Modal
                              show={showModal}
                              onHide={() => setShowModal(false)}
                              centered
                              size="xl"
                            >
                              {showModal && <TermsAndConditionsModal />}
                              <Modal.Footer>
                                <Button
                                  variant="secondary"
                                  onClick={() => setShowModal(false)}
                                >
                                  Close
                                </Button>
                              </Modal.Footer>
                            </Modal>
                          )}
                        </div>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Link to="/">
                          <Button
                            style={{ width: "100%" }}
                            variant="dark"
                            className="mt-5"
                          >
                            Cancel
                          </Button>
                        </Link>
                      </Col>

                      <Col md={6}>
                        <Button
                          style={{ width: "100%" }}
                          type="submit"
                          variant="dark"
                          className="mt-5 mr-3"
                        >
                          Create Account
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                )}
              </Col>
            </Row>
          </Col>

          {/* Right Column */}
          <Col md={6} className="rounded p-5" style={{ margin: "2vh" }}>
            <Row>
              <Col md={12} className="p-5">
                <h1 className="text-center">$100 bonus on us!</h1>
                <p className="text-center">
                  Open an eligible account with qualifying electronic deposits
                  and get $100 bonus.
                </p>
              </Col>
            </Row>
            <Row>
              <Col md={12} style={{ padding: "7.5vh", paddingTop: "5vh" }}>
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
    </div>
  );
};

export default NewAccScreen;
