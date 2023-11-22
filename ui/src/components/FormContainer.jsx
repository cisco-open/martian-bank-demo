/**
 * Copyright (c) 2023 Cisco Systems, Inc. and its affiliates All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import { Container, Row, Col } from "react-bootstrap";
import "../styles/FormContainer.css"; // assuming you have a CSS file for styles

const FormContainer = ({ children, position }) => {
  return (
    <Container>
      {position === "left" ? (
        <Row className="justify-content-md bg-light form-row">
          <Col md={5} className="form-col">
            {children}
          </Col>

          <Col md={6} className="rounded p-5">
            <Row>
              <Col md={12} className="p-5">
                <h1 className="text-center">$100 bonus on us!</h1>
                <p className="text-center">
                  Open an eligible account with qualifying electronic deposits and get $100 bonus.
                </p>
              </Col>
            </Row>
            <Row>
              <Col md={12} className="p-5">
                <img
                  src="./src/assets/card.png"
                  alt="card"
                  className="img-fluid"
                />
              </Col>
            </Row>
          </Col>
        </Row>
      ) : (
        <Row className="justify-content-md-center mt-5">
          <Col md={6} className="card p-5">
            {children}
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default FormContainer;

