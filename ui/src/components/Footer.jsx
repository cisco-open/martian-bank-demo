/**
 * Copyright (c) 2023 Cisco Systems, Inc. and its affiliates All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import { Row, Col, Card } from "react-bootstrap";
import "../index.css";

const Footer = () => {
  return (
    <div className="bg-dark footer-container">
      <Row className="footer-row">
        <Col md={12}>
          <Card className="bg-dark text-white border-0 footer-card">
            <Card.Body>
              <Card.Text className="footer-text">
                <strong>Account Disclosures</strong>
                <br />
                <br />
                <span>Investment and Insurance Products are: </span>
                <ul>
                  <li>Not Insured by the MFIC (Martian Financial Institutions Commission) or Any Martian Government Agency</li>
                  <li>Not a Deposit or Other Obligation of, or Guaranteed by, the Bank</li>
                  <li>Any Bank Affiliate Subject to Investment Risks, Including Possible Loss of the Principal Amount Invested</li>
                </ul>
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
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Footer;

