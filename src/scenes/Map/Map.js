import React, { Component } from 'react';
import { fetchNearbyShops } from './api.Map';
import { Redirect } from 'react-router';
import { Button, Image, List } from 'semantic-ui-react';

import MapRenderer from './components/MapRenderer';
import {
  MapContainer,
  InformationContainer,
  MedicineListWrapper,
  ButtonWrapper,
} from './styles.Map.js';
import ShopIcon from '../../public/shop_icon.png';

class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      markerArray: [],
      wayPointArray: [],
      shopMap: [],
    };
  }

  componentWillMount = () => {
    fetchNearbyShops({
      radius: this.props.radius,
      lat: this.props.userLocation.lat,
      lon: this.props.userLocation.lng,
      meds: this.props.medicineList,
    })
      .then(response => {
        if (response.ok === true) {
          return response.json();
        }
        throw new Error('Error in network');
      })
      .then(data => {
        console.log(data);
        // this.setState(prevState => ({
        //   ...prevState,
        //   shopMap: data,
        // }));
      })
      .catch(error => {
        console.log(error);
      });
  };

  componentWillUnmount = () => {
    console.log('unmounting');
  };

  render() {
    console.log(this.props);
    return this.props.radius === undefined &&
      this.props.userLocation.lat === undefined &&
      this.props.userLocation.lng === undefined ? (
      <Redirect to="/medicinepicker" />
    ) : (
      <MapContainer>
        <MapRenderer
          isMarkerShown={true}
          googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyBiNfMAYS471tn8hxoNkoaK-dZAfYyU1Gs&v=3.exp&libraries=geometry,drawing,places"
          loadingElement={<MapContainer style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `100vh` }} />}
          mapElement={<div style={{ height: `100%` }} />}
          userLocation={this.props.userLocation}
          markerArray={this.state.markerArray}
          wayPointArray={this.state.wayPointArray}
        />
        <InformationContainer>
          <MedicineListWrapper>
            <List divided verticalAlign="middle">
              {this.state.shopMap.map((item, index) => (
                <List.Item key={index}>
                  <List.Content floated="right">
                    <Button>Shops</Button>
                  </List.Content>
                  <Image avatar src={ShopIcon} />
                  <List.Content>
                    <List.Header as="a">{item.name}</List.Header>
                    <List.Description>{item.options.manufacturer}</List.Description>
                    {item.options.mrp}
                  </List.Content>
                </List.Item>
              ))}
            </List>
          </MedicineListWrapper>
          <ButtonWrapper />
        </InformationContainer>
      </MapContainer>
    );
  }
}

export default Map;
