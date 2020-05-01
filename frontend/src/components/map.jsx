import React from 'react';
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';
import LocationServiceApi from '../api/LocationServiceApi.js';

export class MapContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      locations: []
    }
  }

  componentDidMount() {
    let location_array = this.state.locations;
    // Get all locations from backend
    LocationServiceApi.getAllLocations().then(res => {
      const data = res.data;
      // Iterate through each address and get latitude and longitude
      data.forEach(element => {
        LocationServiceApi.getGeocodeFromAddress(element.address)
          .then(res => {
            // Create object with address, latitude and longitude
            let object = {
              address: element.address,
              lat: res.data.results[0].geometry.location.lat,
              lng: res.data.results[0].geometry.location.lng
            }
            // Push address, lat, long as object to react state array
            location_array.push(object);
            this.setState({
              locations: location_array
            })
          }); 
      });
    });
    
  }

  render() {
    return (
      <Map google={this.props.google} 
           initialCenter={{
             lat:-37.815198,
             lng:144.957045
           }}
           zoom={14}>
        
        {this.state.locations.map(marker => {
          return (
            <Marker name={'Current'}
                    position = {{lat: marker.lat, lng: marker.lng}}
            />)
        })}
 
        <InfoWindow onClose={this.onInfoWindowClose}>
            <div>
            </div>
        </InfoWindow>
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyCw4AB0ysQbI33KWKGEuLCuORtcgoFT8U4"
})(MapContainer)