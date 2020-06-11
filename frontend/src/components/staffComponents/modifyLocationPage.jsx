import React, { Component } from 'react'
import { Alert, Button, Form, Container, Col, Row } from 'react-bootstrap';
import LocationServiceApi from '../../api/LocationServiceApi';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { withRouter } from 'react-router-dom';
class modifyLocationPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            location: '',
            address: '',
            name: '',
            errMsg: '',
            gmapsLoaded: false,
            successMsg: '',
            disableSubmit: false
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
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

    componentDidMount() {
        window.initMap = this.initMap
        const gmapScriptEl = document.createElement(`script`)
        gmapScriptEl.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_API_KEY}&libraries=places&callback=initMap`
        document.querySelector(`body`).insertAdjacentElement(`beforeend`, gmapScriptEl)

        LocationServiceApi.getLocationFromId(this.props.match.params.id).then(res => {
            this.setState({
                address: res.data.address,
                name: res.data.name,
                location: res.data
            })
        }).catch(err => {
            this.setState({
                errMsg: err.response
            })
        })
    }

    handleSubmit() {
        if(this.state.name === '') {
            this.setState({
                errMsg: "name can't be empty"
            })
            return
        }

        this.setState({
            disableSubmit: true
        })

        let location = {
            _id: this.state.location._id,
            name: this.state.name,
            address: this.state.address,
            cars: this.state.location.cars
        }

        LocationServiceApi.updateLocation(location).then(res => {
            this.props.history.push(`/admin/view/location/${location._id}`, {success: "Successfully updated location"})
        }).catch(err => {
            this.setState({
                errMsg: err.response.data.message,
                disableSubmit: false,
                successMsg: ""
            })
        })
    }

    handleChange = event => {
        this.setState({[event.target.name] : event.target.value})
    }

    render() {
        return (
            <Container>
                <h2>Modify Location Details</h2>
                <strong>Location ID:</strong> {this.state.location._id} <br></br>
                
                {this.state.errMsg && 
                    <Alert variant="danger">
                        <Alert.Heading>Add car failed!</Alert.Heading>
                        <p>
                            {this.state.errMsg}
                        </p>
                    </Alert>
                }

                <Form>
                    <Form.Group as={Row} controlId="formHorizontalFirstName">
                        <Form.Label column sm={2}>
                            Name
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Control name="name" type="text" value={this.state.name} onChange={this.handleChange} required/>
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
                            <Button onClick={this.handleSubmit} disabled={this.state.disableSubmit}>Update Location</Button>
                        </Col>
                    </Form.Group>
                </Form>
            </Container>
        )
    }
}


export default withRouter(modifyLocationPage)