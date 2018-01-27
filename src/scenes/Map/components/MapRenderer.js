import React from 'react';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps';

const MapRenderer = withScriptjs(
  withGoogleMap(props => (
    <GoogleMap
      defaultZoom={15}
      defaultCenter={{ lat: props.userLocation.lat, lng: props.userLocation.lng }}
    >
      {props.isMarkerShown && (
        <Marker position={{ lat: props.userLocation.lat, lng: props.userLocation.lng }} />
      )}
    </GoogleMap>
  ))
);

export default MapRenderer;
