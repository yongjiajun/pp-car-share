import React, {Component} from 'react'

import { Container, Col, Row } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPiggyBank, faCar, faPhone, faMoneyBill } from '@fortawesome/free-solid-svg-icons'

import '../../styles/overview.css'

export default class Overview extends Component {
    render() {
        return (
            <section className="section-item">
                <div>
                    <h2>Overview</h2>
                    <Container fluid style={{marginTop: '3vh'}}>
                        <Row>
                            <Col>
                                <div className="how-it-works">
                                    <h3>Sign up</h3>
                                    <p>Simply Sign up for free and Log in to our application</p>
                                </div>
                            </Col>
                            <Col>
                                <div className="how-it-works">
                                    <h3>Book</h3>
                                    <p>Our application will show you the nearest cars and vans. Choose a date and time you want</p>
                                </div>
                            </Col>
                            <Col>
                                <div className="how-it-works">
                                    <h3>Unlock</h3>
                                    <p>Go up to the car on your time of choice and unlock the car.</p>
                                </div>
                            </Col>
                            <Col>
                                <div className="how-it-works">
                                    <h3>Drive</h3>
                                    <p>Enjoy driving your car</p>
                                </div>
                            </Col>
                        </Row>
                        <div className="benefits-div">
                            <h2>Benefits</h2>
                            <p>
                                MZA Car Share gives you access to cars and vans 24/7 without the hassle of owning one.
                                You can rent a car from just $13 an hour, with fuel, insurance and Roadside assistance included
                            </p>
                            <Row>
                                <Col>
                                    <div className="benefits-white-cards">
                                        <FontAwesomeIcon icon={faPiggyBank} size="3x"/>
                                        <h3>Signing Up is Free</h3>
                                        <p>Nothing to lose by joining. 100% Free!</p>
                                    </div>
                                </Col>
                                <Col>
                                    <div className="benefits-white-cards">
                                        <FontAwesomeIcon icon={faMoneyBill} size="3x"/>
                                        <h3>No Membership Fee</h3>
                                        <p>You only pay for the car's rent</p>
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <div className="benefits-white-cards">
                                        <FontAwesomeIcon icon={faCar} size="3x"/>
                                        <h3>Cheaper than owning a car</h3>
                                        <p>Much more ecomonic than buying and maintaing a car</p>
                                    </div>
                                </Col>
                                <Col>
                                    <div className="benefits-white-cards">
                                        <FontAwesomeIcon icon={faPhone} size="3x"/>
                                        <h3>Roadside Assistance</h3>
                                        <p>Easily get in touch with one of our assistance if you have any issues on the road</p>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                        <Row>
                        </Row>
                    </Container>
                    <div className="find-nearest-car-div">
                        <h2>Find your nearest MZA Car Share</h2>
                        <p>There are cars and vans spread all over Australia. There's probably one near you</p>
                        <div>
                            This div contains a map
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}