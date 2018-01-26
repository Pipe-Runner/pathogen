import React, { Component } from 'react';
import { Dropdown,Button,Card } from 'semantic-ui-react'
import { InputFieldWrapper } from './styles.MedicinePicker.js';

const medicineOptions = [{key:'aklakl',value: 'kjasjlajl',text:'jhdhkskhds'},{key:'aklakl',value: 'kjasjlajl',text:'jhdhkskhds'},{key:'aklakl',value: 'kjasjlajl',text:'jhdhkskhds'}]


class MedicinePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
  	const medicineList = this.props.medicineList;

    return <div><InputFieldWrapper><Dropdown style={{
    	margin: '0px 16px 0px 0px'
    }} placeholder='Select Medicine' fluid search selection options={medicineOptions} />
    <Button.Group>
    <Button>un</Button>
    <Button.Or text='ou' />
    <Button positive>deux</Button>
  </Button.Group></InputFieldWrapper>
  <Card.Group>
  {medicineList.map((medicine) =>
      <Card>
        <Card.Content>
          <Card.Header>
            {medicine.name}
          </Card.Header>
          <Card.Meta>
            {medicine.name}
          </Card.Meta>
          <Card.Description>
  			{medicine.description}   
       </Card.Description>
        </Card.Content>
        <Card.Content extra>
          <div className='ui two buttons'>
            <Button basic color='green'>Approve</Button>
            <Button basic color='red'>Decline</Button>
          </div>
        </Card.Content>
      </Card>)}
  </Card.Group>
  </div>;
  }
}

export default MedicinePicker;
