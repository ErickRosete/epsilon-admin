import React, { Component } from "react";
import Layout from "../../containers/Layout/Layout";
import Link from "react-router-dom/Link";

import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

import Spinner from "../../components/Spinner/Spinner";
import { DELETE_PRODUCT, GET_PRODUCTS } from "./constants";

import CardList from "../../components/Product/CardList/CardList";
import TextField from "@material-ui/core/TextField";
import SearchIcon from "@material-ui/icons/Search";
import InputAdornment from "@material-ui/core/InputAdornment/InputAdornment";

import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";

//Buttons
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
// import Button from "@material-ui/core/Button";

//Dialog
import DeleteDialog from "../../components/Dialog/DeleteDialog";
import { Query, Mutation } from "react-apollo";

const styles = theme => ({
  product: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    flexDirection: "column"
  },
  fab: {
    position: "fixed",
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2
  }
});

export class ProductPage extends Component {
  state = {
    openDialog: false,
    selectedId: null,
    filter: "",
    currentPage: 1
  };

  handleClickOpenDeleteDialog = id => {
    this.setState({
      selectedId: id,
      openDialog: true
    });
  };

  handleCloseDialog = () => {
    this.setState({ openDialog: false });
  };

  handleFilterChange = event => {
    this.setState({ filter: event.target.value });
  };

  handleChangePage = page => {
    this.setState({
      currentPage: page
    });
  };

  render() {
    const itemsPerPage = 9;
    const { classes } = this.props;
    return (
      <Layout title="Lista de productos">
        <div className={classes.product}>
          <TextField
            autoFocus
            margin="normal"
            label="Busqueda"
            type="text"
            value={this.state.filter}
            onChange={this.handleFilterChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon />
                </InputAdornment>
              )
            }}
          />

          <Query query={GET_PRODUCTS}>
            {({ loading, error, data }) => {
              console.log("productos")
              console.log(data.products)
              if (loading) return <Spinner />;
              if (error) return <p>Error :( recarga la pagina!</p>;

              let filteredProducts = data.products ? data.products : [];

              if (this.state.filter) {
                const filter = this.state.filter.toUpperCase();
                filteredProducts = data.products.filter(
                  product =>
                    product.name.toUpperCase().includes(filter) ||
                    product.price.toString().includes(filter) ||
                    product.shortDescription.toUpperCase().includes(filter) ||
                    product.description.toUpperCase().includes(filter)
                );
              }

              //pagination logic
              const first = (this.state.currentPage - 1) * itemsPerPage;
              const lastAux = this.state.currentPage * itemsPerPage;
              const last = lastAux > filteredProducts.length
                ? filteredProducts.length
                : lastAux;

              return (
                <React.Fragment>
                  <CardList
                    products={filteredProducts.slice(first, last)}
                    openDeleteDialog={this.handleClickOpenDeleteDialog}
                  />
                  <Pagination
                    onChange={this.handleChangePage}
                    current={this.state.currentPage}
                    total={filteredProducts.length}
                    defaultPageSize={itemsPerPage}
                  />
                </React.Fragment>
              );
            }}
          </Query>

          <Mutation
            mutation={DELETE_PRODUCT}
            update={(cache, { data: { deleteProduct } }) => {
              function spliceNoMutate(myArray,indexToRemove) {
                return myArray.slice(0,indexToRemove).concat(myArray.slice(indexToRemove+1));
              }
              const { products } = cache.readQuery({ query: GET_PRODUCTS });
              const productIndex = products.findIndex(
                product => product._id === deleteProduct._id
              );
              //does not update
              // products.splice(productIndex, 1);
              cache.writeQuery({
                query: GET_PRODUCTS,
                //does not update
                // data: { products }
                data:{products:spliceNoMutate(products ,productIndex)}
              });
            }}
          >
            {deleteProduct => (
              <DeleteDialog
                info="producto"
                open={this.state.openDialog}
                onConfirm={() => {
                  deleteProduct({
                    variables: { id: this.state.selectedId }
                  });
                  this.setState({
                    selectedId: null,
                    openDialog: false
                  });
                }}
                onCancel={this.handleCloseDialog}
              />
            )}
          </Mutation>

          <Link className={classes.fab} to="/product/add">
            <Fab color="primary" aria-label="Add">
              <AddIcon />
            </Fab>
          </Link>
        </div>
      </Layout>
    );
  }
}

ProductPage.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ProductPage);
