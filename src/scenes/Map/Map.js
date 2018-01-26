import React, { Component } from 'react';

import MapRenderer from './components/MapRenderer';
import { MapContainer } from './styles.Map.js';

const Map = () => (
  <MapContainer>
    <MapRenderer isMarkerShown={true} />
  </MapContainer>
);

export default Map;
