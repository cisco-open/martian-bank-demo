/**
 * Copyright (c) 2023 Cisco Systems, Inc. and its affiliates All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import React from "react";
import {
  MDBBadge,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
} from "mdb-react-ui-kit";
import { Container, Form, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";
import { useGetTransactionsMutation } from "../slices/transactionApiSlice";
import { useGetAllAccountsMutation } from "../slices/accountApiSlice";
import { getAccounts } from "../slices/accountSlice";
import { storeTransaction } from "../slices/transactionSlice";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import "../index.css";

const TransactionScreen = () => {
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);

  const [allAccounts, setAllAccounts] = useState([]);

  const [selectedAccount, setSelectedAccount] = useState("");
  const [history, setHistory] = useState([]);

  const [getTransactions, { isLoading }] = useGetTransactionsMutation();
  const [getAllAccounts, { isLoading: isLoading1 }] =
    useGetAllAccountsMutation();

  const fetchHistory = async (e) => {
    setSelectedAccount(e.target.value);
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("account_number", e.target.value);
      const res = await getTransactions(data).unwrap();
      console.log(res)
      dispatch(storeTransaction(res));
      setHistory(res.response);
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
    const acc_data = new FormData();
    acc_data.append("email_id", userInfo.email);
    const res = await getAllAccounts(acc_data).unwrap();
    dispatch(getAccounts(res));
    setAllAccounts(res.response);
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
    <Container fluid style={{ overflowY: "auto", marginTop: "10vh" }}>
      <Form>
        <Form.Group as={Row}>
          <Col md={3} />
          <Col md={6}>
            <Form.Select
              value={selectedAccount ? selectedAccount : "Select Account"}
              multiple={false}
              onChange={fetchHistory}
              className="py-3 px-2 text-center"
            >
              <option value="Select Account">Select Account</option>
              {allAccounts.map((account) => (
                <option
                  key={account.account_number}
                  value={account.account_number}
                >
                  {account.account_number}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col md={3} />
        </Form.Group>
      </Form>
      <MDBTable align="middle" striped hover style={{ marginTop: "4vh" }}>
        <MDBTableHead dark>
          <tr
            className="text-center text-uppercase"
            style={{ fontSize: "2vh" }}
          >
            <th
              scope="col"
              className="bg-dark text-white"
              style={{ padding: "2vh" }}
            >
              Sender Account
            </th>
            <th
              scope="col"
              className="bg-dark text-white"
              style={{ padding: "2vh" }}
            >
              Amount
            </th>
            <th
              scope="col"
              className="bg-dark text-white"
              style={{ padding: "2vh" }}
            >
              Details
            </th>
            <th
              scope="col"
              className="bg-dark text-white"
              style={{ padding: "2vh" }}
            >
              Type
            </th>
          </tr>
        </MDBTableHead>
        <MDBTableBody>
          {history && history.length > 0 ? (
            history.map((transaction) => (
              <>
                <tr key={transaction.transaction_id}>
                  <td className="text-center fw-normal">
                    {transaction.account_number}
                  </td>
                  <td className="text-center fw-bold">
                    $ {transaction.amount}
                  </td>
                  <td className="text-center">
                    <p className="fw-normal mb-1">
                      {transaction.time_stamp.substring(0, 10)}
                    </p>
                    <p className="text-muted mb-0">{transaction.reason}</p>
                  </td>
                  <td className="text-center">
                    <MDBBadge
                      color={
                        transaction.type === "debit" ? "success" : "danger"
                      }
                      pill
                    >
                      {transaction.type}
                    </MDBBadge>
                  </td>
                </tr>
              </>
            ))
          ) : selectedAccount ? (
            <tr>
              <td colSpan={4} className="text-center">
                No transactions found.
              </td>
            </tr>
          ) : (
            <tr>
              <td colSpan={4} className="text-center">
                Please select an account.
              </td>
            </tr>
          )}
        </MDBTableBody>
      </MDBTable>
    </Container>
  );
};

export default TransactionScreen;
