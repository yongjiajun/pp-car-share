import React, { Component } from 'react';
import { Jumbotron, Button } from 'react-bootstrap';
import UserServiceApi from '../api/UserServiceApi.js';
import LocationServiceApi from '../api/LocationServiceApi.js';
import MapContainer from './map';

class LocationShowPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            location: {},
            cars: []
        }
    }

    componentDidMount() {
        let location_array = this.state.locations;
        let url = this.props.match.url
        let location_id = url.split("/")[2]
        // Get location from id
        LocationServiceApi.getLocationFromId(location_id).then(res => {
            this.setState({
                location: res.data,
                cars: res.data.cars
            })
        })
      }

    render() {
        return (
            <>
                <Jumbotron>
                    <h2>Welcome to one of our locations</h2>
                    <Button href="/locations" variant="primary">Back to the map</Button>
                </Jumbotron>
                <h3>{this.state.location.name}</h3>
                <h3>Address: </h3>{this.state.location.address}
                <h3>Cars at this location:</h3>
                {this.state.cars.map(car => 
                    <p>car</p>
                )}
            </>
        )
    }
}

export default LocationShowPage;