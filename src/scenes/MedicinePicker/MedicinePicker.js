import React, { Component } from 'react';
import { Dropdown, Button, Card, Table } from 'semantic-ui-react';
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import {
  MedicinePickerContainer,
  InputFieldWrapper,
  BucketContainer,
  CartWrapper,
  SubstituteWrapper,
} from './styles.MedicinePicker.js';
import { fetchMedicineNameApi } from './api.MedicinePicker';

const radiusOptions = [
  { key: 1, value: 5, text: '5 KM' },
  { key: 2, value: 10, text: '10 KM' },
  { key: 3, value: 15, text: '15 KM' },
  { key: 4, value: 20, text: '20 KM' },
];

class MedicinePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      medicineFieldText: '',
      locationFieldText: '',
      searchRadiusFieldText: '',
      substituteList: [],
      medicineOptions: [],
      locationOptions: [],
      medicineOptionsLoading: false,
      medicineToAdd: {},
    };
  }

  onChangeSelection = fieldName => (event, data) => {
    console.log(data);
    switch (fieldName) {
      case 'medicineFieldText':
        this.setState(prevState => ({
          ...prevState,
          medicineToAdd: data.options.filter(item => item.value === data.value)[0].options,
        }));
        break;
      case 'locationFieldText':
        getLatLng(
          data.options.filter(item => item.value === data.value)[0].options
        ).then(({ lat, lng }) => {
          this.props.onUserLocationUpdate({
            lat: lat,
            lng: lng,
          });
        });
        break;
    }

    this.setState(prevState => ({
      ...prevState,
      [`${fieldName}`]: data.value,
    }));
  };

  onChangeTextField = fieldName => (event, { searchQuery }) => {
    switch (fieldName) {
      case 'medicineFieldText':
        this.setState({
          ...this.state,
          medicineOptionsLoading: true,
        });

        // api call to server
        fetchMedicineNameApi({
          search: searchQuery,
        })
          .then(response => {
            if (response.ok === true) {
              return response.json();
            }
            throw new Error('Error in network');
          })
          .then(data => {
            this.setState({
              ...this.state,
              medicineOptionsLoading: false,
              medicineOptions: data.suggestions.map(item => ({
                key: item.truemdCode,
                text: item.name,
                value: item.name,
                options: item,
              })),
            });
            console.log(data);
          })
          .catch(error => {
            console.log(error);
          });
        break;
      case 'locationFieldText':
        // api call for location
        geocodeByAddress(searchQuery).then(results => {
          console.log(results);
          this.setState(prevState => ({
            ...prevState,
            locationOptions: results.map(item => ({
              key: item.place_id,
              text: item.formatted_address,
              value: item.formatted_address,
              options: item,
            })),
          }));
        });
        break;
      default:
        break;
    }

    this.setState(prevState => ({
      ...prevState,
      [`${fieldName}`]: searchQuery,
    }));
  };

  onReset = () => {
    this.setState(prevState => ({
      ...prevState,
      medicineFieldText: '',
      locationFieldText: '',
      searchRadiusFieldText: '',
    }));
  };

  render() {
    const substituteList = this.state.substituteList;

    const medicineList = this.props.medicineList;

    return (
      <MedicinePickerContainer>
        <InputFieldWrapper>
          <Dropdown
            style={{
              margin: '0px 16px 0px 0px',
            }}
            placeholder="Select Medicine"
            fluid
            search
            selection
            options={this.state.medicineOptions}
            onChange={this.onChangeSelection('medicineFieldText')}
            onSearchChange={this.onChangeTextField('medicineFieldText')}
            value={this.state.medicineFieldText}
            loading={this.state.medicineOptionsLoading}
          />
          <Dropdown
            style={{
              margin: '0px 16px 0px 0px',
            }}
            placeholder="Select Location"
            fluid
            search
            selection
            options={this.state.locationOptions}
            onChange={this.onChangeSelection('locationFieldText')}
            onSearchChange={this.onChangeTextField('locationFieldText')}
            value={this.state.locationFieldText}
          />
          <Dropdown
            style={{
              margin: '0px 16px 0px 0px',
            }}
            placeholder="Select search radius"
            selection
            options={radiusOptions}
            onChange={this.onChangeSelection('searchRadiusFieldText')}
            value={this.state.searchRadiusFieldText}
          />
          <Button.Group>
            <Button onClick={this.onReset}>Reset</Button>
            <Button.Or text="" />
            <Button
              positive
              onClick={this.props.onMedicineAdd({
                medicineName: this.state.medicineToAdd.name,
                mdCode: this.state.medicineToAdd.truemdCode,
                options: this.state.medicineToAdd,
              })}
            >
              Add
            </Button>
          </Button.Group>
        </InputFieldWrapper>
        <BucketContainer>
          <CartWrapper>
            <Card.Group>
              {medicineList.map((medicine, index) => (
                <Card key={index}>
                  <Card.Content>
                    <Card.Header>{medicine.name}</Card.Header>
                    <Card.Meta>Packet Size : {medicine.packSize}</Card.Meta>
                    <Card.Description>{medicine.manufacturer} </Card.Description>
                  </Card.Content>
                  <Card.Content extra>
                    <div className="ui two buttons">
                      <Button basic color="green">
                        Find Substitute
                      </Button>
                      <Button basic color="red">
                        Remove
                      </Button>
                    </div>
                  </Card.Content>
                </Card>
              ))}
            </Card.Group>
          </CartWrapper>
          <SubstituteWrapper>
            <Table celled>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Name</Table.HeaderCell>
                  <Table.HeaderCell>Status</Table.HeaderCell>
                  <Table.HeaderCell>Notes</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {substituteList.map(substitute => (
                  <Table.Row>
                    <Table.Cell>{substitute.name}</Table.Cell>
                    <Table.Cell>{substitute.mdId}</Table.Cell>
                    <Table.Cell selectable>
                      <a href="#">Edit</a>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </SubstituteWrapper>
        </BucketContainer>
      </MedicinePickerContainer>
    );
  }
}

export default MedicinePicker;
