/**
 * Copyright (c) 2023 Cisco Systems, Inc. and its affiliates All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { useGetAllAccountsMutation } from "../slices/accountApiSlice";
import {
  getAccounts,
  selectedAccount,
  currentAccount,
} from "../slices/accountSlice";
import Loader from "../components/Loader";
import AccountDisclosure from "../components/AccountDisclosure";
import Hero from "../components/Hero";
import "../index.css";

const HomeScreen = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const accountInfo = useSelector(
    (state) => state.account.all_accounts
  ).response;
  const dispatch = useDispatch();
  const [getAllAccounts, { isLoading }] = useGetAllAccountsMutation();

  useEffect(() => {
    try {
      dispatch(selectedAccount());
      dispatch(currentAccount());
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

  const fetchAccounts = async () => {
    const data = new FormData();
    data.append("email_id", userInfo.email);
    const res = await getAllAccounts(data).unwrap();
    console.log(res);
    dispatch(getAccounts(res));
  };

  const renderAccountCard = (account) => {
    return (
      <Link
        to="/acc-info"
        style={{ textDecoration: "none" }}
        onClick={() => dispatch(currentAccount(account))}
      >
        <Card style={{ marginTop: "2vh" }}>
          <Card.Header className="bg-dark text-uppercase text-white">
            {account.account_type} Account
            <FontAwesomeIcon
              icon={faArrowRightFromBracket}
              style={{ marginLeft: "1rem" }}
            />
          </Card.Header>
          <Card.Body>
            <Card.Text>
              <Row>
                <Col md={5} className="text-center">
                  <div>
                    <strong style={{ fontSize: "3vh" }}>
                      ${account.balance.toFixed(2)}
                    </strong>
                  </div>
                  <div className="text-muted">Available balance</div>
                </Col>
                <Col md={1} />
                <Col md={6}>
                  <div style={{ fontSize: "1.25vh", marginTop: "1vh" }}>
                    Account Number:
                    <span className="text-primary">
                      <span>&nbsp;</span>
                      <strong>...{account.account_number.slice(-4)}</strong>
                    </span>
                    <br />
                    <div style={{ fontSize: "1.25vh" }} className="text-muted">
                      Name: {account.name} <br />
                      Email ID: {account.email_id}
                    </div>
                  </div>
                </Col>
              </Row>
            </Card.Text>
          </Card.Body>
          <Card.Footer>
            <Link
              to="/transfer"
              style={{ textDecoration: "none" }}
              onClick={() => dispatch(selectedAccount(account))}
            >
              <Button variant="dark" className="float-end me-2" size="sm">
                Transfer money
              </Button>
            </Link>
          </Card.Footer>
        </Card>
      </Link>
    );
  };

  const renderAccounts = () => {
    if (!accountInfo) {
      return <Loader />;
    }

    if (accountInfo.length > 0) {
      return accountInfo.map((account) => renderAccountCard(account));
    } else {
      return (
        <>
          <Card style={{ marginTop: "2vh" }}>
            <Card.Header className="bg-dark text-uppercase text-white">
              <strong>No Accounts Found</strong>
            </Card.Header>
            <Card.Body>
              <Card.Text>
                Would you like to create a new account with us?
              </Card.Text>
            </Card.Body>
            <Card.Footer>
              <Link to="/new-account" style={{ textDecoration: "none" }}>
                <Button variant="dark" className="float-end">
                  Create Account
                </Button>
              </Link>
            </Card.Footer>
          </Card>
        </>
      );
    }
  };

  const renderDashboard = () => {
    return (
      <Container fluid style={{ overflowY: "auto" }}>
        <Row>
          <Col md={1} />
          <Col md={7} style={{ marginTop: "5vh" }}>
            {renderAccounts()}
          </Col>
          <Col md={1} />
          <Col md={3} style={{ marginTop: "5vh" }}>
            <AccountDisclosure />
          </Col>
        </Row>
      </Container>
    );
  };

  return userInfo ? renderDashboard() : <Hero />;
};

export default HomeScreen;
