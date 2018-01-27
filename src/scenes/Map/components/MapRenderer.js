import React from 'react';
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  DirectionsRenderer,
} from 'react-google-maps';

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
                  options={{
                    icon:
                      'http://res.cloudinary.com/dpxbd37qm/image/upload/v1517077345/pharmacy_jnttko.svg',
                  }}
                  position={{ lat: parseFloat(item.lat), lng: parseFloat(item.lng) }}
                />
              );
            })
          : undefined}
        {!props.directions ? <DirectionsRenderer directions={props.directions} /> : undefined}
      </GoogleMap>
    );
  })
);

export default MapRenderer;
