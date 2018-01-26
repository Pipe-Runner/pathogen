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
    };
  }

  onMedicineAdd = ({ medicineName, mdCode }) => {
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

  onMedicineDelete = ({ mdCode }) => {
    this.setState(prevState => ({
      ...prevState,
      medicineList: prevState.medicineList.filter(item => item.mdCode != mdCode),
    }));
  };

  onMedicineUpdate = ({ selectedMdCode, replaceMdCode, replaceMedicineName }) => {
    this.setState(prevState => ({
      ...prevState,
      medicineList: [
        ...prevState.medicineList.filter(item => item.mdCode != selectedMdCode),
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
                  medicineList={this.medicineList}
                  onMedicineAdd={this.onMedicineAdd}
                  onMedicineDelete={this.onMedicineDelete}
                  onMedicineUpdate={this.onMedicineUpdate}
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
