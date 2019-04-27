import React, { Component } from "react";
import Layout from "../../containers/Layout/Layout";
//styles
import { styles } from "./constants";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
//TABLE
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
//graphql
import { withApollo } from "react-apollo";
import { GET_PRODUCTS,GET_ACCESORIES} from "./constants";
import Spinner from "../../components/Spinner/Spinner";

let id = 0;
function createData(name, calories, fat, carbs, protein) {
  id += 1;
  return { id, name, calories, fat, carbs, protein };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9)
];

export class InventoryPage extends Component {
  state = {
    loadingP: true,
    products:[""],
    loadingA: true,
    accesories:[""]
  };

  getProducts = async () => {
    try {
      console.log("starting query");
      // console.log(GET_SERVICES)
      // console.log(this.props)

      this.setState({ loadingP: true });
      const data =  await this.props.client.query({
        query: GET_PRODUCTS,
        options: {
          notifyOnNetworkStatusChange: true
        }
      });
      console.log("loaded products");
    //   if the network status is less then 7 then it is equivalent to data.loading
          console.log(data.data.products);
        //   console.log(data.loading);
        //   console.log(data.networkStatus);
        // console.log(data)
        this.setState({ 
          loadingP: false ,
          products:data.data.products
        });

    } catch (error) {
      console.log("error");
      console.log(error);
      if (error.graphQLErrors.length > 0)
        console.log(`error: ${error.graphQLErrors[0].message}`);
      this.setState({
        error: true
      });
    }
  };

  getAccesories = () => {
        this.props.client.query({
        query: GET_ACCESORIES,
        options: {
          notifyOnNetworkStatusChange: true
        }}).then((data)=>{
                console.log("loaded accessories")
                console.log(data.data.accessories)
                this.setState({ 
                    loadingA: false ,
                    accesories:data.data.accessories
                });
            }).catch((error)=>{
            console.log("error");
            console.log(error);
            if (error.graphQLErrors.length > 0)
              console.log(`error: ${error.graphQLErrors[0].message}`);
            this.setState({
              error: true
            });
        })
  };

  componentDidMount() {
    console.log("mounted");
    this.getProducts();
    this.getAccesories();
  }

  render() {
    const { classes } = this.props;
    console.log(this.state.loading)
    return (
      <Layout title="Inventario general">
        <h2>Productos</h2>
            <Paper className={classes.root}>
                {this.state.loadingP && <Spinner />}
                {!this.state.loadingP && 
                    <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                        <TableCell align="center">Imagen</TableCell>
                        <TableCell align="center">Nombre</TableCell>
                        <TableCell align="center">Cantidad Actual</TableCell>
                        <TableCell align="center">Cantidad total</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.products.map(product => (
                        <TableRow key={product._id}>
                            <TableCell align="center" component="th" scope="row">
                            <img
                                height={100}
                                // key={this.state.imageLink}
                                src={product.imageLinks[0]}
                                className={classes.img}
                                alt="producto"
                              />
                            </TableCell>
                            <TableCell align="center">{product.name}</TableCell>
                            <TableCell align="center">{product.totalQuantity}</TableCell>
                            <TableCell align="center">{product.currentQuantity}</TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                    </Table>
                }
            </Paper>
            {/* import Table from "../../components/Subcategory/Table"; */}
            {/* return (<Table subcategories={data.subcategories}
                                openEdit={this.handleClickOpenEditDialog}
                                openDelete={this.handleClickOpenDeleteDialog} />);
                        }} */}
       
        <h2>Accesorios</h2>
        <Paper className={classes.root}>
            {this.state.loadingA && <Spinner />}
            {!this.state.loadingA && 
                <Table className={classes.table}>
                    <TableHead>
                    <TableRow>
                        {/* <TableCell align="right">Nombre</TableCell> */}
                        <TableCell align="center">Nombre</TableCell>
                        <TableCell align="center">Cantidad Actual</TableCell>
                        <TableCell align="center">Cantidad total</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.accesories.map(accesory => (
                            <TableRow key={accesory._id}>
                                <TableCell align="center">{accesory.name}</TableCell>
                                <TableCell align="center">{accesory.totalQuantity}</TableCell>
                                <TableCell align="center">{accesory.currentQuantity}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            }
        </Paper>
      </Layout>
    );
  }
}

InventoryPage.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withApollo(withStyles(styles)(InventoryPage));
