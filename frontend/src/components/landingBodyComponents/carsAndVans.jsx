import React, {Component} from 'react'

import { Container, Row, Col } from 'react-bootstrap'

import '../../styles/carsAndVans.css'

export default class CarsAndVans extends Component {

    render () {
        return (
            <section className="section-item">
                <div>
                    <h2>Cars and Vans</h2>
                    <Container fluid>
                        <Row>
                            <CarDescriptionComponent name="Lightning McQueen" header="Popular with kids" description="Good guy, Easy to talk to" imgSrc="https://i.ebayimg.com/images/g/itQAAOSw~RNZn01p/s-l300.jpg"/>
                            <CarDescriptionComponent name="Lightning McQueen" header="Popular with kids" description="Good guy, Easy to talk to" imgSrc="https://i.ebayimg.com/images/g/itQAAOSw~RNZn01p/s-l300.jpg"/>
                            <CarDescriptionComponent name="Lightning McQueen" header="Popular with kids" description="Good guy, Easy to talk to" imgSrc="https://i.ebayimg.com/images/g/itQAAOSw~RNZn01p/s-l300.jpg"/>
                            <CarDescriptionComponent name="Lightning McQueen" header="Popular with kids" description="Good guy, Easy to talk to" imgSrc="https://i.ebayimg.com/images/g/itQAAOSw~RNZn01p/s-l300.jpg"/>
                        </Row>
                    </Container>
                </div>
                <div className="find-nearest-car-div">
                    <h2>Find your nearest MZA Car Share</h2>
                    <p>There are cars and vans spread all over Australia. There's probably one near you</p>
                    <div>
                        This div contains a map
                    </div>
                </div>
            </section>
        );
    }
}

function CarDescriptionComponent(props) {
    const { name, header, description, imgSrc } = props
    return (
        <Col sm={4}>
            <div className="cars-div-white">
                <img src={imgSrc} alt="car" />
                <h3 style={{marginTop: '3vh'}}>{name}</h3>
                <h5>{header}</h5>
                <p>{description}</p>
            </div>
        </Col>
    );
}