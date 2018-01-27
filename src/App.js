import React, { Component } from 'react';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';

import Map from './scenes/Map';
import MedicinePicker from './scenes/MedicinePicker';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      medicineList: [
        {
          name: 'Para',
          mdCode: '12354',
          description: 'some data abc',
        },
        {
          name: 'Hara',
          mdCode: '79546',
          description: 'some other data too',
        },
        {
          name: 'Hara',
          mdCode: '79546',
          description: 'some other data too',
        },
        {
          name: 'Hara',
          mdCode: '79546',
          description: 'some other data too',
        },
      ],
      listOfMedicine: [],
      userLocation: {
        lat: undefined,
        lng: undefined,
      },
    };
  }

  onUserLocationUpdate = ({ lat, lng }) => () => {
    this.setState(prevState => ({
      ...prevState,
      userLocation: {
        lat: lat,
        lng: lng,
      },
    }));
  };

  onMedicineAdd = ({ medicineName, mdCode }) => () => {
    this.setState(prevState => ({
      ...prevState,
      medicineList: [
        ...prevState.medicineList,
        {
          medicineName: medicineName,
          mdCode: mdCode,
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

  onMedicineUpdate = ({ selectedMdCode, replaceMdCode, replaceMedicineName }) => {
    this.setState(prevState => ({
      ...prevState,
      medicineList: [
        ...prevState.medicineList.filter(item => item.mdCode !== selectedMdCode),
        { medicineName: replaceMedicineName, mdCode: replaceMdCode },
      ],
    }));
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
                />
              )}
            />
            <Route exact path="/map" render={() => <Map />} />
          </Switch>
        </Router>
      </div>
    );
  }
}


export default App;
