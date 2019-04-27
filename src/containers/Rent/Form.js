import React, { Component } from "react";

// import { Editor } from "react-draft-wysiwyg";
// import { EditorState, ContentState } from "draft-js";
// import FormLabel from "@material-ui/core/FormLabel/FormLabel";
// import Input from "@material-ui/core/Input/Input"
// import FormControlLabel from "@material-ui/core/FormControlLabel/FormControlLabel";
// import Checkbox from "@material-ui/core/Checkbox/Checkbox"
// import { convertToRaw } from "draft-js";
// import draftToHtml from "draftjs-to-html";
// import htmlToDraft from "html-to-draftjs";
// import "../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import styles from "./styles";

import CustomerCard from "../../components/Rent/CustomerCard";

// import Spinner from "../../components/Spinner/Spinner";
import TextField from "@material-ui/core/TextField";
// import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import SearchIcon from '@material-ui/icons/Search';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
// import Input from '@material-ui/core/Input';
// import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';

// import classNames from 'classnames';
import { withApollo } from "react-apollo";
import { GET_PRODUCTS,GET_CLIENTS ,GET_ACCESSORIES,RENT_PRODUCT,RENT_ACC,RENT_TOTAL} from "./constants";

// import Button from "@material-ui/core/Button";
// import InputAdornment from "@material-ui/core/InputAdornment";

// https://stackoverflow.com/questions/1789945/how-to-check-whether-a-string-contains-a-substring-in-javascript
// Searches for the given pattern string in the given text string using the Knuth-Morris-Pratt string matching algorithm.
// If the pattern is found, this returns the index of the start of the earliest match in 'text'. Otherwise -1 is returned.
function kmpSearch(pattern, text) {
  if (pattern.length === 0)
      return 0;  // Immediate match

  // Compute longest suffix-prefix table
  var lsp = [0];  // Base case
  for (let i = 1; i < pattern.length; i++) {
      var j = lsp[i - 1];  // Start by assuming we're extending the previous LSP
      while (j > 0 && pattern.charAt(i) !== pattern.charAt(j))
          j = lsp[j - 1];
      if (pattern.charAt(i) === pattern.charAt(j))
          j++;
      lsp.push(j);
  }

  // Walk through text string
   j = 0;  // Number of chars matched in pattern
  for (let i = 0; i < text.length; i++) {
      while (j > 0 && text.charAt(i) !==pattern.charAt(j))
          j = lsp[j - 1];  // Fall back in the pattern
      if (text.charAt(i) ===pattern.charAt(j)) {
          j++;  // Next char matched, increment position
          if (j === pattern.length)
              return i - (j - 1);
      }
  }
  return -1;  // Not found
}



export class Form extends Component {

  state={
    name:"",
    quantity:0,
    productos:[],
    accesory:"",
    customer:"",
    foundCustomers:[],
    selectedCustomer:[],
    accesorios:[]
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };
  
  getProduct=(text)=>{
    console.log("starting query")
    // const id= this.props.match.params.id
    // console.log(this.props.client)
    console.log(GET_PRODUCTS)
    this.props.client
      .query({
        query: GET_PRODUCTS,
      })
      .then(data => {
        console.log("productos en DB: ")
        //codigo valido MB12345
        // let selectedCode="MB12345"
        //codigo incorrecto
        let selectedCode=text
        console.log(data.data.products)
        let foundProduct;
        let actuales=   [...data.data.products]
        actuales.forEach((product)=>{
          let encontre=false;
          for(let code of product.codes){
              encontre=code===selectedCode?true:false
              if(encontre){
                product.coincidencia=selectedCode
                product.quantity=1
                product.additionalAccessory=""
                    if(product.accessories.length>0){
                      for(let accesorio of product.accessories){
                        accesorio.quantity=1;
                        accesorio.random=Math.random();
                        accesorio=Object.assign({}, accesorio)
                      }
                    }
                  foundProduct=product
                  break;
              }
          }
        })
        if(foundProduct!==undefined){  
          console.log("===foundProduct")
          console.log(foundProduct)
          console.log("this produccts")
          console.log(this.state.productos)
          let productos=this.state.productos;
          let accesorios=this.state.accesorios;
          let arr=[]
          for(let accessorio of foundProduct.accessories){
            console.log(accessorio)
            arr.push(Object.assign({},accessorio))
          }
          accesorios.push([...arr])

          // accesorios.push(foundProduct.accessories)
          console.log(accesorios)
          // accesorios.push(Object.assign({},foundAccessory))
          productos.push(Object.assign({},foundProduct))
          this.setState({
            productos,
            accesorios
          })
        }
      })
      .catch(error => {
        console.log("error")
        console.log(error)
        if(error.graphQLErrors.length>0)
        console.log(`error: ${error.graphQLErrors[0].message}`)
        this.setState({
          error:true
        })
    });
  }

  getCustomer=()=>{
    console.log("starting query")
    console.log(GET_CLIENTS)
    this.props.client
      .query({
        query: GET_CLIENTS,
      })
      .then(data => {
        console.log("Clientes en DB")
        console.log(data.data.clients)
        let foundCustomers=[]
        //Erick Rosete Beas
        data.data.clients.forEach((customer)=>{
          console.log(`la comparacion de ${this.state.customer} y ${customer.name}${kmpSearch(this.state.customer.toUpperCase(), customer.name.toUpperCase()) !==-1 }`)// false
          let encontre=false;
          if(kmpSearch(this.state.customer.toUpperCase(), customer.name.toUpperCase()) !== -1 ){encontre=true;}
          if(encontre){
            foundCustomers.push(customer)
          }
        })
        if(foundCustomers.length>0){  
          console.log("===foundCustomers")
          console.log(foundCustomers)
          this.setState({foundCustomers})
        }
      })
      .catch(error => {
        console.log("error")
        console.log(error)
        if(error.graphQLErrors.length>0)
        console.log(`error: ${error.graphQLErrors[0].message}`)
        this.setState({
          error:true
        })
    });

  }
  searchHandler=()=>{
    console.log("clickeaste")
    let encontre=false;
    for(let product of this.state.productos){
      for(let code of product.codes){
        encontre=code===this.state.name?true:false
        if(encontre){
          break;
        }
      }
      if(encontre){
        break;
      }
    }
    // this.state.productos.forEach((product)=>{
     
    //   })
      console.log(encontre)
    // console.log(resultado)
    // if()
    if(!encontre){
      this.getProduct(this.state.name);
    }
    // console.log(productos)
    // let obj={name:this.state.name, quantity:0,accessories:[{name:"teclado",quantity:2},{name:"mouse",quantity:3}]}
    // productos.push(obj)
    // console.log(productos)
    // this.setState({productos,})
  }

  customerSearch=()=>{
    console.log("customer")
    console.log(this.state.customer)
    this.getCustomer();
  }

  assignCustomer=(index)=>{
    console.log("assigning customer")
    console.log(index)
    let selectedCustomer=[this.state.foundCustomers[index]]
    console.log(selectedCustomer)
    this.setState({
      selectedCustomer,
      customer:"",
      foundCustomers:[]
    })
  }

  productQuantity=(index,event)=>{
    let productos=this.state.productos
    productos[index].quantity=event.target.value
    this.setState({
      productos
    })
  }

  accessoryQuantity=(index,pindex,event)=>{
    console.log(event.target.value)
    console.log(index)
    console.log(pindex)
    let accesorios=this.state.accesorios
    accesorios[pindex][index].quantity=event.target.value
    this.setState({
      accesorios
    })

  }

  rentHandler=async ()=>{
    console.log("salida")
    if(this.state.selectedCustomer.length>0){
      console.log(this.state.selectedCustomer)
      if(this.state.productos.length>0){
        console.log("productos seleccionados")
        console.log(this.state.productos)
        console.log(this.state.accesorios)
        console.log(this.state.selectedCustomer)
        let rentProducts=[]
        let rentAccessories=[];
        
      console.log("productos rentados")
        for(let i of this.state.productos){
          let rentProductInput={
            quantity: +i.quantity,
            code: i.coincidencia.toString(),
            product: i._id
          }
          console.log(rentProductInput)
          await this.props.client.mutate({
              mutation: RENT_PRODUCT ,
              variables: {...rentProductInput}
              }).then(data => {
                console.log(data.data.createRentProduct._id)
                rentProducts.push(data.data.createRentProduct._id)
              }).catch((err)=>{console.log(err)})
            // rentProducts.push(i._id)
        }
        console.log("accesorios rentados")
        console.log(this.state.accesorios)
        for (let i=0;i<this.state.accesorios.length;i++){
          let accesorios=this.state.accesorios[i]
          for(let a of accesorios){
            // console.log(i)
            rentAccessories.push(a._id)
            let rentAcc={
              quantity: +a.quantity,
              accessory: a._id
            }
            await this.props.client.mutate({
              mutation: RENT_ACC ,
              variables: {...rentAcc}
              }).then(data => {
                rentAccessories.push(data.data.createRentAccessory._id)
                console.log(data.data.createRentAccessory._id)
              }).catch((err)=>{console.log(err)})
          }
        }

        console.log(rentProducts)
        console.log(rentAccessories)
        let obj={
          // startDate:"hoy",
          startDate:new Date("11/20/2014 04:11"),
          endDate:new Date("11/21/2014 04:11"),
          client:this.state.selectedCustomer[0]._id,
          rentProducts,
          rentAccessories
        }
        console.log(obj)
        this.props.client.mutate({
          mutation: RENT_TOTAL ,
          variables: {...obj}
          }).then(data => {
            // rentAccessories.push(data.data.createRentAccessory._id)
            console.log(data)
            alert("La renta ha sido exitosa")
          }).catch((err)=>{console.log(err)})
        // input RentInput{
        //     startDate: String
        //     endDate: String
        //     client: ID
        //     rentProducts: [ID]
        //     rentAccessories: [ID]
        // }
      }
      else{
        alert("No has seleccionado productos")
      }
    }
    else{
      alert("No has seleccionado un cliente")
    }
  }

  getAccessory=(texto,index)=>{
    console.log("getting accessory")
    console.log(texto)
    this.props.client
    .query({
      query: GET_ACCESSORIES,
    })
    .then(data => {
      let foundAccessory;
      data.data.accessories.forEach((accessory)=>{
        let encontre=false;
        if(accessory.code=== texto ){encontre=true;}
        if(encontre){
          foundAccessory=accessory
        }
      })
      if(foundAccessory!==undefined){  
        console.log("===foundAccessory")
        console.log(foundAccessory)
        foundAccessory.quantity=1;
        let accesorios=this.state.accesorios
        accesorios[index].push(Object.assign({},foundAccessory))
        this.setState({accesorios})
      }
    })
    .catch(error => {
      console.log("error")
      console.log(error)
      if(error.graphQLErrors.length>0)
      console.log(`error: ${error.graphQLErrors[0].message}`)
      this.setState({
        error:true
      })
  });
  }

  modifyAccessory=(index,event)=>{
    console.log("modifico valor")
    console.log(event.target.value)
    console.log(index)
    let productos=this.state.productos
    productos[index].additionalAccessory=event.target.value
    console.log(productos)
    this.setState({productos})

  }

  addAccessory=(index,event)=>{
    console.log("adding accessory")
    console.log(event)
    let productos=this.state.productos
    let texto=productos[index].additionalAccessory
    this.getAccessory(texto,index);
  }

  // accesorios=[{name:"uno",_id:"1"},
  // {name:"dos",_id:"2"}]
  render() {
    const { classes } = this.props;
    return (
      // <p>Campos para orden de renta</p>
      <form className={classes.container} noValidate autoComplete="off">
      <Grid   justify="center"
        container spacing={24} >
        {this.state.selectedCustomer.length>0&&
          <Grid item xs={12}
            container justify="center">
            <CustomerCard
            selectedCustomer={this.state.selectedCustomer[0]}>
            </CustomerCard>
          </Grid>
        } 
        <Grid item xs={10}>
            <TextField
                // select
                label="Producto a agregar por código"
                // className={classNames(classes.margin, classes.textField)}
                value={this.state.name}
                onChange={this.handleChange('name')}
                InputProps={{
                  endAdornment:<InputAdornment position="end">
                    <IconButton className={classes.iconButton} aria-label="Search" onClick={this.searchHandler}>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                }}
              fullWidth
              variant="outlined"
              style={{marginBottom:"2rem"}}
            ></TextField>
        </Grid>
      </Grid>
        {this.state.productos.length>0 && this.state.productos.map((product, pindex) => {
          console.log(product)
            let estado=this.state
            return (
              <Grid   justify="center"
              container spacing={24} key={pindex} style={{marginBottom:"2rem"}}>
              {/* producto agregado */}
                <Grid  item xs={10} justify="flex-end"
                container spacing={24} key={pindex} >
                    <Grid item xs={8} sm={2} >
                      <TextField
                        disabled
                        id="standard-disabled"
                        label="Código"
                        defaultValue={product.coincidencia}
                        className={classes.textField}
                        margin="normal"
                        variant="filled"
                        fullWidth
                      />
                        {/* <Paper className={classes.paper}>{product.coincidencia}</Paper> */}
                    </Grid>
                    <Grid item xs={8} sm={8} >
                      {/* <Paper className={classes.paper}>{product.name}</Paper> */}
                      <TextField
                        disabled
                        id="standard-disabled"
                        label="Nombre del producto"
                        defaultValue={product.name}
                        className={classes.textField}
                        margin="normal"
                        variant="filled"
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={8} sm={2}>
                        <TextField
                          id="standard-number"
                          label="Cantidad"
                          // defaultValue={1}
                          value={product.quantity}
                              onChange={this.productQuantity.bind(this,pindex)}
                          type="number"
                          className={classes.textField}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          margin="normal"
                          variant="filled"
                          fullWidth
                        />
                    </Grid>
                  </Grid>
                {/* accesorios del producto */}
                {product.accessories.length>0 && estado.accesorios[pindex].map((accessory,index)=>{
                {/* {product.accessories.length>0 && product.newAccessories.map((accessory,index)=>{ */}
                  // {product.accessories.length>0 && product.newAccessories.map((accessory,index)=>{
                    // console.log()
                    console.log("productitos")
                  console.log(this.state.accesorios[pindex])
                  // console.log(e)
                  // console.log("code")
                  // console.log(accessory.code)
                  // console.log(pindex)
                  console.log(accessory.random)
                    return(
                      <React.Fragment key={index}>  
                        <Grid container item xs={10} spacing={24} justify="flex-end">
                          <Grid item xs={8} sm={2} >
                            <TextField
                              disabled
                              id="standard-disabled"
                              label="Código del accesorio"
                              defaultValue={accessory.code}
                              className={classes.textField}
                              margin="normal"
                              variant="outlined"
                              fullWidth
                            />
                            {/* <Paper className={classes.paper}>{accessory.code}</Paper> */}
                          </Grid>
                          <Grid item xs={8} sm={5} >
                            <TextField
                              disabled
                              id="standard-disabled"
                              label="Nombre del accesorio"
                              defaultValue={accessory.name}
                              className={classes.textField}
                              margin="normal"
                              variant="outlined"
                              fullWidth
                            />
                            {/* <Paper className={classes.paper}>{accessory.name}</Paper> */}
                          </Grid>
                          <Grid item xs={8} sm={2}>
                            <TextField
                              id="standard-number"
                              label="Cantidad"
                              value={accessory.quantity}
                              // defaultValue={1}
                              onChange={this.accessoryQuantity.bind(this,index,pindex)}
                              type="number"
                              className={classes.textField}
                              InputLabelProps={{
                                shrink: true,
                              }}
                              margin="normal"
                              variant="outlined"
                              fullWidth
                            />
                          </Grid>
                        </Grid>
                      </React.Fragment>
                  )
                },this)
                
                }
                {/* agregar nuevo accesorio */}
                  <Grid container item xs={10} spacing={24} justify="flex-end">
                    <Grid item xs={8} sm={7} >
                      <TextField
                        // select
                        label="Accesorio a agregar"
                        // className={classNames(classes.margin, classes.textField)}
                        value={this.state.productos[pindex].additionalAccessory}
                        // additionalAccessory
                        onChange={this.modifyAccessory.bind(this,pindex)}
                        InputProps={{
                          endAdornment:<InputAdornment position="end">
                            <IconButton className={classes.iconButton} aria-label="Search" onClick={this.addAccessory.bind(this,pindex)}>
                              <SearchIcon />
                            </IconButton>
                          </InputAdornment>
                          }}
                        fullWidth
                        variant="outlined"
                      ></TextField>
                    </Grid>
                  </Grid>     
              </Grid>
              );
        })}



      {/* boton de salida */}
      <Grid  
      container spacing={24}
      justify="center">
        <Grid item xs={6} 
         container justify="flex-end">
          <TextField
            // select
            label="Cliente a buscar por nombre"
            // className={classNames(classes.margin, classes.textField)}
            value={this.state.customer}
            onChange={this.handleChange('customer')}
            InputProps={{
              endAdornment:<InputAdornment position="end">
                <IconButton className={classes.iconButton} aria-label="Search" onClick={this.customerSearch}>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
              }}
            fullWidth
            variant="outlined"
          ></TextField>
        </Grid>
        <Grid item xs={4} 
         container justify="flex-end">
          <Button variant="contained" color="secondary" className={classes.button} onClick={this.rentHandler}>
            Salida
          </Button>
        </Grid>
        {this.state.foundCustomers.length>0&&
          <Grid item xs={10}
          container>
            {this.state.foundCustomers.map((customer, index) => {
              return (
                <React.Fragment key={customer._id}>
                  <Grid item xs={8}>
                    <p>{customer.name}</p>
                  </Grid>
                  <Grid item xs={4}>
                    <Button variant="contained" color="primary" className={classes.button} onClick={this.assignCustomer.bind(this,index)} >
                      Asignar a cliente
                    </Button>
                  </Grid>
                </React.Fragment>
              );
            })}
          </Grid>
        }
      </Grid>
      
      </form>
    );
  }
}

Form.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withApollo(withStyles(styles)(Form));
