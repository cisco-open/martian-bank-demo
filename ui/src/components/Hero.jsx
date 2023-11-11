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
    // <div className="py-5">
      <Container className="d-flex justify-content-center " style={{width: window.innerWidth >= 768 ?"75%":"100%"}}>
        <Card className=" d-flex flex-column align-items-center hero-card w-100"style={{ padding: window.innerWidth >= 768 ? '3rem' : '0.5rem',}}>
          <h1 className="text-center mb-4">
            <span style={{ fontSize: "4vh", fontWeight: "bold" }}>
              Welcome to Martian Bank
            </span>
          </h1>
          <p style={{ fontSize: "2vh", textAlign: window.innerWidth >= 768 ?"center":"justify",padding:window.innerWidth >= 768 ?"none":"1.5rem" }}>
            Secure your Martian finances with Red Planet Bank - your trusted
            financial partner on the Red Planet. Explore our innovative banking
            solutions, enjoy top-notch security measures, and fuel your Martian
            ventures with our competitive loans and investment opportunities.
          </p>
          
            <Row>
              <Col md={6} xs={12}>
              <div className="d-flex mt-4 mb-4" style={{justifyContent:"center"}}>
            <LinkContainer to="/login">
            <Button variant="dark" className=" px-5 py-2" style={{marginBlockEnd:window.innerWidth >= 768 ?"5rem":"0rem"}}>
                <span style={{ fontSize: "2vh" }}>Login</span>
              </Button>
            </LinkContainer>
            </div>
            </Col>
            <Col md={6} xs={12}>
            <div className="d-flex mt-4 mb-4" style={{justifyContent:"center"}}>
            <LinkContainer to="/register">
              <Button variant="dark" className=" px-5 py-2" style={{marginBlockEnd:window.innerWidth >= 768 ?"5rem":"0rem"}}>
                <span style={{ fontSize: "2vh" }}>Signup</span>
              </Button>
            </LinkContainer>
            </div>
            </Col>
            </Row>
            <Row>
              <Col md={4} xs={12}>
              <div className="d-flex justify-content-around mt-5">
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
                </div>
              </Col>
              <Col md={4} xs={12}>
              <div className="d-flex justify-content-around mt-5">
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
                </div>
              </Col>
              <Col md={4} xs={12}>
              <div className="d-flex justify-content-around mt-5">
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
                </div>
              </Col>
            </Row>
        </Card>
      </Container>
    // </div>
  );
};

export default Hero;
