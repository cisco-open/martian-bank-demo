/**
 * Copyright (c) 2023 Cisco Systems, Inc. and its affiliates All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Form,
  Button,
  Row,
  Col,
  Modal,
} from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import { useDispatch, useSelector } from "react-redux";
import {
  usePostLoanMutation,
  useGetApprovedLoansMutation,
} from "../slices/loanApiSlice";
import { createLoan } from "../slices/loanSlice";
import { useGetAllAccountsMutation } from "../slices/accountApiSlice";
import { getAccounts } from "../slices/accountSlice";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import "../index.css";

const ApplyLoan = () => {
  const [validated, setValidated] = useState(false);

  const [accNo, setAccNo] = useState("");
  const [accType, setAccType] = useState("");

  const [govtId, setGovtId] = useState("");
  const [govtIdNo, setGovtIdNo] = useState("");

  const [loanType, setLoanType] = useState("");
  const [loanAmount, setLoanAmount] = useState("");

  const [intRate, setIntRate] = useState("");
  const [loanTime, setLoanTime] = useState("");

  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
  const [loanAdded, setLoanAdded] = useState(false);

  let allAccounts = useSelector((state) => state.account.all_accounts).response;
  if (!allAccounts) {
    allAccounts = [];
  }

  const [selectedAccount, setSelectedAccount] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const terms = {
    BaseCamp: {
      interestRate: 5.99,
      timePeriod: 10,
    },
    Rover: {
      interestRate: 6.5,
      timePeriod: 5,
    },
    PotatoFarming: {
      interestRate: 7.25,
      timePeriod: 7,
    },
    IceHome: {
      interestRate: 8.75,
      timePeriod: 15,
    },
    Rocket: {
      interestRate: 9.99,
      timePeriod: 20,
    },
  };

  const [postLoanAPI, { isLoading }] = usePostLoanMutation();
  const [getAllAccounts, { isLoading: isLoading1 }] =
    useGetAllAccountsMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const submitHandler = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setValidated(true);

    const form = e.currentTarget;
    if (form.checkValidity()) {
      try {
        const data_loan = new FormData();
        data_loan.append("name", userInfo.name);
        data_loan.append("email", userInfo.email);
        data_loan.append("account_number", accNo);
        data_loan.append("account_type", accType);
        data_loan.append("govt_id_number", govtIdNo);
        data_loan.append("govt_id_type", govtId);
        data_loan.append("loan_type", loanType);
        data_loan.append("loan_amount", loanAmount);
        data_loan.append("interest_rate", intRate);
        data_loan.append("time_period", loanTime);
        const res = await postLoanAPI(data_loan).unwrap();
        console.log(res);
        dispatch(createLoan(res));
        toast.success("Congratulations! Your loan is approved!", {
          className: "toast-container-custom",
          autoClose: 500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        navigate("/loan");
        setLoanAdded(true);
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

  const [showModal, setShowModal] = useState(false);

  const handleModalOpen = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const fetchAccounts = async () => {
    const data = new FormData();
    data.append("email_id", userInfo.email);
    const res = await getAllAccounts(data).unwrap();
    dispatch(getAccounts(res));
  };

  useEffect(() => {
    try {
      fetchAccounts();
    } catch (err) {
      console.log(err);
      toast.error("Error in fetching accounts!", {
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
  }, []);

  return (
    <FormContainer>
      <h4
        className="bg-light mx-3"
        style={{
          textAlign: "center",
          paddingTop: "2vh",
          paddingBottom: "2vh",
        }}
      >
        Loan Application
      </h4>
      {isLoading ? (
        <Loader />
      ) : (
        <Form noValidate validated={validated} onSubmit={submitHandler}>
          <Row className="mt-4">
            <Col md={6}>
              <Form.Group className="my-3" controlId="name">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your name"
                  value={userInfo.name}
                  disabled
                  required
                ></Form.Control>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="my-3" controlId="email">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter your email address"
                  value={userInfo.email}
                  disabled
                  required
                ></Form.Control>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={4}>
              <Form.Group className="my-3" controlId="acc_type">
                <Form.Label>Account type</Form.Label>
                <Form.Select
                  required
                  value={accType}
                  multiple={false}
                  onChange={(e) => setAccType(e.target.value)}
                  aria-label="Select account type"
                  disabled={accType ? true : false}
                >
                  <option value="">Select your account type</option>
                  <option value="Savings">Savings</option>
                  <option value="Checking">Checking</option>
                  <option value="Investment">Investment</option>
                  <option value="Money Market">Money Market</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={8}>
              <Form.Group className="my-3" controlId="acc_no">
                <Form.Label>Account number</Form.Label>
                <Form.Select
                  required
                  value={accNo ? accNo : "Select Account"}
                  onChange={(e) => {
                    const selectedAccountNumber = e.target.value;
                    const selectedAccount = allAccounts.find(
                      (account) =>
                        account.account_number === selectedAccountNumber
                    );
                    setAccNo(selectedAccountNumber);
                    setAccType(
                      selectedAccount ? selectedAccount.account_type : null
                    );
                    setGovtId(
                      selectedAccount
                        ? selectedAccount.government_id_type
                        : null
                    );
                    setGovtIdNo(
                      selectedAccount ? selectedAccount.govt_id_number : null
                    );
                  }}
                  aria-label="Select account number"
                >
                  <option value="">Select your account number</option>
                  {allAccounts.map((account) => (
                    <option value={account.account_number}>
                      {account.account_number}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={4}>
              <Form.Group className="my-3" controlId="govt_id">
                <Form.Label>ID Type</Form.Label>
                <Form.Select
                  required
                  value={govtId}
                  multiple={false}
                  onChange={(e) => setGovtId(e.target.value)}
                  aria-label="Select your ID type"
                  disabled={govtId ? true : false}
                >
                  <option value="">Select your ID type</option>
                  <option value="Passport">Passport</option>
                  <option value="DriverLicense">Driver's License</option>
                  <option value="AadharCard">SSN</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={8}>
              <Form.Group className="my-3" controlId="govt_id_no">
                <Form.Label>ID number</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="Enter your ID number"
                  value={govtIdNo}
                  onChange={(e) => setGovtIdNo(e.target.value)}
                  disabled={govtIdNo ? true : false}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="my-3" controlId="loan_type">
                <Form.Label>Loan type</Form.Label>
                <Form.Select
                  required
                  value={loanType}
                  multiple={false}
                  onChange={(e) => {
                    const selectedLoanType = e.target.value;
                    setIntRate(terms[selectedLoanType].interestRate);
                    setLoanTime(terms[selectedLoanType].timePeriod);
                    setLoanType(e.target.value);
                  }}
                  aria-label="Select loan type"
                >
                  <option value="">Select your loan type</option>
                  <option value="BaseCamp">Base Camp</option>
                  <option value="Rover">Rover</option>
                  <option value="PotatoFarming">Potato Farming</option>
                  <option value="IceHome">Ice Home</option>
                  <option value="Rocket">Rocket</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="my-3" controlId="loan_amount">
                <Form.Label>Loan amount</Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  required
                  placeholder="Enter the loan amount"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  onWheel={(e) => e.target.blur()}
                ></Form.Control>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="my-3" controlId="loan_type">
                <Form.Label>Interest Rate</Form.Label>
                <Form.Control
                  value={intRate}
                  type="number"
                  min="5"
                  required
                  disabled
                  placeholder="Select loan type"
                  onWheel={(e) => e.target.blur()}
                  onChange={(e) => setIntRate(e.target.value)}
                  aria-label="Select loan type"
                ></Form.Control>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="my-3" controlId="loan_amount">
                <Form.Label>Time Period</Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  required
                  disabled
                  placeholder="Select loan type"
                  value={loanTime}
                  onChange={(e) => setLoanTime(e.target.value)}
                  onWheel={(e) => e.target.blur()}
                ></Form.Control>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Form.Group controlId="checkbox">
                  <Form.Check
                    type="checkbox"
                    checked={isCheckboxChecked}
                    onChange={(e) => setIsCheckboxChecked(e.target.checked)}
                    required
                  />
                </Form.Group>
                <div
                  onClick={handleModalOpen}
                  style={{ textDecoration: "underline", color: "blue" }}
                >
                  Terms and Conditions
                </div>
                <Modal
                  show={showModal}
                  onHide={handleModalClose}
                  centered
                  size="xl"
                >
                  <Modal.Header closeButton>
                    <Modal.Title>Terms and Conditions</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <p>
                      Welcome to Martian Bank! By applying for a loan with us,
                      you agree to the following terms and conditions:
                    </p>

                    <h3>1. Eligibility</h3>
                    <p>
                      To apply for a loan at Martian Bank, you must meet certain
                      eligibility criteria. These criteria include but are not
                      limited to: being a resident of Mars, having a minimum age
                      of 21 years, and meeting the required creditworthiness
                      standards set by Martian Bank. Additional documentation
                      and information may be required during the loan
                      application process.
                    </p>

                    <h3>2. Loan Terms</h3>
                    <p>
                      The loan terms, including the loan amount, interest rate,
                      repayment period, and any applicable fees, will be
                      provided to you during the loan application process. It is
                      important to carefully review and understand these terms
                      before accepting the loan offer. Any changes to the loan
                      terms will be communicated to you in a timely manner.
                    </p>

                    <h3>3. Repayment</h3>
                    <p>
                      As a borrower, you are responsible for making timely
                      repayments as agreed upon in the loan agreement. Failure
                      to make payments on time may result in additional charges,
                      penalties, and potential damage to your credit history. It
                      is essential to manage your finances responsibly and
                      ensure sufficient funds are available for loan repayments.
                    </p>

                    <h3>4. Default and Remedies</h3>
                    <p>
                      If you default on your loan payments, Martian Bank
                      reserves the right to take necessary actions to recover
                      the outstanding amount. This may include but is not
                      limited to reporting the default to credit agencies,
                      initiating legal proceedings, and engaging third-party
                      collection agencies. It is crucial to communicate with
                      Martian Bank in case of financial difficulties to explore
                      possible solutions and avoid default.
                    </p>

                    <p>
                      By applying for a loan with Martian Bank, you acknowledge
                      that you have read, understood, and agreed to these Terms
                      and Conditions. If you have any questions or concerns,
                      please contact our customer support team.
                    </p>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="dark" onClick={handleModalClose}>
                      Agree
                    </Button>
                  </Modal.Footer>
                </Modal>
              </div>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Button
                style={{ width: "100%" }}
                type="submit"
                variant="dark"
                className="mt-5 mr-3"
              >
                Apply
              </Button>
            </Col>
            <Col md={6}>
              <Link to="/loan">
                <Button
                  style={{ width: "100%" }}
                  variant="dark"
                  className="mt-5"
                >
                  Cancel
                </Button>
              </Link>
            </Col>
          </Row>
        </Form>
      )}
    </FormContainer>
  );
};

export default ApplyLoan;
