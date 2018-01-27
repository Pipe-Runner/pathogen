import React, { Component } from 'react';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';

import Map from './scenes/Map';
import MedicinePicker from './scenes/MedicinePicker';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      medicineList: [],
      listOfMedicine: [],
      userLocation: {
        lat: undefined,
        lng: undefined,
      },
    };
  }

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

  onMedicineUpdate = ({ selectedMdCode, replaceMdCode, replaceMedicineName}) => {
    this.setState(prevState => ({
      ...prevState,
      medicineList: [
        ...prevState.medicineList.filter(item => item.mdCode !== selectedMdCode),
        { medicineName: replaceMedicineName, mdCode: replaceMdCode},
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
