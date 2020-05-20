import React, { Component } from 'react';
import { Form, Col, Button, Row, Alert } from 'react-bootstrap';
import BookingServiceApi from '../api/BookingServiceApi';
import { CAR_COLOURS, CAR_BODY_TYPES, CAR_SEATS, CAR_FUEL_TYPES } from './../Constants.js'
import LocationServiceApi from '../api/LocationServiceApi';
class FilterCarsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pickupTime: '',
            returnTime: '',
            availableCars: [],
            make: '',
            seats: 'Any',
            fueltype: 'Any',
            colour: 'Any',
            location: 'Any',
            bodytype: 'Any',
            locations: [],
            errorMessage: ''
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange = event => {
        this.setState({[event.target.name] : event.target.value})
    }

    handleSubmit = event => {
        event.preventDefault();
        // filter available cars based on attributes specified
        let newFilter = {
            pickupTime: this.state.pickupTime,
            returnTime: this.state.returnTime,
            availableCars: this.state.availableCars,
            make: this.state.make,
            seats: this.state.seats,
            fueltype: this.state.fueltype,
            colour: this.state.colour,
            location: this.state.location,
            bodytype: this.state.bodytype
        }
        BookingServiceApi.filterCars(newFilter).then(res => {
            this.setState({
                availableCars: res.data.availableCars,
                errorMessage: ''
            });
        }).catch((error) => {
            this.setState({ errorMessage: error.response.data.message, availableCars: [] });
        })
    }

    componentDidMount() {
        const { availableCars, pickupTime, returnTime } = this.props;
        // if (availableCars.length == 0) {
        //     this.props.history.push('/dashboard');
        // }
        
        this.setState({ availableCars: availableCars, pickupTime: pickupTime, returnTime: returnTime });

        let locationArray = this.state.locations;
        LocationServiceApi.getAllLocations().then(res => {
            res.data.map(location => {
                let locationObject = {
                    id: location._id,
                    address: location.address
                }
                locationArray.push(locationObject);
                this.setState({ locations: locationArray });
            })
            console.log(locationArray);
        });
    }

    render() {

        return(
            <div className="container">
                <h2>Search for a car</h2>
                {this.state.errorMessage && <Alert variant="danger">
                    <Alert.Heading>Error checking availability!</Alert.Heading>
                    <p>
                        {this.state.errorMessage}
                    </p>
                </Alert>}
                <Form onSubmit={this.handleSubmit} id="filter_form" >
                    <Form.Group controlId="formHorizontalFirstName">
                        <Form.Label >
                            Make
                        </Form.Label>
                            <Form.Control name="make" type="text" placeholder="Make" onChange={this.handleChange} />
                    </Form.Group>

                <Form.Group controlId="exampleForm.ControlSelect2">
                    <Form.Label>Seats</Form.Label>
                    <Form.Control name="seats" as="select" onChange={this.handleChange}>
                    <option>Any</option>
                    {CAR_SEATS.map(carSeat => 
                    <>
                        <option>{carSeat}</option>
                    </>
                )}
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId="exampleForm.ControlSelect2">
                    <Form.Label>Fuel Type</Form.Label>
                    <Form.Control name="fueltype" as="select" onChange={this.handleChange}>
                    <option>Any</option>
                    {CAR_FUEL_TYPES.map(carFuel => 
                    <>
                        <option>{carFuel}</option>
                    </>
                )}
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId="exampleForm.ControlSelect2">
                    <Form.Label>Body Type</Form.Label>
                    <Form.Control name="bodytype" as="select" onChange={this.handleChange}>
                    <option>Any</option>
                    {CAR_BODY_TYPES.map(carBodyType => 
                    <>
                        <option>{carBodyType}</option>
                    </>
                )}
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId="exampleForm.ControlSelect2">
                    <Form.Label>Colour</Form.Label>
                    <Form.Control name="colour" as="select" onChange={this.handleChange}>
                    <option>Any</option>
                    {CAR_COLOURS.map(carColour => 
                    <>
                        <option>{carColour}</option>
                    </>
                )}
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId="exampleForm.ControlSelect2">
                    <Form.Label>Location</Form.Label>
                    <Form.Control name="location" as="select" onChange={this.handleChange}>
                    <option>Any</option>
                    {this.state.locations.map(location => 
                    <>
                        <option value={location.id}>{location.address}</option>
                    </>
                )}
                    </Form.Control>
                </Form.Group>

                <Form.Group as={Row}>
                    <Col >
                        <Button type="submit">Filter Cars</Button>
                    </Col>
                </Form.Group>
                </Form>

                <table>
                <thead>
                <tr>
                        <th>Make</th>
                        <th>Seats</th>
                        <th>Body Type</th>
                        <th>Colour</th>
                        <th>Cost per hour</th>
                        <th>Free KMs per hour</th>
                        <th>Extra Cost per KM</th>
                        <th>Fuel Type</th>
                        <th>Location</th>
                    </tr>
                </thead>
                <tbody>
                {this.state.availableCars.map(car => 
                    <tr>
                        <td>{car.make}</td>
                        <td>{car.seats}</td>
                        <td>{car.bodytype}</td>
                        <td>{car.colour}</td>
                        <td>${car.costperhour}</td>
                        <td>{car.freekmperhour}km</td>
                        <td>${car.extracostperkm}</td>
                        <td>{car.fueltype}</td>
                        <td>
                        {this.state.locations.map(location => 
                    <>
                        {location.id === car.location &&
                            <>
                                {location.address}
                            </>
                        }
                    </>
                )}
                        </td>
                    </tr>
                )}
                </tbody>
                </table>
            </div>
        )
    }
}

export default FilterCarsPage;