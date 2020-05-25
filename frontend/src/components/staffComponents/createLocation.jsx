import React, { Component } from 'react'
import LocationServiceApi from '../../api/LocationServiceApi'
import { Form, Col, Button, Row, Alert } from 'react-bootstrap';

import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';

export default class CreateLocation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            address: '',
            errMsg: '',
            gmapsLoaded: false,
            disableSubmit: false,
        }

        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleAutocomplete = this.handleAutocomplete.bind(this)
    }

    initMap = () => {
        this.setState({
          gmapsLoaded: true,
        })
    }

    handleAutocomplete = address => {
        this.setState({ address });
    }

    handleChange = event => {
        this.setState({[event.target.name] : event.target.value});
    }

    handleSubmit = event => {
        const { name, address } = this.state;
        event.preventDefault()

        this.setState({
            successMsg: "",
            errMsg: "",
            disableSubmit: true
        })

        if( name == '' || address == '') {
            this.setState({
                errMsg: "name and address cannot be empty",
                disableSubmit: false
            });
        } else {
            let newLoc = {
                name: name,
                address: address
            }
            LocationServiceApi.createNewLocation(newLoc).then(res => {
                console.log(res.data)
                this.setState({
                    successMsg: "Location successfully added",
                    disableSubmit: false,
                    name: '',
                    address: ''
                });
            }, error => {
                this.setState({
                    errMsg: error.response.data.message,
                    disableSubmit: false
                });
            });
        }
    }

    componentDidMount() {
        window.initMap = this.initMap
        const gmapScriptEl = document.createElement(`script`)
        gmapScriptEl.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_API_KEY}&libraries=places&callback=initMap`
        document.querySelector(`body`).insertAdjacentElement(`beforeend`, gmapScriptEl)
    }

    render() {
        return (
            <div className="container">
                <h2>Create Location</h2>
                {this.state.errMsg && 
                    <Alert variant="danger">
                        <Alert.Heading>Add location failed!</Alert.Heading>
                        <p>
                            {this.state.errMsg}
                        </p>
                    </Alert>
                }

                {this.state.successMsg && 
                    <Alert variant="success">
                        <Alert.Heading>Add location succeed!</Alert.Heading>
                        <p>
                            {this.state.successMsg}
                        </p>
                    </Alert>
                }
                <Form>
                    <Form.Group as={Row} controlId="formHorizontalName">
                        <Form.Label column sm={2}>
                            First Name
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Control name="name" type="name" placeholder="Location Name" onChange={this.handleChange} />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formHorizontalName">
                        <Form.Label column sm={2}>
                            Enter Address
                        </Form.Label>
                        <Col sm={10}>
                        { this.state.gmapsLoaded &&
                            <PlacesAutocomplete
                                value={this.state.address}
                                onChange={this.handleAutocomplete}
                                onSelect={this.handleSelect}
                            >
                                {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                                <div>
                                    <Form.Control
                                    {...getInputProps({
                                        placeholder: 'Search Places ...',
                                        className: 'location-search-input',
                                        required: true
                                    })}
                                    />
                                    <div className="autocomplete-dropdown-container">
                                    {loading && <div>Loading...</div>}
                                    {suggestions.map(suggestion => {
                                        const className = suggestion.active
                                        ? 'suggestion-item--active'
                                        : 'suggestion-item';
                                        // inline style for demonstration purpose
                                        const style = suggestion.active
                                        ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                                        : { backgroundColor: '#ffffff', cursor: 'pointer' };
                                        return (
                                        <div
                                            {...getSuggestionItemProps(suggestion, {
                                            className,
                                            style,
                                            })}
                                        >
                                            <span>{suggestion.description}</span>
                                        </div>
                                        );
                                    })}
                                    </div>
                                </div>
                                )}
                            </PlacesAutocomplete>
                        }
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Col sm={{ span: 10, offset: 2 }}>
                            <Button onClick={this.handleSubmit} disabled={this.state.disableSubmit}>Create Location</Button>
                        </Col>
                    </Form.Group>
                </Form>
            </div>
        )
    }
}
