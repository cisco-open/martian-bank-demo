/**
 * Copyright (c) 2023 Cisco Systems, Inc. and its affiliates All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import { Row, Col, Card } from "react-bootstrap";
import "../index.css";

const Footer = () => {
  return (
    <div className="bg-dark" style={{flex: 2}}>
      <Row style={{ marginTop: "2vh", width: "100vw" }}>
        <Col md={12}>
          <Card
            className="bg-dark text-white border-0"
            style={{
              marginTop: "1.5vh",
              position: "absolute",
              bottom: 0,
              width: "100%",
            }}
          >
            <Card.Body>
              <Card.Text style={{ fontSize: "1.25vh" }}>
                <Card.Body>
                  <span>
                    <strong>Account Disclosures</strong>
                  </span>
                  <br />
                  <br />
                  <span>Investment and Insurance Products are: </span>
                  1. Not Insured by the MFIC (Martian Financial Institutions
                  Commission) or Any Martian Government Agency 2. Not a Deposit
                  or Other Obligation of, or Guaranteed by, the Bank or 3. Any
                  Bank Affiliate Subject to Investment Risks, Including Possible
                  Loss of the Principal Amount Invested
                  <span>
                    Investment products and services are offered through Martian
                    Bank Advisors. Martian Bank Advisors is a trade name used by
                    Martian Clearing Services, LLC (MCSC) and Martian Bank
                    Advisors Financial Network, LLC, Members MPIC (Martian
                    Planetary Investment Commission), separate registered
                    broker-dealers and non-bank affiliates of Martian Bank
                    Corporation.
                  </span>
                  <br />
                  <span>
                    Deposit products offered by Martian Bank, M.A. Member MFDIC
                    (Martian Financial Deposit Insurance Corporation).
                  </span>
                  <br />
                  <span>Equal Planetary Habitat Lender</span>
                  <br />
                  <span>
                    MFICO is a registered trademark of Martian Isaac Corporation
                    in Mars and other celestial bodies.
                  </span>
                </Card.Body>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Footer;
