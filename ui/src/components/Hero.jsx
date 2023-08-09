/**
 * Copyright (c) 2023 Cisco Systems, Inc. and its affiliates All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import { Container, Card, Button, Col, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LinkContainer } from "react-router-bootstrap";
import {
  faMoneyBillWave,
  faShieldAlt,
  faRocket,
} from "@fortawesome/free-solid-svg-icons";

const Hero = () => {
  return (
    <div className="py-5">
      <Container className="d-flex justify-content-center">
        <Card className="p-5 d-flex flex-column align-items-center hero-card w-75">
          <h1 className="text-center mb-4">
            <span style={{ fontSize: "4vh", fontWeight: "bold" }}>
              Welcome to Martian Bank
            </span>
          </h1>
          <p style={{ fontSize: "2vh", textAlign: "center" }}>
            Secure your Martian finances with Red Planet Bank - your trusted
            financial partner on the Red Planet. Explore our innovative banking
            solutions, enjoy top-notch security measures, and fuel your Martian
            ventures with our competitive loans and investment opportunities.
          </p>
          <div className="d-flex mt-4 mb-4">
            <LinkContainer to="/login">
              <Button variant="dark" className="me-5 px-5 py-2">
                <span style={{ fontSize: "2vh" }}>Login</span>
              </Button>
            </LinkContainer>
            <LinkContainer to="/register">
              <Button variant="dark" className="me-5 px-5 py-2">
                <span style={{ fontSize: "2vh" }}>Signup</span>
              </Button>
            </LinkContainer>
          </div>
          <div className="d-flex justify-content-around mt-5">
            <Row>
              <Col md={4}>
                <Card className="text-center border-0">
                  <FontAwesomeIcon
                    icon={faMoneyBillWave}
                    className="display-3 my-3"
                  />
                  <Card.Body>
                    <Card.Title>Flexible Banking Solutions</Card.Title>
                    <Card.Text>
                      Enjoy a wide range of banking products and services
                      tailored to your Martian needs.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="text-center border-0">
                  <FontAwesomeIcon
                    icon={faShieldAlt}
                    className="display-3 my-3"
                  />
                  <Card.Body>
                    <Card.Title>Top-Notch Security</Card.Title>
                    <Card.Text>
                      Rest easy knowing that your Martian assets are protected
                      with us.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="text-center border-0">
                  <FontAwesomeIcon icon={faRocket} className="display-3 my-3" />
                  <Card.Body>
                    <Card.Title>Martian Ventures</Card.Title>
                    <Card.Text>
                      Fuel your Martian dreams with our competitive loans and
                      investment opportunities.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </div>
        </Card>
      </Container>
    </div>
  );
};

export default Hero;
