import React, {Component} from 'react';
import { connect } from 'react-redux';
import {getProperty, getWorkOrders, getExpensesById, getTenant, editTenant, addProperty, editExpenses } from '../../ducks/propertiesReducer';
import AddWorkOrderForm from '../AddWorkOrderForm/AddWorkOrderForm';
import NavBar from '../NavBar/NavBar';
import EditableLabel from 'react-inline-editing';
import ExpenseChart from './../Charts/ExpenseChart';
//MUI Imports
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';


 


class SingleProperty extends Component {
    constructor(props) {
        super(props);

        this.state = {
          fName: '',
          lName: '',
          phone: '',
          email: '',
          emergContact: '',
          emergNum: 0,
          propValue: 0,
          downPayment: 0,
          mortgage: 0,
          dues: 0,
          taxes: 0,
          insurance: 0,
          utilities: 0,
          isEditable: false
        }
        
        this.handleTenantEdit = this.handleTenantEdit.bind(this);
        this.handleExpensesEdit = this.handleExpensesEdit.bind(this);
    }

    

    componentDidMount() {    
      const { id } = this.props.match.params;          
        this.props.getProperty(id).then(res => {
            this.props.getWorkOrders(id);
            this.props.getExpensesById(id);
            this.props.getTenant(id);
        }).then(res => {
          let data = this.props.properties.property[0];          
          this.setState({
            fName: data.t_f_name,
            lName: data.t_l_name,
            phone: data.t_phone,
            email: data.t_email,
            emergContact: data.emerg_contact_name,
            emergNum: data.emerg_contact_phone
          })

        })


    }

    handleTenantEdit(fName, lName, phone, email, emergContact, emergNum, propId) {
      this.props.editTenant(fName, lName, phone, email, emergContact, emergNum, propId).then( (res) => {
        this.props.getTenant(propId);
        this.setState({isEditable: false})
      });
    }

    handleExpensesEdit(propValue, downPayment, mortgage, dues, taxes, insurance, utilities, propId) {
      this.props.editExpenses(propValue, downPayment, mortgage, dues, taxes, insurance, utilities, propId).then( (res) => {
        this.props.getExpensesById(propId);
        this.setState({isEditable: false})
      });
    }


    render() { 
        // destructuring state 
        const {fName, lName, phone, email, emergContact, emergNum, propValue, downPayment, mortgage, dues, taxes, insurance, utilities} = this.state;
      
        //declaring list variables
        let property;
        let propertyData = this.props.properties.property;    
        let workOrdersList;
        let expensesList;   
        let tenant;
        if (propertyData !== undefined && propertyData.length !== 0) {
          const propId = this.props.match.params.id;
          property = propertyData.map((curr, index) => {
            return <div key={index} id = "prop-container">
         
                <h1>{curr.prop_name}</h1>

                <span>Street: {curr.street}</span>
                <br />
                <span>City: {curr.city}</span>
                <br />
                <span>State: {curr.state}</span>
                <br />
                <span>Zipcode: {curr.zip}</span>
         
              </div>;
          });
          tenant = this.props.properties.tenant.map((curr, index) => {            
                    
            return <div key={index} id = 'tenant-container'>  
                  <span>First: </span>
                  <TextField defaultValue={curr.t_f_name} className="text-field-controlled" onChange={event => {
                      this.setState({ fName: event.target.value, isEditable: true });
                    }} />

                  <br />

                  <span>Last: </span>
                  <TextField defaultValue={curr.t_l_name} className="text-field-controlled" onChange={event => {
                      this.setState({
                        lName: event.target.value,
                        isEditable: true
                      });
                    }} />

                  <br />

                  <span>Phone: </span>
                  <TextField defaultValue={curr.t_phone} className="text-field-controlled" onChange={event => {
                      this.setState({
                        phone: event.target.value,
                        isEditable: true
                      });
                    }} />

                  <br />

                  <span>Email: </span>
                  <TextField defaultValue={curr.t_email} className="text-field-controlled" onChange={event => {
                      this.setState({
                        email: event.target.value,
                        isEditable: true
                      });
                    }} />

                  <br />

                  <span>Emergency Contact: </span>
                  <TextField defaultValue={curr.emerg_contact_name} className="text-field-controlled" onChange={event => {
                      this.setState({
                        emergContact: event.target.value,
                        isEditable: true
                      });
                    }} />

                  <br />

                  <span>Emergency Contact #: </span>
                  <TextField defaultValue={curr.emerg_contact_phone} className="text-field-controlled" onChange={event => {
                      this.setState({
                        emergNum: event.target.value,
                        isEditable: true
                      });
                    }} />

                  <br />             
                {this.state.isEditable ? 
                <RaisedButton label="Save" onClick={() => {
                    this.handleTenantEdit(fName, lName, phone, email, emergContact, emergNum, propId);
                  }} id = "tenant-btn"/>: null}
                <br />
                
              </div>;
          });

          //maps over work orders which are then rendered in the return
          workOrdersList = this.props.properties.workOrders.map(
            (curr, index) => {
              return (
                <div key={index} id = 'wo-container'>
                  <span>Repair type: {curr.type}</span>
                  <br />
                  <span>Memo: {curr.memo}</span>
                  <br />
                </div>
              );
            }
          );

          //maps over expenses which are then rendered in the return
          expensesList = this.props.properties.singlePropExpenses.map(
            (curr, index) => {
              return (
                <div key={index}>
                  <span> Assessed Property Value: </span> 
                  <TextField 
                    defaultValue={curr.assessed_value} 
                    className="text-field-controlled" 
                    hintText="0"
                    onChange={ (event) =>{
                     
                      this.setState({ propValue: event.target.value, isEditable: true })
                    }} />

                  <br />

                  <span>Down Payment: </span> 
                  <TextField  
                    defaultValue={curr.down_payment} 
                    className="text-field-controlled"
                    hintText="0"
                    onChange={ (event) => {
                    
                      this.setState({
                        downPayment: event.target.value,
                        isEditable: true
                      });
                    }} />

                  <br />

                  <span>Monthly Mortgage: </span> 
                  <TextField 
                    defaultValue={curr.monthly_mortgage} 
                    className="text-field-controlled"
                    hintText="0"
                    onChange={(event) => {
                     
                      this.setState({
                        mortgage: event.target.value,
                        isEditable: true
                      });
                    }} />
                  <br />
                  <span>Monthly Dues: </span> 
                  <TextField 
                    defaultValue={curr.monthly_dues} 
                    className="text-field-controlled"
                    hintText="0"
                    onChange={(event) => {
                    
                      this.setState({
                        dues: event.target.value,
                        isEditable: true
                      });
                    }} />

                  <br />

                  <span>Monthly Taxes: </span> 
                  <TextField 
                    defaultValue={curr.monthly_taxes} 
                    className="text-field-controlled"
                    hintText="0"
                    onChange={(event) => {
                      
                      this.setState({
                        taxes: event.target.value,
                        isEditable: true
                      });
                    }} />
                  <br />
                  <span> Monthly Insurance: </span> 
                  <TextField 
                    defaultValue={curr.monthly_insurance}
                    className="text-field-controlled"
                    hintText="0"
                    onChange={(event) => {
                     
                      this.setState({
                        insurance: event.target.value,
                        isEditable: true
                      });
                    }} />
                  <br />
                  <span> Monthly Utilities:  </span> 
                  <TextField 
                    defaultValue={curr.monthly_utilities} 
                    className="text-field-controlled"
                    hintText="0"
                    onChange={(event) => {
                      
                      this.setState({
                        utilities: event.target.value,
                        isEditable: true
                      });
                    }} />
                  <br />
                  {this.state.isEditable ? <RaisedButton label="save" onClick={() => {this.handleExpensesEdit(propValue, downPayment, mortgage, dues, taxes, insurance, utilities, propId)}} />: null}
                  <br />

                  
                </div>
              );
            }
          );
        }
        
        return(
            <div> 
            <NavBar />
            {property}
            <h2>Current Tenant</h2>
            {tenant}
            <AddWorkOrderForm />
            <h2>Open Work Orders</h2>
            {workOrdersList}
            <h2>Expenses for this Property:</h2>
            {expensesList}  
                 <ExpenseChart />  
            </div>
            
        )
    }
}


const mapStateToProps = state => {
    return {
        properties: state.propertiesReducer
    }
};

export default connect(mapStateToProps, {getProperty, getWorkOrders, getExpensesById, getTenant, editTenant, editExpenses})(SingleProperty);