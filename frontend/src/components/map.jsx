import React from 'react';
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';
import LocationServiceApi from '../api/LocationServiceApi.js';

export class MapContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addresses: []
    }

  }

  componentDidMount() {
    let address_array = this.state.addresses;
    // Get all locations from backend and set react state addresses
    LocationServiceApi.getAllLocations().then(res => {
      const data = res.data;
      data.forEach(element => {
        address_array.push(element.address)
      });
    })
    
  }

  render() {
    return (
      <Map google={this.props.google} zoom={14}>

        <InfoWindow onClose={this.onInfoWindowClose}>
          <div>
            <h1>sup</h1>
          </div>
        </InfoWindow>
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyAOY2AsSVlCkUCdKBi8a-1YicW4hZ87lDU"
})(MapContainer)