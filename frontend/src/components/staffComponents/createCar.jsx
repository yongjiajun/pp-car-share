/* Create car page */
import React, { Component } from 'react';
import LocationServiceApi from '../../api/LocationServiceApi';
import CarServiceApi from '../../api/CarServiceApi';
import { CAR_COLOURS, CAR_BODY_TYPES, CAR_FUEL_TYPES, CAR_SEATS, FILE_UPLOAD_LIMIT } from '../../Constants.js';
import { Form, Col, Button, Row, Alert } from 'react-bootstrap';

export default class createCar extends Component {
    constructor(props) {
        super(props);
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
            b64photo: ''
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleFile = this.handleFile.bind(this);
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
            location: '',
            b64photo: ''
        });
    }

    handleFile = (event) => {
        // handle image uploaded for car
        let files = event.target.files;
        if (files !== null) {
            // file size validation
            if (event.target.files[0].size > FILE_UPLOAD_LIMIT) {
                return this.setState({
                    errMsg: 'Image exceeded upload size limit! Please try again with another image.'
                });
            }
            let reader = new FileReader();
            reader.readAsDataURL(files[0]);
            reader.onload = (event) => {
                this.setState({
                    b64photo: event.target.result,
                    errMsg: ''
                });
            }
        }
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }

    inputValidation = () => {
        const { make, seats, bodytype, numberplate,
            colour, costperhour, fueltype, location, b64photo } = this.state;

        if (make === '' || seats === '' || bodytype === '' || numberplate === ''
            || colour === '' || costperhour === '' || fueltype === '' || location === '' || b64photo === '') {
            this.setState({
                errMsg: "Please fill in everything"
            });
            return false;
        }
        else {
            this.setState({
                errMsg: ""
            })
            return true;
        }
    }

    handleSubmit = (event) => {
        event.preventDefault();
        if (!this.inputValidation()) {
            return;
        }
        this.setState({
            disableSubmit: true
        })
        // generate a new car object
        const newCar = {
            make: this.state.make.trim(),
            seats: this.state.seats,
            bodytype: this.state.bodytype,
            numberplate: this.state.numberplate.trim(),
            colour: this.state.colour,
            costperhour: this.state.costperhour,
            fueltype: this.state.fueltype,
            location: this.state.location,
            b64photo: this.state.b64photo
        };
        // publish car object to backend
        CarServiceApi.createNewCar(newCar).then((res) => {
            this.setState({
                disableSubmit: false,
                successMsg: "Successfully added car",
                errMsg: ""
            });
        }, (err) => {
            this.setState({
                disableSubmit: false,
                successMsg: "",
                errMsg: err.response.data.message
            });
            console.log(err.response);
        })
    }

    componentDidMount() {
        LocationServiceApi.getAllLocations().then((res) => {
            res.data.map(location => this.setState({ locationList: this.state.locationList.concat(location.address) }));
        }, (err) => {
            console.log(err.response);
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
                            <Form.Control name="make" type="make" placeholder="Car Make" onChange={this.handleChange} required />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formHorizontalSeats">
                        <Form.Label column sm={2}>
                            Seats
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Control as="select" name="seats" type="seats" onChange={this.handleChange} required>
                                <option disabled selected>Select seat number</option>
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
                            <Form.Control as="select" name="bodytype" type="bodytype" onChange={this.handleChange} required>
                                <option disabled selected>Select body type</option>
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
                            <Form.Control name="numberplate" type="numberplate" placeholder="Enter plate number" onChange={this.handleChange} required />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formHorizontalColour">
                        <Form.Label column sm={2}>
                            Colour
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Control as="select" name="colour" type="colour" onChange={this.handleChange} required>
                                <option disabled selected>Select colour</option>
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
                            <Form.Control name="costperhour" type="number" placeholder="Select cost per hour" onChange={this.handleChange} required />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formHorizontalFuelType">
                        <Form.Label column sm={2}>
                            Fuel type
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Control as="select" name="fueltype" type="fueltype" onChange={this.handleChange} required>
                                <option disabled selected>Select fuel type</option>
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
                            <Form.Control as="select" name="location" type="location" onChange={this.handleChange} required>
                                <option disabled selected>Select location</option>l
                                {
                                    this.state.locationList.map((option, index) =>
                                        <option key={index} value={option}>{option}</option>
                                    )
                                }
                            </Form.Control>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formHorizontalLocation">
                        <Form.Label column sm={2}>
                        </Form.Label>
                        <Col sm={10}>
                            <Form.File
                                id="custom-file"
                                label="Car Image (4MB max)"
                                name="b64photo"
                                accept="image/*"
                                onChange={this.handleFile}
                            />
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
