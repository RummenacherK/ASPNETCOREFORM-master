import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Button, FormGroup, Form, Col, ControlLabel, FormControl, Panel, Grid, Row, Table } from 'react-bootstrap';
import serializeForm from 'form-serialize';
import update from 'react-addons-update';

import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalClose,
  ModalBody,
  ModalFooter
} from 'react-modal-bootstrap';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      tableData: [],
      editState: false,
      editRecord: [],
      falseRecord: [],
      isOpen: false
    };

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._loadServiceAPIData = this._loadServiceAPIData.bind(this);
    this._load = this._loadServiceAPIData.bind(this);
    this._deleteItem = this._deleteItem.bind(this);
    this._editItem = this._editItem.bind(this);
    // this._editMode = this._editMode.bind(this);
    this._handleChange = this._handleChange.bind(this);
    this.openModal = this.openModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
  }

  openModal() {
    this.setState({
      isOpen: true
    });
  };

  hideModal() {
    this.setState({
      isOpen: false
    });
  };

  componentDidMount() {
    this._loadServiceAPIData();
  }

  _loadServiceAPIData() {

    var self = this;
    fetch('/api/values')
      .then(function (response) {
        return response.json();
      }).then(function (responseData) {
        console.log("LoadServiceAPI: " + responseData);
        self.setState({ tableData: responseData });
      });
  }

  _handleFormSubmit(event) {
    event.preventDefault();

    self = this;
    let formData = serializeForm(event.target, { hash: true });
    console.log("HandleFormSubmit: " + JSON.stringify(formData));



    fetch('/api/values', {
      method: 'post',
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Accept": "application/json",
      },
      mode: 'cors',
      body: JSON.stringify(formData)
    }).then(function (res) {
      console.log(res);
      self._loadServiceAPIData(); //Reload the data
      console.log("End of Fetch: " + JSON.stringify(res))
      self.setState({ editState: false, isOpen: false });
    });

  }

  _deleteItem(event) {
    event.preventDefault();

    var self = this;

    var deleteId = event.target.value;

    fetch('/api/values/' + deleteId, {
      method: 'DELETE',
      mode: 'cors'
    }).then(function (response) {
      self._loadServiceAPIData();
    });
  }

  _editItem(event) {
    event.preventDefault();

    self = this;
    const recordId = event.target.value;

    console.log("EDIT RECORD ID: " + recordId);

    fetch('/api/values/' + recordId, {
      method: 'GET',
      mode: 'cors'
    }).then(function (response) {
      return response.json();
    }).then(function (responseData) {
      console.log('Got data for editItem');
      //console.log("RESPONSE: " + JSON.stringify(responseData));
      //self.setState({ edit: true, editRecord: responseData });
      //self.setState({ editState: true});
      self.setState({ editState: true, editRecord: responseData, isOpen: true });
    });
  }

  // let formData = serializeForm(event.target, { hash: true });

  // fetch('/api/values', {
  //   method: 'post',
  //   headers: {
  //     "Content-Type": "application/json",
  //     "Access-Control-Allow-Origin": "*",
  //     "Accept": "application/json",
  //   },
  //   mode: 'cors',
  //   body: JSON.stringify(formData)
  // }).then(function (res) {
  //   self._loadServiceAPIData(); //Reload the data
  //   console.log("End of Fetch: " + JSON.stringify(res))
  // });

  // self.setState({
  //   edit: false
  // });


  // _editMode(event) {
  //   event.preventDefault();

  //   var value = event.target.value;
  //   alert('Edit Record ' + value);

  //   // var self = this;

  //   // self.setState({
  //   //   edit: true
  //   // });
  // }

  _handleChange(event) {

    self = this;

    // const change = [];

    // change[event.target.name] = event.target.value;
    const elementName = event.target.name;
    const elementValue = event.target.value;

    console.log(elementName + " : " + elementValue);

    self.setState({
      falseRecord: [],
      // editRecord: update(self.state.editRecord, { 0: { elementName: { $set: elementValue } } })
      editRecord: update(self.state.editRecord, { 1: { elementName: { $set: elementValue } } })
      // editRecord: change
      // tableData: self.state.editRecord
    });
  }

  render() {

    // const rows;
    // var formInstance;
    // const tableInstance;
    // const dtSource;
    // const output;
    // self = this;

    var output = (<div></div>);
    const dtSource = this.state.tableData;
    const dtRecordData = this.state.editRecord;
    var editForm = (<div></div>);

    self = this;

    if (self.state.editState) {
      //write input fields for edit form here
      Object.keys(dtRecordData).map(function (key) {
        editForm =
          (
            <div>
              

                <FormGroup controlId="formHorizontalItemName">
                  <Col componentClass={ControlLabel} sm={2}>
                    ID:
      </Col>
                  <Col sm={10}>
                    <FormControl type="text" value={dtRecordData[key]["formControlId"]} name="formControlId" />
                  </Col>
                </FormGroup>


                <FormGroup controlId="formHorizontalItemName">
                  <Col componentClass={ControlLabel} sm={2}>
                    Name
      </Col>
                  <Col sm={10}>
                    <FormControl type="text" value={dtRecordData[key]["name"]} name="name" onChange={self._handleChange} />
                  </Col>
                </FormGroup>

                <FormGroup controlId="formHorizontalQuantity">
                  <Col componentClass={ControlLabel} sm={2}>
                    Quantity
          </Col>
                  <Col sm={10}>
                    <FormControl type="number" value={dtRecordData[key]["quantity"]} name="quantity" onChange={self._handleChange} />
                  </Col>
                </FormGroup>

                <FormGroup controlId="formHorizontalQuantity">
                  <Col componentClass={ControlLabel} sm={2}>
                    Description
          </Col>
                  <Col sm={10}>
                    <FormControl type="text" value={dtRecordData[key]["description"]} name="description" componentClass="textarea" onChange={self._handleChange} />
                  </Col>
                </FormGroup>

                <FormGroup controlId="formHorizontalQuantity">
                  <Col componentClass={ControlLabel} sm={2}>
                    Price
          </Col>
                  <Col sm={10}>
                    <FormControl type="number" value={dtRecordData[key]["price"]} name="price" onChange={self._handleChange} />
                  </Col>
                </FormGroup>
             
            </div>

          )
      });

      //Assign the EditForm inside the modal
      output = (
      <div className='layout-page'>
        <main className='layout-main'>
          <div className='container'>
            


            <Modal isOpen={this.state.isOpen} size='modal-lg' onRequestHide={this.hideModal}>
              <Form horizontal onSubmit={self._handleFormSubmit}>
                <ModalHeader>
                  <ModalClose onClick={this.hideModal} />
                  <ModalTitle>Modal title</ModalTitle>
                </ModalHeader>
                <ModalBody>
                  <span>
                    {editForm}
                  </span>        
                </ModalBody>
                <ModalFooter>
                  <button className='btn btn-default' onClick={this.hideModal}>
                    Close
                  </button>
                  <button className='btn btn-primary'>
                    Save changes
                  </button>
                </ModalFooter>
              </Form>
            </Modal>
          </div>
        </main>
      </div>);

    } else {

      const dtSource = this.state.tableData;
      console.log("Render: " + dtSource);

      const self = this;

      const rows =
        Object.keys(dtSource).map(function (key) {
          return (<tr>
            <td>{key}</td>
            <td>{dtSource[key]["name"]}</td>
            <td>{dtSource[key]["quantity"]}</td>
            <td>{dtSource[key]["description"]}</td>
            <td>{dtSource[key]["price"]}</td>
            <td>
              <button type="submit" value={dtSource[key]["formControlId"]} onClick={self._deleteItem}>Delete</button>
              <button type="submit" value={dtSource[key]["formControlId"]} onClick={self._editItem}>Edit</button>
            </td>
          </tr>);
        });



      const formInstance = (

        <Form horizontal onSubmit={this._handleFormSubmit}>

          <FormGroup controlId="formHorizontalItemName">
            <Col componentClass={ControlLabel} sm={2}>
              Name
      </Col>
            <Col sm={10}>
              <FormControl type="text" name="name" placeholder="Name" />
            </Col>
          </FormGroup>

          <FormGroup controlId="formHorizontalQuantity">
            <Col componentClass={ControlLabel} sm={2}>
              Quantity
          </Col>
            <Col sm={10}>
              <FormControl type="number" name="quantity" placeholder="Quantity" />
            </Col>
          </FormGroup>

          <FormGroup controlId="formHorizontalQuantity">
            <Col componentClass={ControlLabel} sm={2}>
              Description
          </Col>
            <Col sm={10}>
              <FormControl type="text" name="description" componentClass="textarea" placeholder="Description" />
            </Col>
          </FormGroup>

          <FormGroup controlId="formHorizontalQuantity">
            <Col componentClass={ControlLabel} sm={2}>
              Price
          </Col>
            <Col sm={10}>
              <FormControl type="number" name="price" placeholder="Price" />
            </Col>
          </FormGroup>


          <FormGroup>
            <Col smOffset={7} sm={8}>
              <Button type="submit">
                Add
        </Button>
            </Col>
          </FormGroup>

        </Form>

      );

      const tableInstance = (
        <Table striped bordered condensed hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Quantity</th>
              <th>Description</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </Table>
      );

      output = (
        <div className="App">
          <Grid>
            <Row className="show-grid">
              <Col xs={6} md={2}></Col>
              <Col xs={6} md={8}>
                <Panel>
                  {formInstance}
                </Panel>
              </Col>
            </Row>
          </Grid>
          {tableInstance}
        </div>
      );
    }
    /*return (<div>
      {output}
    </div>);*/

    /*<Modal isOpen={self.state.isOpen} onRequestHide={self.hideModal}>
      <ModalHeader>
        <ModalClose onClick={self.hideModal} />
        <ModalTitle>Modal title</ModalTitle>
      </ModalHeader>
      <ModalBody>
        <span>
          {output}
        </span>
      </ModalBody>
      <ModalFooter>
        <button className='btn btn-default' onClick={self.hideModal}>
          Close
    </button>
        <button className='btn btn-primary'>
          Save changes
    </button>
      </ModalFooter>
    </Modal>*/
    let subModalDialogStyles = {
      base: {
        bottom: -600,
        transition: 'bottom 0.4s'
      },
      open: {
        bottom: 0
      }
    };
    return (
      <div>
        {output}
      </div>
    );
  }
}

export default App;
