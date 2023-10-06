/**
 * Copyright (c) 2023 Cisco Systems, Inc. and its affiliates All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { divIcon } from "leaflet";
import { useDispatch } from "react-redux";
import {
  useGetAtmsMutation,
  useGetParticularATMMutation,
} from "../slices/atmsApiSlice";
import { setAtms } from "../slices/atmSlice";
import {
  Container,
  Form,
  Button,
  Card,
  Row,
  Col,
  Badge,
} from "react-bootstrap";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import "leaflet/dist/leaflet.css";
import "../index.css";
import mapIcon from "../assets/coin-side.png";
import mapImg from "../assets/atm.png";

const AtmScreen = () => {
  const [location, setLocation] = useState("");
  const [finalLocation, setFinalLocation] = useState("");
  const [atmsList, setAtmsList] = useState([]);
  const [isOpenNow, setIsOpenNow] = useState(false);
  const [isInterPlanetary, setIsInterPlanetary] = useState(false);

  const dispatch = useDispatch();

  const [getAtmsList, { isLoading }] = useGetAtmsMutation();
  const [getParticularATM, { isLoading1 }] = useGetParticularATMMutation();

  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedCardInfo, setSelectedCardInfo] = useState(null);

  const handleCardClick = async (atm) => {
    if (selectedCard === atm) {
      setSelectedCard(null);
      setSelectedCardInfo(null);
    } else {
      const res = await getParticularATM(atm._id).unwrap();
      setSelectedCard(atm);
      setSelectedCardInfo(res);
    }
  };

  const handleSubmit = async (e) => {
    setFinalLocation(location);

    try {
      e.preventDefault();
    } catch (err) {
      console.log(err);
    }

    if (location === "") {
      return;
    }

    try {
      console.log("here");
      console.log({ location, isOpenNow, isInterPlanetary });
      const res = await getAtmsList({
        location,
        isOpenNow,
        isInterPlanetary,
      }).unwrap();
      console.log(res);
      dispatch(setAtms(res));
      setAtmsList(res);
      toast.success("Found ATMs near you!", {
        className: "toast-container-custom",
        autoClose: 500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
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
  };

  useEffect(() => {
    handleSubmit();
  }, [isOpenNow, isInterPlanetary]);

  // Create a custom Leaflet divIcon
  const customIcon = divIcon({
    className: "custom-icon",
    iconSize: [45, 45],
    iconAnchor: [22.5, 45],
    popupAnchor: [0, -45],
    html: `<div style="color: #da1616;"><FontAwesomeIcon icon={faLocationDot} /></div>`,
  });

  return (
    <Container className="mt-5 mb-5">
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Row>
            <Col md={6}>
              <Form.Control
                type="text"
                placeholder="Enter enter a ZIP code, or an address, city, and state."
                className="py-3 px-2"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </Col>
            <Col md={2}>
              <Button
                variant="dark"
                type="submit"
                className="w-100 me-3 px-5 py-2"
              >
                <span style={{ fontSize: "2.5vh" }}>Search</span>
              </Button>
            </Col>
            <Col md={2} />
          </Row>
          <Row>
            <Col md={7} className="mt-2">
              {/* Radio button for "Open Now" */}
              <Form.Check
                type="radio"
                label="Open Now"
                className="py-2 px-5"
                name="optionGroup"
                checked={isOpenNow}
                onChange={() => {
                  setIsOpenNow(true);
                  setIsInterPlanetary(false); // Deselect the other radio button
                }}
              />
              {/* Radio button for "Inter planet ATMs" */}
              <Form.Check
                type="radio"
                label="Inter planet ATMs"
                className="py-1 px-5"
                name="optionGroup"
                checked={isInterPlanetary}
                onChange={() => {
                  setIsInterPlanetary(true);
                  setIsOpenNow(false); // Deselect the other radio button
                }}
              />
            </Col>
            <Col md={2} />
          </Row>
        </Form.Group>
      </Form>

      {atmsList && atmsList.length > 0 ? (
        <div className="mt-2">
          <h5 className="mb-4">Showing results for {finalLocation}:</h5>
          <Row>
            <Col md={6}>
              <div className="card-container">
                {atmsList.map((atm, index) => (
                  <Card
                    key={index}
                    className={`mb-4 ${selectedCard === atm ? "selected" : ""}`}
                    onClick={() => handleCardClick(atm)}
                  >
                    <Badge
                      bg={atm.isOpen ? "success" : "danger"}
                      style={{
                        position: "absolute",
                        top: "1rem",
                        right: "1rem",
                        fontSize: "15px",
                      }}
                    >
                      {atm.isOpen ? "Open" : "Closed"}
                    </Badge>
                    <div className="flex-grow-1">
                      <Card.Body style={{ marginTop: "0" }}>
                        <Card.Title
                          style={{ fontSize: "2.5vh", marginTop: "0" }}
                        >
                          <span style={{ marginRight: "7px" }}>
                            <img
                              src="./src/assets/coin-front.png"
                              alt="logo"
                              width="45"
                              height="45"
                            />
                          </span>
                          <span>{atm.name}</span>
                          {selectedCard === atm ? (
                            <FontAwesomeIcon
                              style={{ marginLeft: "20px" }}
                              icon={faAngleUp}
                            />
                          ) : (
                            <FontAwesomeIcon
                              style={{ marginLeft: "20px" }}
                              icon={faAngleDown}
                            />
                          )}
                        </Card.Title>
                        <Card.Text
                          style={{ fontSize: "1.5vh", marginLeft: "52px" }}
                        >
                          {atm.address.street +
                            ", " +
                            atm.address.city +
                            ", " +
                            atm.address.state +
                            ", " +
                            atm.address.zip}
                        </Card.Text>
                      </Card.Body>
                      {selectedCard === atm && (
                        <Card.Footer style={{ fontSize: "1.5vh" }}>
                          <Row>
                            <Col md={6}>
                              <div>
                                <strong>Number of ATMs: </strong>{" "}
                                {selectedCardInfo.numberOfATMs}
                              </div>
                              <div>
                                <strong>Accessibility: </strong>
                                {selectedCardInfo.atmHours}
                              </div>
                            </Col>
                            <Col md={6}>
                              <div>
                                <strong>Timings:</strong>
                              </div>
                              <div>
                                Mon-Fri: {selectedCardInfo.timings.monFri}
                              </div>
                              <div>
                                Sat-Sun: {selectedCardInfo.timings.satSun}
                              </div>
                              <div>
                                Holidays: {selectedCardInfo.timings.holidays}
                              </div>
                            </Col>
                          </Row>
                        </Card.Footer>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </Col>
            {isInterPlanetary ? (
              <Col md={6}>
                <div className="map-container">
                  <img
                    src={mapImg}
                    // src="https://via.placeholder.com/400x400"
                    alt="Map"
                    className="rounded"
                    style={{ height: "57vh", width: "67vh" }}
                  />
                </div>
              </Col>
            ) : (
              <Col md={6}>
                <div className="map-container">
                  <MapContainer
                    center={[37.77175, -81.1901]}
                    zoom={15}
                    scrollWheelZoom={false}
                    className="rounded"
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    {atmsList.map((atm, index) => (
                      <Marker
                        key={index}
                        position={[
                          atm.coordinates.latitude,
                          atm.coordinates.longitude,
                        ]}
                        icon={L.icon({
                          iconUrl: mapIcon,
                          // iconUrl: "https://via.placeholder.com/45x45",
                          iconSize: [45, 45],
                          iconAnchor: [22.5, 45],
                          popupAnchor: [0, -45],
                        })}
                      >
                        <Popup keepInView autoPan>
                          {atm.name}
                        </Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                </div>
              </Col>
            )}
          </Row>
        </div>
      ) : null}
    </Container>
  );
};

export default AtmScreen;
