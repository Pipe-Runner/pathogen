import React, { Component } from 'react';
import { Dropdown, Button, Card, Table } from 'semantic-ui-react';
// import { InputFieldWrapper } from './styles.MedicinePicker.js';
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
    };
  }

  onChangeSelection = fieldName => (event, { value }) => {
    console.log(value);
    this.setState(prevState => ({
      ...prevState,
      [`${fieldName}`]: value,
    }));
  };

  onChangeTextField = fieldName => (event, { searchQuery }) => {
    console.log(searchQuery);

    if (fieldName === 'medicineFieldText') {
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
            })),
          });
          console.log(data);
        })
        .catch(error => {
          console.log(error);
        });
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
                medicineName: 'Hg',
                mdCode: 123,
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
                    <Card.Meta>{medicine.name}</Card.Meta>
                    <Card.Description>{medicine.description}</Card.Description>
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
