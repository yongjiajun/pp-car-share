import React, { Component } from 'react';
import { Jumbotron, Button } from 'react-bootstrap';
import UserServiceApi from '../api/UserServiceApi.js';
import LocationServiceApi from '../api/LocationServiceApi.js';

class LocationShowPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            location: {}
        }
    }

    componentDidMount() {
        let location_array = this.state.locations;
        let url = this.props.match.url
        let location_id = url.split("/")[2]
        // Get location from id
        LocationServiceApi.getLocationFromId(location_id).then(res => {
            this.setState({
                location: res.data
            })
        })
      }

    render() {
        return (
            <Jumbotron>
                <h2>{this.state.location.address}</h2>
                <p>
                    <Button href="/locations" variant="primary">Back to the map</Button>
                </p>
            </Jumbotron>
        )
    }
}

export default LocationShowPage;