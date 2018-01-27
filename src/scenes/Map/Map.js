import React, { Component } from 'react';
import { fetchNearbyShops } from './api.Map';
import { Redirect } from 'react-router';
import { Button, Image, List, Segment } from 'semantic-ui-react';

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

  // {
  //   avail: [
  //     {
  //       location: '26.4920107,82.86391630000009',
  //       name: 'Krishna Medico',
  //     },
  //   ],
  //   medCode: 'v5df5',
  //   manufacturer: 'Alpha',
  //   name: 'Paracitamol',
  // },
  // {
  //   avail: [
  //     {
  //       location: '25.1688163,84.8910647',
  //       name: 'Krishna Medico',
  //     },
  //   ],
  //   medCode: 'v5dfd',
  //   manufacturer: 'Alpha',
  //   name: 'Paracitamol',
  // },
  // {
  //   avail: [
  //     {
  //       location: '26.1688163,85.8910647',
  //       name: 'Krishna Medico',
  //     },
  //   ],
  //   medCode: 'v5dS5',
  //   manufacturer: 'Alpha',
  //   name: 'Paracitamol',
  // },

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
        this.setState(prevState => ({
          ...prevState,
          shopMap: data,
        }));
      })
      .catch(error => {
        console.log(error);
      });
  };

  componentWillUnmount = () => {
    console.log('unmounting');
  };

  setMarkerOnMap = ({ shopLocation }) => () => {
    this.setState(prevState => ({
      ...prevState,
      markerArray: shopLocation.map(item => ({
        shopName: item.name,
        lat: item.location.split(',')[0],
        lng: item.location.split(',')[1],
      })),
    }));
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
          <Segment raised>
            <MedicineListWrapper>
              <List divided verticalAlign="middle">
                {this.state.shopMap.map((item, index) => (
                  <List.Item key={index}>
                    <List.Content floated="right">
                      <Button onClick={this.setMarkerOnMap({ shopLocation: item.avail })}>
                        Shops
                      </Button>
                    </List.Content>
                    <Image avatar src={ShopIcon} />
                    <List.Content>
                      <List.Header as="a">{item.name}</List.Header>
                      <List.Description>{item.manufacturer}</List.Description>
                      {item.mrp}
                    </List.Content>
                  </List.Item>
                ))}
              </List>
            </MedicineListWrapper>
            <ButtonWrapper />
          </Segment>
        </InformationContainer>
      </MapContainer>
    );
  }
}

export default Map;
