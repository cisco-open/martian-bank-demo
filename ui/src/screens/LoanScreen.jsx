/**
 * Copyright (c) 2023 Cisco Systems, Inc. and its affiliates All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Row,
  Col,
  Card, 
  Badge,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  useGetApprovedLoansMutation,
} from "../slices/loanApiSlice";
import { storeLoanHistory } from "../slices/loanSlice";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import "../index.css";

const CustomCard = ({ title, text, icon, link }) => {
  return (
    <Card
      className="custom-card"
      style={{
        marginTop: "1.25vh",
      }}
    >
      <Card.Body>
        <Card.Title style={{ fontSize: "2vh" }} className="text-center">
          <strong>{title}</strong>
        </Card.Title>
        <Card.Text style={{ fontSize: "1.25vh" }} className="text-center">
          {text}
        </Card.Text>
      </Card.Body>
      <style>
        {`
                .custom-card:hover .card-body{
                  box-shadow: 0 10px 10px rgba(0, 0, 0, 0.5);
                }
                .custom-card:hover .position-absolute{
                  box-shadow: 0 10px 10px rgba(0, 0, 0, 0.5);
                }
              `}
      </style>
    </Card>
  );
};

const LoanScreen = () => {

  const [loanAdded, setLoanAdded] = useState(false);

  const loanInfo = useSelector((state) => state.loan.loan_history).response;

  let allAccounts = useSelector((state) => state.account.all_accounts).response;
  if (!allAccounts) {
    allAccounts = [];
  }

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loanHistoryAPI, { isLoading: isLoading2 }] =
    useGetApprovedLoansMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const fetchLoans = async () => {
    const data = new FormData();
    data.append("email", userInfo.email);
    const res = await loanHistoryAPI(data).unwrap();
    console.log(res);
    dispatch(storeLoanHistory(res));
  };

  useEffect(() => {
    try {
      fetchLoans();
    } catch (err) {
      console.log(err);
      toast.error("Error in fetching loans!", {
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
  }, [loanAdded]);

  return (
    <Row fluid style={{ overflowY: "auto" }}>
      <Col md={4} className="mt-5">
        <div
          style={{
            fontSize: "2.5vh",
            backgroundColor: "#e9ecef",
            marginBottom: "3vh",
          }}
          className="card text-center p-3"
        >
          Loan options for you
        </div>
        <CustomCard
          title="Base Camp"
          text={
            <>
              Interest Rate: 5.99%, Time Period: 10 years <br />
              <Badge
                bg="success"
                style={{
                  position: "absolute",
                  top: "1rem",
                  right: "1rem",
                }}
              >
                Eligible
              </Badge>
            </>
          }
        />
        <CustomCard
          title="Rover"
          text={
            <>
              Interest Rate: 6.5%, Time Period: 5 years <br />
              <Badge
                bg="success"
                style={{
                  position: "absolute",
                  top: "1rem",
                  right: "1rem",
                }}
              >
                Eligible
              </Badge>
            </>
          }
        />
        <Row>
          <Col md={3} />
          <Col md={6}>
            <Button
              style={{ width: "100%" }}
              variant="dark"
              className="mt-5"
              onClick={() => navigate("/new-loan")}
            >
              Apply here!
            </Button>
          </Col>
          <Col md={3} />
        </Row>
      </Col>

      <Col md={1} />

      <Col md={6} className="mt-5">
        {loanInfo ? (
          loanInfo.length > 0 ? (
            <div>
              <div
                style={{
                  fontSize: "2.5vh",
                  backgroundColor: "#e9ecef",
                  marginBottom: "3vh",
                }}
                className="card text-center p-3"
              >
                Enrolled Loans
              </div>
              {loanInfo.map((loan) => (
                <CustomCard
                  title={`${loan.loan_type} Loan for $${loan.loan_amount}`}
                  text={
                    <>
                      Interest Rate: {loan.interest_rate}%, Time Period:
                      {loan.time_period} years <br />
                      Account: {loan.account_number}
                    </>
                  }
                />
              ))}
            </div>
          ) : (
            <div>
              <div
                style={{
                  fontSize: "2.5vh",
                  backgroundColor: "#e9ecef",
                  marginBottom: "3vh",
                }}
                className="card text-center p-3"
              >
                Enrolled Loans
              </div>
              <h3 className="mt-5" style={{ textAlign: "center" }}>
                You dont have any approved loans
              </h3>
            </div>
          )
        ) : (
          <Loader />
        )}
      </Col>
    </Row>
  );
};

export default LoanScreen;
