import React, { Component } from "react";

import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import styles from "./styles";

import CustomerCard from "../../components/Rent/CustomerCard";

import TextField from "@material-ui/core/TextField";
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import RentIcon from "@material-ui/icons/Forward"
import ClearIcon from "@material-ui/icons/Clear";

import { withApollo } from "react-apollo";
import {
  GET_CLIENTS, GET_CLIENT, GET_ACCESSORY_BY_CODE, GET_PRODUCT_BY_CODE,
  RENT_PRODUCT, RENT_ACC, RENT_TOTAL,
} from "./constants";


export class Form extends Component {
  state = {
    name: "",
    accesory: "",
    customer: "",
    productos: [],
    foundCustomers: [],
    selectedCustomer: {},
    accesorios: []
  }

  componentDidMount() {
    const clientId = this.props.clientId;
    if (clientId) {
      this.props.client
        .query({
          query: GET_CLIENT,
          variables: { id: clientId }
        })
        .then(data => {
          const client = data.data.client;
          if (client) {
            this.setState({ selectedCustomer: client })
          }
        })
        .catch(error => {
          console.log("error", error)
          if (error.graphQLErrors && error.graphQLErrors.length > 0)
            console.log(`error: ${error.graphQLErrors[0].message}`)
          this.setState({
            error: true
          })
        });
    }
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
    const value = event.target.value;
    switch (name) {
      case "customer":
        if (event.target.value) {
          this.searchClients();
        } else {
          this.setState({ foundCustomers: [] })
        }
        break;
      case "name":
        if (value) {
          this.searchProducts(value);
        }
        break;
      default:
        break;
    }
  };

  searchClients = () => {
    this.props.client
      .query({
        query: GET_CLIENTS,
      })
      .then(data => {
        const foundCustomers = data.data.clients.filter(client =>
          client.name.toUpperCase().includes(this.state.customer.toUpperCase()) ||
          client.email.toUpperCase().includes(this.state.customer.toUpperCase()) ||
          client.company.toUpperCase().includes(this.state.customer.toUpperCase()))
        this.setState({ foundCustomers })
      })
      .catch(error => {
        console.log("error", error)
        if (error.graphQLErrors && error.graphQLErrors.length > 0)
          console.log(`error: ${error.graphQLErrors[0].message}`)
        this.setState({
          error: true
        })
      });
  }

  assignCustomer = (index) => {
    const selectedCustomer = { ...this.state.foundCustomers[index] };
    this.setState({
      selectedCustomer,
      customer: "",
      foundCustomers: []
    })
  }

  searchProducts = (code) => {
    const products = [...this.state.productos];
    console.log(products)
    //opc 1
    // const product = products.find(prod => prod.codes.indexOf(code) > -1);
    const product = products.find(prod => prod.coincidencia.indexOf(code) > -1);
    if (!product) {
      this.addProduct(code);
    } else {
      product.quantity += 1;
      this.setState({
        productos: products,
        name: ""
      })
    }
  }

  addProduct = (text) => {
    this.props.client
      .query({
        query: GET_PRODUCT_BY_CODE,
        variables: { code: text }
      })
      .then(data => {
        const products = [...this.state.productos];
        const accessories = [...this.state.accesorios];

        const product = data.data.productByCode;

        if (product) {
          product.coincidencia = text;
          product.quantity = 1;
          product.additionalAccessory = "";

          if (product.accessories.length > 0) {
            for (let accesorio of product.accessories) {
              accesorio.quantity = 1;
              accesorio.random = Math.random();
              accessories.push(accesorio);
            }
          }

          products.push(product);
          console.log(product);

          this.setState({
            name: "",
            productos: products,
            accesorios: accessories
          })

          //scroll to bottom
          window.scrollTo(0, document.body.scrollHeight);

        }
      })
      .catch(error => {
        console.log("error", error)
        if (error.graphQLErrors && error.graphQLErrors.length > 0)
          console.log(`error: ${error.graphQLErrors[0].message}`)
        this.setState({
          error: true
        })
      });
  }

  productQuantity = (index, event) => {
    let productos = this.state.productos
    productos[index].quantity = event.target.value
    this.setState({
      productos
    })
  }

  accessoryQuantity = (index, pindex, event) => {
    const products = [...this.state.productos]
    products[pindex].accessories[index].quantity = +event.target.value
    this.setState({
      products
    })
  }

  modifyAccessory = (index, event) => {
    const productos = [...this.state.productos];
    const code = event.target.value;
    productos[index].additionalAccessory = code
    this.setState({ productos })

    if (code) {
      this.searchAccessory(index, code);
    }
  }

  searchAccessory = (pindex, code) => {
    const products = [...this.state.productos];
    const accessory = products[pindex].accessories.find(acc => acc.code === code);
    if (!accessory) {
      this.addAccessory(code, pindex);
    } else {
      accessory.quantity += 1;
      products[pindex].additionalAccessory = "";
      this.setState({
        productos: products,
      })
    }
  }

  addAccessory = (texto, index) => {
    this.props.client
      .query({
        query: GET_ACCESSORY_BY_CODE,
        variables: { code: texto }
      })
      .then(data => {
        const accessory = data.data.accessoryByCode;
        if (accessory) {
          accessory.quantity = 1;
          const products = [...this.state.productos]
          products[index].accessories.push(accessory)
          products[index].additionalAccessory = "";
          this.setState({ productos: products })
        }
      })
      .catch(error => {
        console.log("error")
        console.log(error)
        if (error.graphQLErrors && error.graphQLErrors.length > 0)
          console.log(`error: ${error.graphQLErrors[0].message}`)
        this.setState({
          error: true
        })
      });
  }

  deleteProductHandler = (pindex) => {
    let productos = [...this.state.productos];
    productos.splice(pindex, 1)
    this.setState({ productos })
  }

  deleteAccessoryHandler = (aindex, pindex) => {
    let productos = [...this.state.productos];
    productos[pindex].accessories.splice(aindex, 1);
    this.setState({ productos })
  }

  rentHandler = async () => {
    console.log("salida")
    console.log(this.state.selectedCustomer._id)
    if (this.state.selectedCustomer._id) {
      if (this.state.productos.length > 0) {
        // let uniqueProducts=[]
        let uniqueAccessories=[]
        let rentProducts = []
        let rentAccessories = [];
        console.log("productos rentados")
        for (let prod of this.state.productos) {
          let rentProductInput = {
            quantity: +prod.quantity,
            code: prod.coincidencia.toString(),
            product: prod._id
          }
          await this.props.client.mutate({
            mutation: RENT_PRODUCT,
            variables: { ...rentProductInput }
          }).then(data => {
            console.log(data.data.createRentProduct._id)
            rentProducts.push(data.data.createRentProduct._id)
          }).catch((err) => { console.log(err) })

          for(let acc of prod.accessories) {
            let ubicacion=uniqueAccessories.findIndex(function(element) {
              return element.accessory === acc._id;
            });
            console.log(ubicacion)
            if(ubicacion===-1){
              let rentAcc = {
                quantity: +acc.quantity,
                accessory: acc._id
              }
              uniqueAccessories.push(rentAcc)
            }
            else{
              uniqueAccessories[ubicacion].quantity+=acc.quantity;
            }
          } 

        }

        for(let acc of uniqueAccessories){
          await this.props.client.mutate({
            mutation: RENT_ACC,
            variables: { ...acc }
          }).then(data => {
            rentAccessories.push(data.data.createRentAccessory._id)
            console.log(data.data.createRentAccessory._id)
          }).catch((err) => { console.log(err) })  
        }

        console.log(uniqueAccessories)
        console.log(rentAccessories)
        console.log(rentProducts)
        let obj = {
          // startDate:"hoy",
          startDate: new Date("11/20/2014 04:11"),
          endDate: new Date("11/21/2014 04:11"),
          client: this.state.selectedCustomer._id,
          rentProducts,
          rentAccessories
        }
        console.log(obj)
        this.props.client.mutate({
          mutation: RENT_TOTAL,
          variables: { ...obj }
        }).then(data => {
          // rentAccessories.push(data.data.createRentAccessory._id)
          console.log(data.data.createRent)
          alert("La renta ha sido exitosa")
        }).catch((err) => { console.log(err) })

        // const x=uniqueProducts.indexOf("hol")
        // console.log(x);
        // console.log("hola")

        // for (let prod of this.state.productos) {
        //   let rentProductInput = {
        //     quantity: +prod.quantity,
        //     code: prod.coincidencia.toString(),
        //     product: prod._id
        //   }
        //   console.log(rentProductInput)
        //   await this.props.client.mutate({
        //     mutation: RENT_PRODUCT,
        //     variables: { ...rentProductInput }
        //   }).then(data => {
        //     console.log(data.data.createRentProduct._id)
        //     rentProducts.push(data.data.createRentProduct._id)
        //   }).catch((err) => { console.log(err) })
        //   // rentProducts.push(i._id)


        //   for (let acc of prod.accessories) {
        //     // console.log(i)
        //     rentAccessories.push(acc._id)
        //     let rentAcc = {
        //       quantity: +acc.quantity,
        //       accessory: acc._id
        //     }
        //     await this.props.client.mutate({
        //       mutation: RENT_ACC,
        //       variables: { ...rentAcc }
        //     }).then(data => {
        //       rentAccessories.push(data.data.createRentAccessory._id)
        //       console.log(data.data.createRentAccessory._id)
        //     }).catch((err) => { console.log(err) })
        //   }
        // }

        // console.log(rentProducts)
        // console.log(rentAccessories)
        // let obj = {
        //   // startDate:"hoy",
        //   startDate: new Date("11/20/2014 04:11"),
        //   endDate: new Date("11/21/2014 04:11"),
        //   client: this.state.selectedCustomer._id,
        //   rentProducts,
        //   rentAccessories
        // }
        // console.log(obj)
        // this.props.client.mutate({
        //   mutation: RENT_TOTAL,
        //   variables: { ...obj }
        // }).then(data => {
        //   // rentAccessories.push(data.data.createRentAccessory._id)
        //   console.log(data)
        //   alert("La renta ha sido exitosa")
        // }).catch((err) => { console.log(err) })
      }
      else {
        alert("No has seleccionado productos")
      }
    }
    else {
      alert("No has seleccionado un cliente")
    }
  }

  render() {
    const { classes } = this.props;
    return (
      // <p>Campos para orden de renta</p>
      <form className={classes.container} noValidate autoComplete="off">
        <Grid justify="center"
          container spacing={24} >
          {Object.keys(this.state.selectedCustomer).length > 0 &&
            <Grid item xs={12}
              container justify="center">
              <CustomerCard
                selectedCustomer={this.state.selectedCustomer}>
              </CustomerCard>
            </Grid>
          }

          {/* client search  */}
          <Grid
            container spacing={24}
            justify="center" style={{ marginBottom: '1rem', marginTop: '1rem' }}>
            <Grid item xs={6}
              container justify="flex-end">
              <TextField
                // select
                label="Buscar cliente"
                // className={classNames(classes.margin, classes.textField)}
                value={this.state.customer}
                onChange={this.handleChange('customer')}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <SearchIcon />
                    </InputAdornment>
                  )
                }}
                fullWidth
                variant="outlined"
              ></TextField>
            </Grid>
            <Grid item xs={4}
              container justify="flex-end">
              <Button variant="contained" color="secondary" className={classes.button} onClick={this.rentHandler}>
                Salida
                <RentIcon className={classes.rightIcon}></RentIcon>
              </Button>
            </Grid>

            {this.state.foundCustomers.length > 0 &&
              <Grid item xs={10} container style={{ maxHeight: '50vh', overflow: 'auto' }}>
                {this.state.foundCustomers.map((customer, index) => {
                  return (
                    <React.Fragment key={customer._id} >
                      <Grid item xs={8} style={{ display: 'flex', justifyContent: 'space-around' }}>
                        <p>{customer.name}</p>
                        <p>{customer.email}</p>
                        <p>{customer.company}</p>
                      </Grid>
                      <Grid item xs={4}>
                        <Button variant="contained" color="primary" className={classes.button}
                          onClick={this.assignCustomer.bind(this, index)} >
                          Asignar a cliente
                        </Button>
                      </Grid>
                    </React.Fragment>
                  );
                })}
              </Grid>
            }
          </Grid>

          {this.state.productos && this.state.productos.map((product, pindex) => {
            return (
              <Grid justify="center" container spacing={24} key={product.coincidencia} style={{ marginBottom: "2rem" }}>
                {/* producto agregado */}
                <Grid item xs={10} justify="flex-end"
                  container spacing={24} key={pindex} >
                  <Grid item xs={8} sm={2} >
                    <TextField
                      disabled
                      id="standard-disabled"
                      label="Código"
                      value={product.coincidencia}
                      className={classes.textField}
                      margin="normal"
                      variant="filled"
                      fullWidth
                    />
                    {/* <Paper className={classes.paper}>{product.coincidencia}</Paper> */}
                  </Grid>
                  <Grid item xs={8} sm={6} >
                    {/* <Paper className={classes.paper}>{product.name}</Paper> */}
                    <TextField
                      disabled
                      id="standard-disabled"
                      label="Nombre del producto"
                      value={product.name}
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
                      onChange={this.productQuantity.bind(this, pindex)}
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
                  <Grid item xs={8} sm={2} className={classes.center}>
                    <Button variant="contained" color="secondary"
                      onClick={this.deleteProductHandler.bind(this, pindex)}>
                      <ClearIcon />
                    </Button>
                  </Grid>
                </Grid>

                {/* accesorios del producto */}
                {product.accessories && product.accessories.map((accessory, index) => {
                  return (
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
                            onChange={this.accessoryQuantity.bind(this, index, pindex)}
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
                        <Grid item xs={8} sm={2} className={classes.center}>
                          <Button variant="contained" color="secondary"
                            onClick={this.deleteAccessoryHandler.bind(this, index, pindex)}>
                            <ClearIcon />

                          </Button>
                        </Grid>
                      </Grid>
                    </React.Fragment>
                  )
                }, this)}
                {/* agregar nuevo accesorio */}
                <Grid container item xs={10} spacing={24} justify="flex-end">
                  <Grid item xs={8} sm={7} >
                    <TextField
                      // select
                      label="Accesorio a agregar por código"
                      // className={classNames(classes.margin, classes.textField)}
                      value={this.state.productos[pindex].additionalAccessory}
                      // additionalAccessory
                      onChange={this.modifyAccessory.bind(this, pindex)}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <SearchIcon />
                          </InputAdornment>
                        )
                      }}
                      fullWidth
                      variant="outlined"
                    ></TextField>
                  </Grid>
                </Grid>
              </Grid>
            );
          })}

          {/* Buscador de Productos */}
          <Grid container spacing={24} justify="center" >
            <Grid item xs={10}>
              <TextField
                // select
                label="Producto a agregar por código"
                // className={classNames(classes.margin, classes.textField)}
                value={this.state.name}
                onChange={this.handleChange('name')}
                InputProps={{
                  endAdornment: <InputAdornment position="end">
                    <IconButton className={classes.iconButton} aria-label="Search" onClick={this.searchHandler}>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                }}
                fullWidth
                variant="outlined"
                style={{ marginBottom: "2rem" }}
              ></TextField>
            </Grid>
          </Grid>
        </Grid>

      </form>
    );
  }
}

Form.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withApollo(withStyles(styles)(Form));


// https://stackoverflow.com/questions/1789945/how-to-check-whether-a-string-contains-a-substring-in-javascript
// Searches for the given pattern string in the given text string using the Knuth-Morris-Pratt string matching algorithm.
// If the pattern is found, this returns the index of the start of the earliest match in 'text'. Otherwise -1 is returned.
// function kmpSearch(pattern, text) {
//   if (pattern.length === 0)
//     return 0;  // Immediate match

//   // Compute longest suffix-prefix table
//   var lsp = [0];  // Base case
//   for (let i = 1; i < pattern.length; i++) {
//     var j = lsp[i - 1];  // Start by assuming we're extending the previous LSP
//     while (j > 0 && pattern.charAt(i) !== pattern.charAt(j))
//       j = lsp[j - 1];
//     if (pattern.charAt(i) === pattern.charAt(j))
//       j++;
//     lsp.push(j);
//   }

//   // Walk through text string
//   j = 0;  // Number of chars matched in pattern
//   for (let i = 0; i < text.length; i++) {
//     while (j > 0 && text.charAt(i) !== pattern.charAt(j))
//       j = lsp[j - 1];  // Fall back in the pattern
//     if (text.charAt(i) === pattern.charAt(j)) {
//       j++;  // Next char matched, increment position
//       if (j === pattern.length)
//         return i - (j - 1);
//     }
//   }
//   return -1;  // Not found
// }