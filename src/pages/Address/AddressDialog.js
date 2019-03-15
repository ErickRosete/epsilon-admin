import React, { Component } from "react";
import Button from "@material-ui/core/Button";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import withMobileDialog from '@material-ui/core/withMobileDialog';
// import SuccessAnimation from "./successAnimation";
import TextField from "@material-ui/core/TextField";
import { withApollo } from "react-apollo";
import {ADD_ADDRESS,ADD_ADDRESS_TO_USER} from "./constants"
// import NumberFormat from 'react-number-format';



export class FormDialog extends Component {
  
  constructor(props) {
    super(props);
    this.state={
      street:"",
      exteriorNumber:"",
      city:"",
      country:"",
      zipCode:""
    }
  }

  updateUserAddress=(id)=>{
    console.log(`Updating user with address: ${id}`)
    console.log(`usuario a asignar el id ${this.props.id}`)
    let json={
      userId:this.props.id,
      addressId:id
    }
    console.log("runningMutation")
    console.log(json)
    console.log(json.userId)

    return this.props.client.mutate({
      mutation: ADD_ADDRESS_TO_USER ,
      variables: {userId:json.userId,
        addressId:json.addressId
      }
    }).then((data)=>{
      console.log(data)
      console.log(data.data.addAddress._id)
      return data.data.addAddress._id
    })
    .catch((err)=>{
      console.log(err)
      if(err.graphQLErrors.length>0)
        console.log(`error: ${err.graphQLErrors[0].message}`)
    })
  }

  createAddress = () => {
    let json=this.state
      console.log("runningMutation")
      console.log(json)
    json.zipCode=Number(json.zipCode)
    json.exteriorNumber=Number(json.exteriorNumber)

    return this.props.client.mutate({
      mutation: ADD_ADDRESS ,
      variables: {...json}
    }).then((data)=>{
      console.log(data.data.createAddress._id)
      return data.data.createAddress._id
    })
    .catch((err)=>{
      console.log(err)
      if(err.graphQLErrors.length>0)
        console.log(`error: ${err.graphQLErrors[0].message}`)
    })
  };
  
  onConfirmHandler =  async () => {
    console.log(this.state)
    const id= await this.createAddress();
    this.updateUserAddress(id)
  }

  handleChange = (name,event) => {
    console.log({[name]:"wut"})
    console.log({ name:"wut"})
    this.setState({ [name]: event.target.value });
  };

  render() {
    const { fullScreen } = this.props;
    // console.log(this.onConfirmHandler().then(()=>{console.log("termine")}))
    return (
      <Dialog
        fullScreen={fullScreen}
        open={this.props.open}
        onClose={this.props.handleClose}
        aria-labelledby="form-address-dialog"
      >
        <DialogTitle id="form-address-dialog">
          {this.props.direccion ? "Editar direccion" : "Añadir direccion"}
        </DialogTitle>

        <DialogContent style={{ minHeight: '50vh' }}>
          {/* <SuccessAnimation></SuccessAnimation> */}
          <TextField
            required
            autoFocus
            margin="normal"
            label="street"
            type="text"
            fullWidth
            value={this.state.street}
            onChange={this.handleChange.bind(this,'street')}
          />
          <TextField
            autoFocus
            margin="normal"
            label="Exterior number"
            type="number"
            fullWidth
            value={this.state.exteriorNumber}
            onChange={this.handleChange.bind(this,'exteriorNumber')}
          />
           <TextField
            autoFocus
            margin="normal"
            label="City"
            type="text"
            fullWidth
            value={this.state.city}
            onChange={this.handleChange.bind(this,'city')}
          />
           <TextField
            autoFocus
            margin="normal"
            label="Country"
            type="text"
            fullWidth
            value={this.state.country}
            onChange={this.handleChange.bind(this,'country')}
          />
           <TextField
            autoFocus
            margin="normal"
            label="Zip Code"
            type="number"
            fullWidth
            value={this.state.zipCode}
            onChange={this.handleChange.bind(this,'zipCode')}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.onCancel} color="primary">
            Cancelar
          </Button>
          <Button onClick={this.onConfirmHandler} color="primary" autoFocus>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

export default withApollo(withMobileDialog({breakpoint: 'xs'})(FormDialog));
