import React, { Component } from 'react';
import { Dropdown,Button } from 'semantic-ui-react'

const medicineOptions = [{key:'aklakl',value: 'kjasjlajl',text:'jhdhkskhds'},{key:'aklakl',value: 'kjasjlajl',text:'jhdhkskhds'},{key:'aklakl',value: 'kjasjlajl',text:'jhdhkskhds'}]

class MedicinePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return <div><Dropdown placeholder='Select Medicine' fluid search selection options={medicineOptions} />
    <Button.Group>
    <Button>un</Button>
    <Button.Or text='ou' />
    <Button positive>deux</Button>
  </Button.Group></div>;
  }
}

export default MedicinePicker;
