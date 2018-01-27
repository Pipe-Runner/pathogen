import React from 'react';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps';

const MapRenderer = withScriptjs(
  withGoogleMap(props => {
    console.log(props);
    return (
      <GoogleMap
        defaultZoom={16}
        defaultCenter={{ lat: props.userLocation.lat, lng: props.userLocation.lng }}
      >
        {props.userLocation && (
          <Marker position={{ lat: props.userLocation.lat, lng: props.userLocation.lng }} />
        )}
        {props.markerArray !== []
          ? props.markerArray.map((item, index) => {
              console.log(item);
              return (
                <Marker
                  key={index}
                  position={{ lat: parseFloat(item.lat), lng: parseFloat(item.lng) }}
                />
              );
            })
          : undefined}
      </GoogleMap>
    );
  })
);

export default MapRenderer;
