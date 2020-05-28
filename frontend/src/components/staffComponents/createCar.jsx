import React, { Component } from 'react'

import LocationServiceApi from '../../api/LocationServiceApi';
import CarServiceApi from '../../api/CarServiceApi';
import { CAR_COLOURS, CAR_BODY_TYPES, CAR_FUEL_TYPES, CAR_SEATS } from '../../Constants.js';

import { Form, Col, Button, Row, Alert } from 'react-bootstrap';

export default class createCar extends Component {
    constructor(props){
        super(props)
        this.state = {
            make: '',
            seats: '',
            bodytype: '',
            numberplate: '',
            colour: '',
            costperhour: '',
            fueltype: '',
            location: '',
            locationList: [],
            disableSubmit: false,
            successMsg: '',
            errMsg: '',
        }
        
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    resetState = () => {
        this.setState({
            make: '',
            seats: '',
            bodytype: '',
            numberplate: '',
            colour: '',
            costperhour: '',
            fueltype: '',
            location: ''
        })
    }

    handleChange = (event) => {
        this.setState({[event.target.name] : event.target.value});
    }

    inputValidation = () => {
        const { make, seats, bodytype, numberplate, 
            colour, costperhour, fueltype, location} = this.state

        if(make == '' || seats == '' || bodytype == '' || numberplate == ''
            || colour == '' || costperhour == '' || fueltype == '' || location == '') {
                this.setState({
                    errMsg: "Please fill in everything"
                })
            }
    }

    handleSubmit = (event) => {
        event.preventDefault()
        this.setState({
            disableSubmit: true,
        })
        const newCar = {
            make: this.state.make,
            seats: this.state.seats,
            bodytype: this.state.bodytype,
            numberplate: this.state.numberplate,
            colour: this.state.colour,
            costperhour: this.state.costperhour,
            fueltype: this.state.fueltype,
            location: this.state.location
        }
        CarServiceApi.createNewCar(newCar).then((res) => {
            this.resetState();
            this.setState({
                disableSubmit: false,
                successMsg: "Successfully added car",
                errMsg: ""
            })
        }, (err) => {
            this.setState({
                disableSubmit: false,
                successMsg: "",
                errMsg: err.response.data.message
            })
            console.log(err.response.data.error)
        })
    }

    componentDidMount() {
        LocationServiceApi.getAllLocations().then((res) => {
            res.data.map(location => this.setState({locationList: this.state.locationList.concat(location.address)}))
        }, (err) => {
            console.err(err.response.data.message)
        })
    }

    render() {
        return (
            <div className="container">
                <h2>Create Car</h2>
                {this.state.errMsg && 
                    <Alert variant="danger">
                        <Alert.Heading>Add car failed!</Alert.Heading>
                        <p>
                            {this.state.errMsg}
                        </p>
                    </Alert>
                }

                {this.state.successMsg && 
                    <Alert variant="success">
                        <Alert.Heading>Add car succeed!</Alert.Heading>
                        <p>
                            {this.state.successMsg}
                        </p>
                    </Alert>
                }
                <Form>
                    <Form.Group as={Row} controlId="formHorizontalMake">
                        <Form.Label column sm={2}>
                            Make
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Control name="make" type="make" placeholder="Car Make" onChange={this.handleChange} />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formHorizontalSeats">
                        <Form.Label column sm={2}>
                            Seats
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Control as="select" name="seats" type="seats" onChange={this.handleChange}>
                                <option value="" disabled>Select seat number</option>
                                {
                                    CAR_SEATS.map((option, index) => 
                                                    <option key={index} value={option}>{option}</option>
                                                    )
                                }
                            </Form.Control>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formHorizontalBodyType">
                        <Form.Label column sm={2}>
                            Body type
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Control as="select" name="bodytype" type="bodytype" onChange={this.handleChange}>
                                <option value="" disabled>Select body type</option>
                                {
                                    CAR_BODY_TYPES.map((option, index) => 
                                                        <option key={index} value={option}>{option}</option>
                                                        )
                                }
                            </Form.Control>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formHorizontalNumberPlate">
                        <Form.Label column sm={2}>
                            Number Plate
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Control name="numberplate" type="numberplate" placeholder="Enter plate number" onChange={this.handleChange} />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formHorizontalColour">
                        <Form.Label column sm={2}>
                            Colour
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Control as="select" name="colour" type="colour" onChange={this.handleChange}>
                                <option value="" disabled>Select colour</option>
                                {
                                    CAR_COLOURS.map((option, index) => 
                                                    <option key={index} value={option}>{option}</option>
                                                    )
                                }
                            </Form.Control>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formHorizontalCostPerHour">
                        <Form.Label column sm={2}>
                            Cost per hour
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Control name="costperhour" type="costperhour" placeholder="Select cost per hour" onChange={this.handleChange} />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formHorizontalFuelType">
                        <Form.Label column sm={2}>
                            Fuel type
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Control as="select" name="fueltype" type="fueltype" onChange={this.handleChange}>
                                <option value="" disabled>Select fuel type</option>
                                {
                                    CAR_FUEL_TYPES.map((option, index) => 
                                                        <option key={index} value={option}>{option}</option>
                                                        )
                                }
                            </Form.Control>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formHorizontalLocation">
                        <Form.Label column sm={2}>
                            Location
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Control as="select" name="location" type="location" onChange={this.handleChange}>
                                <option value="" disabled>Select location</option>
                                {
                                    this.state.locationList.map((option, index) => 
                                                                <option key={index} value={option}>{option}</option>
                                                                )
                                }
                            </Form.Control>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Col sm={{ span: 10, offset: 2 }}>
                            <Button onClick={this.handleSubmit} disabled={this.state.disableSubmit}>Create Car</Button>
                        </Col>
                    </Form.Group>
                </Form>
            </div>
        )
    }
}
