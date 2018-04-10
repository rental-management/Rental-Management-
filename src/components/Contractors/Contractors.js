import React, {Component} from 'react';
import AddContractorForm from '../AddContractorForm/AddContractorForm'
import {connect} from 'react-redux';
import NavBar from '../NavBar/NavBar';
import { getContractors, deleteContractor, editContractor } from '../../ducks/contractorsReducer';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';


class Contractors extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fName: '',
            lName: '',
            phone: '',
            email: '',
            street: '',
            city: '',
            state: '',
            zip: '',
            expanded: false
        }

        this.handleExpandChange = this.handleExpandChange.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    componentDidMount() {
        this.props.getContractors();
    }

    handleExpandChange = (expanded, fName, lName, phone, email, street, city, state, zip, index) => {
        let data = this.props.contractors.contractors[index];
        console.log(this.props.contractors.contractors[index]);
        console.log(data, "data");
        console.log(index, "index")
        this.setState({
            expanded: expanded,
            fName: data.f_name,
            lName: data.l_name,
            phone: data.phone,
            email: data.email,
            street: data.street,
            city: data.city,
            state: data.state,
            zip: data.zip
        })
    }

    handleDelete(conId){
        this.props.deleteContractor(conId)
        .then(() => {
            this.props.getContractors();
        })
    }

    handleContractorEdit(fName, lName, phone, email, street, city, state, zip, conId){
        console.log(conId)
        this.props.editContractor(fName, lName, phone, email, street, city, state, zip, conId).then((res) => {
            this.props.getContractors();
        })
    }

    render() {

        const {fName, lName, phone, email, street, city, state, zip} = this.state;
        console.log(this.state)
        
        const contractorsData = this.props.contractors.contractors;
        let contractorsList;
        if(contractorsData !== undefined && contractorsData.length !== 0) {
            contractorsList = [].concat(contractorsData)
            .map((curr, index) => {
                console.log(index," map index");
                return(
                    <div className="individual-contractor" key={index}>
                        <Card onClick={() => {this.handleExpandChange(this.state.expanded, curr.f_name, curr.l_name, curr.phone, curr.email, curr.street, curr.city, curr.state, curr.zip, index)}}>
                            <CardHeader
                                title={curr.company_name}
                                subtitle={curr.type + " - " + curr.prop_name}
                                actAsExpander={true}
                                showExpandableButton={true}
                            />
                            <CardText expandable={true}>

                              <span>First: </span>
                                <TextField 
                                defaultValue={curr.f_name} 
                                id="text-field-controlled" 
                                onChange={ (event) => {
                                this.setState({ fName: event.target.value }) 
                              }} />
            
                              <br />
            
                              <span>Last: </span>
                              <TextField 
                                defaultValue={curr.l_name}  
                                id="text-field-controlled"
                                onChange={ (event) => {
                                this.setState({ lName: event.target.value })
                              }} />

                              <br />

                              <span>Phone: </span>
                                <TextField 
                                defaultValue={curr.phone} 
                                id="text-field-controlled" 
                                onChange={ (event) => {
                                this.setState({ phone: event.target.value }) 
                              }} />

                              <br />

                              <span>Email: </span>
                                <TextField 
                                defaultValue={curr.email}  
                                id="text-field-controlled"
                                onChange={ (event) => {
                                this.setState({ email: event.target.value })
                              }} />

                              <br />

                              <span>Street: </span>
                                <TextField 
                                defaultValue={curr.street} 
                                id="text-field-controlled" 
                                onChange={ (event) => {
                                this.setState({ street: event.target.value }) 
                              }} />

                              <br />

                              <span>City: </span>
                                <TextField 
                                defaultValue={curr.city}  
                                id="text-field-controlled"
                                onChange={ (event) => {
                                this.setState({ city: event.target.value })
                              }} />

                              <br />

                              <span>State: </span>
                              <TextField 
                                defaultValue={curr.state} 
                                id="text-field-controlled" 
                                onChange={ (event) => {
                                this.setState({ state: event.target.value }) 
                              }} />

                              <br />

                              <span>Zip: </span>
                                <TextField 
                                defaultValue={curr.zip}  
                                id="text-field-controlled"
                                onChange={ (event) => {
                                this.setState({ zip: event.target.value })
                              }} />

                              <br />
                            <div className="buttons">
                            <CardActions>
                              <FlatButton label="Save" onClick={() => {this.handleContractorEdit(fName, lName, phone, email, street, city, state, zip, curr.id)}} />
                            </CardActions>
                            
                            <CardActions>
                            <FlatButton label="delete" onClick ={() =>
                              {this.handleDelete(curr.id)}} />
                            </CardActions>
                            </div>
                            </CardText>
                        </Card>
                    </div>
                )
            })
        }
        
        return(
            <div>
            <NavBar />
            <div className="contractors-header">
                <h1> My Contractors </h1>
                <AddContractorForm />
            </div>
            <span className="contractors-list">
            {contractorsList}
            </span>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        contractors: state.contractorsReducer
    }
};
export default connect(mapStateToProps, {getContractors, deleteContractor, editContractor})(Contractors);
