import React, { Component } from 'react';

import MapRenderer from './components/MapRenderer';
import { MapContainer } from './styles.Map.js';

const Map = () => (
  <div>
    <MapRenderer
      isMarkerShown={true}
      googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyBiNfMAYS471tn8hxoNkoaK-dZAfYyU1Gs&v=3.exp&libraries=geometry,drawing,places"
      loadingElement={<div style={{ height: `100%` }} />}
      containerElement={<div style={{ height: `100vh` }} />}
      mapElement={<div style={{ height: `100%` }} />}
    />
  </div>
);

export default Map;
