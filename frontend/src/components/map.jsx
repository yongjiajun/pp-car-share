import React from 'react';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
 
export class MapContainer extends React.Component {
    render() {
        return (
          <Map google={this.props.google} zoom={14}>
     
            <Marker onClick={this.onMarkerClick}
                    name={'Current location'} />
     
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