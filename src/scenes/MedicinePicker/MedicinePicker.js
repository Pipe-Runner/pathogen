import React, { Component } from 'react';
import {
  Dropdown,
  Button,
  Card,
  Table,
  Divider,
  Label,
  Segment,
  List,
  Image,
  Icon,
  Dimmer,
  Loader,
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import {
  MedicinePickerContainer,
  InputFieldWrapper,
  BucketContainer,
  CartWrapper,
  FooterContainer,
  SubstituteWrapper,
} from './styles.MedicinePicker.js';
import { fetchMedicineNameApi, fetchSubstituteListApi } from './api.MedicinePicker';
import MedicineIcon from '../../public/medicine_icon.svg';
import BackgroundIcon from '../../public/background_icon.svg';

const radiusOptions = [
  { key: 1, value: 5, text: '5 KM', mals: 'ksajksakj' },
  { key: 2, value: 10, text: '10 KM', mals: 'ksajksakj' },
  { key: 3, value: 15, text: '15 KM', mals: 'ksajksakj' },
  { key: 4, value: 20, text: '20 KM', mals: 'ksajksakj' },
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
      selectedMdCode: '',
      substituteListLoading: false,
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
      case 'searchRadiusFieldText':
        this.props.onRadiusUpdate(data.value);
        break;
    }

    this.setState(prevState => ({
      ...prevState,
      [`${fieldName}`]: data.value,
    }));
  };

  onFindSubstituteClick = ({ mdCode }) => () => {
    console.log(mdCode);
    this.setState({
      ...this.state,
      substituteListLoading: true,
    });
    fetchSubstituteListApi({
      mdCode: mdCode,
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
          substituteList: data.map(item => ({
            manufacturer: item.manufacturer,
            truemdCode: item.truemdId,
            mrp: item.mrp,
            name: item.name,
            pForm: item.pForm,
            size: item.size,
          })),
          substituteListLoading: false,
          selectedMdCode: mdCode,
        });
        console.log(data);
      })
      .catch(error => {
        console.log(error);
      });
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
        <Dimmer active={this.state.substituteListLoading} page>
          <Loader indeterminate>Fetching Similar Medicines</Loader>
        </Dimmer>
        <InputFieldWrapper>
          <div style={{ width: '50%', display: 'flex', flexDirection: 'row' }}>
            <Dropdown
              style={{
                margin: '0px 16px 0px 0px',
              }}
              placeholder="Select Medicine"
              search
              fluid
              selection
              options={this.state.medicineOptions}
              onChange={this.onChangeSelection('medicineFieldText')}
              onSearchChange={this.onChangeTextField('medicineFieldText')}
              value={this.state.medicineFieldText}
              loading={this.state.medicineOptionsLoading}
            />
            <Button.Group
              style={{
                margin: '0px 16px 0px 0px',
              }}
            >
              <Button onClick={this.onReset}>Reset</Button>
              <Button.Or text="" />
              <Button
                positive
                onClick={this.props.onMedicineAdd({
                  medicineName: this.state.medicineToAdd.name,
                  mdCode: this.state.medicineToAdd.truemdCode,
                  pForm: this.state.pForm,
                  options: this.state.medicineToAdd,
                })}
              >
                Add
              </Button>
            </Button.Group>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-end',
              width: '50%',
            }}
          >
            <Dropdown
              style={{
                margin: '0px 16px 0px 0px',
              }}
              placeholder="Select Location"
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
            <Link to="/map">
              <Button color="linkedin">
                <Icon name="connectdevelop" /> Find on map
              </Button>
            </Link>
          </div>
        </InputFieldWrapper>
        <Divider />
        <BucketContainer>
          <CartWrapper>
            <Card.Group>
              {medicineList.map((medicine, index) => (
                <Card key={index}>
                  <Card.Content>
                    <Label
                      as="a"
                      image
                      style={{
                        float: 'right',
                      }}
                    >
                      {medicine.pForm}
                    </Label>
                    <Card.Header>{medicine.name}</Card.Header>
                    <Card.Meta>Packet Size : {medicine.packSize}</Card.Meta>
                    <Card.Description>{medicine.manufacturer} </Card.Description>
                  </Card.Content>
                  <Card.Content extra>
                    <div className="ui two buttons">
                      <Button
                        basic
                        color="green"
                        onClick={this.onFindSubstituteClick({ mdCode: medicine.mdCode })}
                      >
                        Find Substitute
                      </Button>
                      <Button
                        basic
                        color="red"
                        onClick={this.props.onMedicineDelete({ mdCode: medicine.mdCode })}
                      >
                        Remove
                      </Button>
                    </div>
                  </Card.Content>
                </Card>
              ))}
            </Card.Group>
          </CartWrapper>
          {substituteList.length === 0 ? (
            undefined
          ) : (
            <SubstituteWrapper>
              <Segment raised>
                <Label
                  onClick={() => {
                    this.setState(prevState => ({
                      ...prevState,
                      findSubstitute: {},
                    }));
                  }}
                  as="a"
                  color="orange"
                  ribbon
                >
                  Cancel
                </Label>
                <span>Substitue</span>
              </Segment>
              <List divided verticalAlign="middle">
                {substituteList.map((item, index) => (
                  <List.Item key={index}>
                    <List.Content floated="right">
                      <Button
                        onClick={this.props.onMedicineUpdate({
                          selectedMdCode: this.state.selectedMdCode,
                          replaceMdCode: item.mdCode,
                          options: item,
                          resetSubstituteList: () => {
                            this.setState(prevState => ({ ...prevState, substituteList: [] }));
                          },
                        })}
                      >
                        Substitue
                      </Button>
                    </List.Content>
                    <Image avatar src={MedicineIcon} />
                    <List.Content>
                      <List.Header as="a">{item.name}</List.Header>
                      <List.Description>{item.manufacturer}</List.Description>
                      {item.mrp}
                    </List.Content>
                  </List.Item>
                ))}
              </List>
            </SubstituteWrapper>
          )}
        </BucketContainer>
      </MedicinePickerContainer>
    );
  }
}

export default MedicinePicker;
