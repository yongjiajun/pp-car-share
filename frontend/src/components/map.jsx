import React from 'react';
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';
import LocationServiceApi from '../api/LocationServiceApi.js';
import "../styles/map.css"

export class MapContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      locations: [],
      activeMarker: {},
      showingInfoWindow: false,
      selectedPlace: {}
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
              id: element._id,
              address: element.address,
              name: element.name,
              lat: res.data.results[0].geometry.location.lat,
              lng: res.data.results[0].geometry.location.lng,
              cars: element.cars
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

  onMarkerClick = (props, marker) =>
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true,
    })

  onMapClick= () =>
    this.setState({
      showingInfoWindow: false,
      selectedPlace: {},
      activeMarker: {}
    })
  


  render() {
    return (
      <div style={{height: "100vh"}}>
        <Map google={this.props.google} 
            initialCenter={{
              lat:-37.815198,
              lng:144.957045
            }}
            zoom={14}
            onClick={this.onMapClick}>
          
          {this.state.locations.map(marker => {
            return (
              <Marker 
                id={marker.id}
                name={marker.name}
                address={marker.address}
                onClick= {this.onMarkerClick}
                position = {{lat: marker.lat, lng: marker.lng}}
              />)
          })}
  
          <InfoWindow 
            onClose={this.onInfoWindowClose}
            marker={this.state.activeMarker}
            visible={this.state.showingInfoWindow}>
              <div id="info-window">
                <h2>{this.state.selectedPlace.name}</h2>
                <p>{this.state.selectedPlace.address}</p>
                <a href={"/locations/" + this.state.selectedPlace.id}>Check out this location</a>
              </div>
          </InfoWindow>
        </Map>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: process.env.REACT_APP_API_KEY
})(MapContainer)