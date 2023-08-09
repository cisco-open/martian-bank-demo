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
  DropdownButton,
  Dropdown,
  Tabs,
  Tab,
} from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import { useSelector, useDispatch } from "react-redux";
import {
  usePostTransferMutation,
  usePostTransferExternalMutation,
} from "../slices/transferApiSlice";
import { createTransfer } from "../slices/transferSlice";
import { deleteSelectedAccount } from "../slices/accountSlice";
import { useGetAllAccountsMutation } from "../slices/accountApiSlice";
import { getAccounts } from "../slices/accountSlice";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import "../index.css";

const TransferScreen = () => {
  let selectedAccount = useSelector((state) => state.account.selected_account);
  let allAccounts = useSelector((state) => state.account.all_accounts).response;

  if (!selectedAccount) {
    selectedAccount = {
      accountType: "",
      accountNumber: "",
      balance: 0.0,
    };
  }

  if (!allAccounts) {
    allAccounts = [];
  }

  const [transferType, setTransferType] = useState("internal");
  const [accType, setAccType] = useState(
    selectedAccount ? selectedAccount.account_type : ""
  );
  const [accNo, setAccNo] = useState(
    selectedAccount ? selectedAccount.account_number : ""
  );
  const [receiverEmail, setReceiverEmail] = useState("");
  const [receiverAcc, setReceiverAcc] = useState("");
  const [receiverAccNo, setReceiverAccNo] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [reason, setReason] = useState("");
  const [balance, setBalance] = useState(selectedAccount.balance);

  const checkingAccount = allAccounts.find(
    (account) => account.account_type === "Checking"
  );

  const checkingAccountBalance = checkingAccount
    ? checkingAccount.balance
    : null;

  const { userInfo } = useSelector((state) => state.auth);
  const toggleTransferType = (key) => {
    setTransferType(key);
    setReason("");
    setTransferAmount("");
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [postTransfer, { isLoading }] = usePostTransferMutation();
  const [postTransferExternal, { isLoading: isLoading2 }] =
    usePostTransferExternalMutation();
  const [getAllAccounts, { isLoading: isLoading1 }] =
    useGetAllAccountsMutation();

  const submitHandler = async (e) => {
    e.preventDefault();

    if (accNo === receiverAccNo) {
      toast.error("Sender and receiver account numbers cannot be same!", {
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

    try {
      const data = new FormData();
      data.append("sender_account_number", accNo);
      data.append("receiver_account_number", receiverAccNo);
      data.append("sender_account_type", accType);
      data.append("receiver_account_type", receiverAcc);
      data.append("reason", reason);
      data.append("amount", transferAmount);

      const res = await postTransfer(data).unwrap();
      console.log(res);
      dispatch(createTransfer({ ...res }));
      toast.success("Money transfered!", {
        className: "toast-container-custom",
        autoClose: 500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      dispatch(deleteSelectedAccount());
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

  const submitHandlerExternal = async (e) => {
    e.preventDefault();
    if (userInfo.email === receiverEmail) {
      toast.error("Sender and receiver cannot be same!", {
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

    try {
      const data_external = new FormData();
      data_external.append("sender_email", userInfo.email);
      data_external.append("receiver_email", receiverEmail);
      data_external.append("reason", reason);
      data_external.append("amount", transferAmount);

      const res = await postTransferExternal(data_external).unwrap();
      console.log(res);
      if (res?.response?.approved === false) {
        toast.error(res.response.message, {
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
      else if (res?.response?.approved === true) {
        toast.success("Money transfered!", {
          className: "toast-container-custom",
          autoClose: false,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        navigate("/");
      }
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
        Transfer Money
      </h4>
      <Row>
        <Col md={1} />
        <Col md={9}>
          <Tabs
            defaultActiveKey="internal"
            id="uncontrolled-tab-example"
            onSelect={toggleTransferType}
            className="my-3"
            style={{ display: "flex", width: "100%" }}
          >
            <Tab eventKey="internal" title="Internal Transfers">
              <Form>
                <Row className="mt-4">
                  <Col md={4}>
                    <DropdownButton
                      id="acc_type"
                      className="mt-5"
                      variant="dark"
                      disabled={accNo ? true : false}
                      title={accType ? accType : "Select"}
                      onSelect={(option) => setAccType(option)}
                      style={{ width: "100%" }}
                    >
                      <Dropdown.Item eventKey="*required">
                        Your account type
                      </Dropdown.Item>
                      <Dropdown.Item eventKey="Savings">Savings</Dropdown.Item>
                      <Dropdown.Item eventKey="Checking">
                        Checking
                      </Dropdown.Item>
                      <Dropdown.Item eventKey="Investment">
                        Investment
                      </Dropdown.Item>
                      <Dropdown.Item eventKey="Money Market">
                        Money Market
                      </Dropdown.Item>
                    </DropdownButton>
                  </Col>
                  <Col md={8}>
                    <Form.Label className="mt-3">
                      Sender account number
                    </Form.Label>
                    <Form.Select
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
                        setBalance(
                          selectedAccount ? selectedAccount.balance : null
                        );
                      }}
                      style={{ width: "100%" }}
                      disabled={accNo ? true : false}
                    >
                      <option value="">Select Account</option>
                      {allAccounts.map((account) => {
                        if (account.account_number !== receiverAccNo) {
                          return (
                            <option
                              key={account.account_number}
                              value={account.account_number}
                            >
                              {account.account_number}
                            </option>
                          );
                        }
                        return null;
                      })}
                    </Form.Select>
                  </Col>
                </Row>

                <Row className="mt-3">
                  <Col md={4}>
                    <DropdownButton
                      id="receiver_acc_type"
                      className="mt-5"
                      variant="dark"
                      title={receiverAcc ? receiverAcc : "Select"}
                      onSelect={(e) => setReceiverAcc(e)}
                      style={{ width: "100%" }}
                      disabled={receiverAccNo ? true : false}
                    >
                      <Dropdown.Item eventKey="">
                        Receiver account type
                      </Dropdown.Item>
                      <Dropdown.Item eventKey="Savings">Savings</Dropdown.Item>
                      <Dropdown.Item eventKey="Checking">
                        Checking
                      </Dropdown.Item>
                      <Dropdown.Item eventKey="Investment">
                        Investment
                      </Dropdown.Item>
                      <Dropdown.Item eventKey="Money Market">
                        Money Market
                      </Dropdown.Item>
                    </DropdownButton>
                  </Col>
                  <Col md={8}>
                    <Form.Group className="mt-3" controlId="receiver_acc_no">
                      <Form.Label>Receiver account number</Form.Label>
                      <Form.Select
                        value={receiverAccNo ? receiverAccNo : "Select Account"}
                        onChange={(e) => {
                          const r_selectedAccountNumber = e.target.value;
                          const r_selectedAccount = allAccounts.find(
                            (account) =>
                              account.account_number === r_selectedAccountNumber
                          );
                          setReceiverAccNo(r_selectedAccountNumber);
                          setReceiverAcc(
                            r_selectedAccount
                              ? r_selectedAccount.account_type
                              : null
                          );
                        }}
                        style={{ width: "100%" }}
                      >
                        <option value="">Select Account</option>
                        {allAccounts.map((account) => {
                          if (account.account_number !== accNo) {
                            return (
                              <option
                                key={account.account_number}
                                value={account.account_number}
                              >
                                {account.account_number}
                              </option>
                            );
                          }
                          return null;
                        })}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mt-4">
                  {selectedAccount.balance !== "" ? (
                    <>
                      <Col md={4}>
                        <Form.Group className="my-3" controlId="balance">
                          <Form.Label>Your balance</Form.Label>
                          <Form.Control
                            value={`$ ${balance ? balance.toFixed(2) : "0.00"}`}
                            multiple={false}
                            disabled
                          />
                        </Form.Group>
                      </Col>
                      <Col md={8}>
                        <Form.Group
                          className="my-3"
                          controlId="transfer_amount"
                        >
                          <Form.Label>Amount to be transferred</Form.Label>
                          <Form.Control
                            type="text"
                            pattern="^(?!0\d)\d*(\.\d+)?$"
                            placeholder="Enter amount to be transferred (in USD)"
                            value={transferAmount}
                            onChange={(e) => setTransferAmount(e.target.value)}
                            onWheel={(e) => e.target.blur()}
                          />
                        </Form.Group>
                      </Col>
                    </>
                  ) : (
                    <Col md={12}>
                      <Form.Group className="my-3" controlId="transfer_amount">
                        <Form.Label>Amount to be transferred</Form.Label>
                        <Form.Control
                          type="text"
                          pattern="^(?!0\d)\d*(\.\d+)?$"
                          placeholder="Enter amount to be transferred (in USD)"
                          value={transferAmount}
                          onChange={(e) => setTransferAmount(e.target.value)}
                          onWheel={(e) => e.target.blur()}
                        />
                      </Form.Group>
                    </Col>
                  )}
                </Row>

                <Row>
                  <Form.Group className="my-3" controlId="reason">
                    <Form.Label>Reason</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter the reason for transfer (Optional)"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                    ></Form.Control>
                  </Form.Group>
                </Row>

                <Row>
                  <Col md={6}>
                    <Button
                      disabled={isLoading}
                      style={{ width: "100%" }}
                      type="submit"
                      variant="dark"
                      className="mt-3 mr-3"
                      onClick={submitHandler}
                    >
                      Transfer
                    </Button>
                  </Col>
                  <Col md={6}>
                    <Link to="/">
                      <Button
                        disabled={isLoading}
                        style={{ width: "100%" }}
                        type="submit"
                        variant="dark"
                        className="mt-3 mr-3"
                      >
                        Cancel
                      </Button>
                    </Link>
                  </Col>
                </Row>
              </Form>
            </Tab>

            <Tab eventKey="external" title="External Transfers">
              {checkingAccount ? (
                <Form>
                  <Row className="mt-4">
                    <Col md={4}>
                      <DropdownButton
                        id="acc_type"
                        className="mt-5"
                        variant="dark"
                        disabled
                        title={"Checking"}
                        style={{ width: "100%" }}
                      />
                    </Col>
                    <Col md={8}>
                      <Form.Label className="mt-3">Sender email ID</Form.Label>
                      <Form.Control
                        value={userInfo.email}
                        style={{ width: "100%" }}
                        disabled
                      ></Form.Control>
                    </Col>
                  </Row>

                  <Row className="mt-3">
                    <Col md={4}>
                      <DropdownButton
                        id="acc_type"
                        className="mt-5"
                        variant="dark"
                        disabled
                        title={"Checking"}
                        style={{ width: "100%" }}
                      />
                    </Col>
                    <Col md={8}>
                      <Form.Group className="mt-3" controlId="receiver_acc_no">
                        <Form.Label>Receiver email ID</Form.Label>
                        <Form.Control
                          value={receiverEmail ? receiverEmail : ""}
                          onChange={(e) => setReceiverEmail(e.target.value)}
                          style={{ width: "100%" }}
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row className="mt-4">
                    <Col md={4}>
                      <Form.Group className="my-3" controlId="balance">
                        <Form.Label>Your balance</Form.Label>
                        <Form.Control
                          value={`$ ${
                            checkingAccountBalance
                              ? checkingAccountBalance.toFixed(2)
                              : "0.00"
                          }`}
                          multiple={false}
                          disabled
                        />
                      </Form.Group>
                    </Col>
                    <Col md={8}>
                      <Form.Group className="my-3" controlId="transfer_amount">
                        <Form.Label>Amount to be transferred</Form.Label>
                        <Form.Control
                          type="text"
                          pattern="^(?!0\d)\d*(\.\d+)?$"
                          placeholder="Enter amount to be transferred (in USD)"
                          value={transferAmount}
                          onChange={(e) => setTransferAmount(e.target.value)}
                          onWheel={(e) => e.target.blur()}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Form.Group className="my-3" controlId="reason">
                      <Form.Label>Reason</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter the reason for transfer (Optional)"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                      ></Form.Control>
                    </Form.Group>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Button
                        disabled={isLoading2}
                        style={{ width: "100%" }}
                        type="submit"
                        variant="dark"
                        className="mt-3 mr-3"
                        onClick={submitHandlerExternal}
                      >
                        Transfer
                      </Button>
                    </Col>
                    <Col md={6}>
                      <Link to="/">
                        <Button
                          disabled={isLoading}
                          style={{ width: "100%" }}
                          type="submit"
                          variant="dark"
                          className="mt-3 mr-3"
                        >
                          Cancel
                        </Button>
                      </Link>
                    </Col>
                  </Row>

                </Form>
              ) : (
                <h5 className="text-center my-5 py-5">
                  You do not have a checking account. Please create one to make
                  external transfers.
                </h5>
              )}
            </Tab>
          </Tabs>
        </Col>
        <Col md={1} />
      </Row>

      {isLoading && <Loader />}
    </FormContainer>
  );
};

export default TransferScreen;
