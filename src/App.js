import React, { Component } from 'react';
import { Route, Redirect, Switch, BrowserRouter as Router } from 'react-router-dom';

import Map from './scenes/Map';
import MedicinePicker from './scenes/MedicinePicker';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      medicineList: [],
      userLocation: {
        lat: undefined,
        lng: undefined,
      },
      radius: undefined,
    };
  }

  onRadiusUpdate = radius => {
    this.setState(prevState => ({
      ...prevState,
      radius: radius,
    }));
  };

  onUserLocationUpdate = ({ lat, lng }) => {
    this.setState(prevState => ({
      ...prevState,
      userLocation: {
        lat: lat,
        lng: lng,
      },
    }));
  };

  onMedicineAdd = ({ medicineName, mdCode, options }) => () => {
    console.log(options);
    this.setState(prevState => ({
      ...prevState,
      medicineList: [
        ...prevState.medicineList,
        {
          name: medicineName,
          mdCode: mdCode,
          packSize: options.packSize,
          pForm: options.pForm,
          manufacturer: options.manufacturer,
        },
      ],
    }));
  };

  onMedicineDelete = ({ mdCode }) => () => {
    this.setState(prevState => ({
      ...prevState,
      medicineList: prevState.medicineList.filter(item => item.mdCode !== mdCode),
    }));
  };

  onMedicineUpdate = ({ selectedMdCode, replaceMdCode, options, resetSubstituteList }) => () => {
    console.log(options);
    this.setState(prevState => ({
      ...prevState,
      medicineList: [
        ...prevState.medicineList.filter(item => item.mdCode !== selectedMdCode),
        {
          name: options.name,
          mdCode: options.truemdCode,
          packSize: options.size,
          pForm: options.pForm,
          manufacturer: options.manufacturer,
        },
      ],
    }));
    resetSubstituteList();
  };
  render() {
    return (
      <div>
        <Router>
          <Switch>
            <Route
              exact
              path="/medicinepicker"
              render={() => (
                <MedicinePicker
                  medicineList={this.state.medicineList}
                  onMedicineAdd={this.onMedicineAdd}
                  onMedicineDelete={this.onMedicineDelete}
                  onMedicineUpdate={this.onMedicineUpdate}
                  onUserLocationUpdate={this.onUserLocationUpdate}
                  onRadiusUpdate={this.onRadiusUpdate}
                />
              )}
            />
            <Route
              exact
              path="/map"
              render={() => (
                <Map
                  medicineList={this.state.medicineList}
                  userLocation={this.state.userLocation}
                  radius={this.state.radius}
                />
              )}
            />
            <Route render={() => <Redirect to="/medicinepicker" />} />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
