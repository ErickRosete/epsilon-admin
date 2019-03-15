import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import React, { Component } from 'react';
import Layout from "../../containers/Layout/Layout"
import { withApollo } from "react-apollo";
import { SEARCH_USER_BY_ID } from "./constants";
import AddIcon from "@material-ui/icons/Add";
import FormDialog from "./AddressDialog"
const styles = theme => ({
    // address: {
    //     display: 'flex',
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     alignContent: 'center',
    //     backgroundColor: theme.palette.secondary.main,
    //     flexDirection: "column"
    // },
    // linea:{
    //     display:'flex'
    // },
    // // boton de agregar
    // fab: {
    //     position: "fixed",
    //     bottom: theme.spacing.unit * 2,
    //     right: theme.spacing.unit * 2
    // },
    subbannerText:{
      fontSize: "2rem"
    },
    Tarjeta:{
      // border-width border-style (required) border-color
      border: '5px solid red',
      cursor:'pointer',
      width:"40vw"
    }
});

export class AddressesPage extends Component {
  constructor(props){
    super(props);
    this.state={
      modal:false,
      id:"",
      error:false,
    }
  }
  onCancel=()=>{
    this.setState({modal:false})
  }
  handleAdd=()=>{
    console.log("adding address")
    this.setState({modal:true})
  }
    runQuery = () => {
      const id= this.props.match.params.id
      console.log(this.props.client)
      this.props.client
        .query({
          query: SEARCH_USER_BY_ID,
          variables: { id },
        })
        .then(data => {
          console.log(data.data.user)
          this.setState({
            id:data.data.user._id
          })
        })
        .catch(error => {
          if(error.graphQLErrors.length>0)
          console.log(`error: ${error.graphQLErrors[0].message}`)
          this.setState({
            error:true
          })
        });
    };

    componentDidMount(){
        this.runQuery();
    }

  render() {
    const classes = this.props.classes;
    return (
        <Layout 
        title="Lista de direcciones">
            <div>soy un sitio de modificiacion de direcciones de {this.props.match.params.id}</div>
            {!this.state.error && <div>
              <div className={classes.Tarjeta} onClick={this.handleAdd}>
                <h1 className={classes.subbannerText}>Agregar direccion</h1>
                <p><AddIcon  style={{fontSize: '50px'}}/></p>
              </div>
            </div>}
            {/* <div class="row justify-content-center mr-0 ml-0">
              <div class="col-md-3 border border-secondary mr-2 mb-2 p-2 text-center" style="cursor:pointer;" onclick="agregarDireccion()">
                  <div class="row justify-content-center centradavertical">
                      <div class="col-12">
                          <h1 class="subbanner-text mb-1" style="font-size:2rem;">Agregar direccion</h1>
                      </div>
                      <div class="col-12">
                          <i class="fa fa-plus fa-4x" aria-hidden="true"></i>
                      </div>
                  </div>
              </div>
            </div> */}
            <FormDialog
             open={this.state.modal}
             onCancel={this.onCancel}
             id={this.state.id}
             >
            </FormDialog>
        </Layout>
    )
  }
}
AddressesPage.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withApollo(withStyles(styles)(AddressesPage))
