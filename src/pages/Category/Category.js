import React, { Component } from "react";
import Layout from "../../containers/Layout/Layout";

//styles
import { styles } from "./constants"
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";

//table
import Table from "../../components/Category/Table";

//Buttons
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";

//Dialog
import DeleteDialog from "../../components/Dialog/DeleteDialog";
import FormDialog from "../../containers/Category/FormDialog";

//graphql
import { Query, Mutation } from "react-apollo";
import CircularProgress from "@material-ui/core/CircularProgress";
import { GET_CATEGORIES, DELETE_CATEGORY, EDIT_CATEGORY, ADD_CATEGORY } from "./constants"

export class CategoryPage extends Component {
  state = {
    openDeleteDialog: false,
    openEditDialog: false,
    openAddDialog: false,
    selectedCategory: { _id: "" },
  };

  handleClickOpenDeleteDialog = category => {
    this.setState({
      selectedCategory: category,
      openDeleteDialog: true
    });
  };

  handleCloseDeleteDialog = () => {
    this.setState({ openDeleteDialog: false });
  };

  handleClickOpenEditDialog = category => {
    this.setState({
      selectedCategory: category,
      openEditDialog: true
    });
  };

  handleCloseEditDialog = () => {
    this.setState({ openEditDialog: false });
  };

  handleClickOpenAddDialog = () => {
    this.setState({ openAddDialog: true });
  };

  handleCloseAddDialog = () => {
    this.setState({ openAddDialog: false });
  };

  render() {
    const { classes } = this.props;
    return (
      <Layout title="Lista de categorias">
        <div className={classes.category}>
          {/* GET */}
          <Query query={GET_CATEGORIES}>
            {({ loading, error, data }) => {
              if (loading)
                return <CircularProgress className={classes.progress} />;
              if (error) return <p>Error :(</p>;
              return (<Table categories={data.categories}
                openEdit={this.handleClickOpenEditDialog}
                openDelete={this.handleClickOpenDeleteDialog} />);
            }}
          </Query>

          {/* DELETE */}
          <Mutation
            mutation={DELETE_CATEGORY}
            update={(cache, { data: { deleteCategory } }) => {
              const { categories } = cache.readQuery({ query: GET_CATEGORIES });
              const categoryIndex = categories.findIndex(
                category => category._id === deleteCategory._id
              );
              categories.splice(categoryIndex, 1);
              cache.writeQuery({
                query: GET_CATEGORIES,
                data: { categories: categories }
              });
            }}
          >
            {deleteCategory => (
              <DeleteDialog
                info="categoria"
                open={this.state.openDeleteDialog}
                onConfirm={() => {
                  deleteCategory({
                    variables: { id: this.state.selectedCategory._id }
                  });
                  this.setState({
                    selectedId: null,
                    openDeleteDialog: false
                  });
                }}
                onCancel={this.handleCloseDeleteDialog}
              />
            )}
          </Mutation>

          {/* EDIT */}
          <Mutation mutation={EDIT_CATEGORY}
            update={(cache, { data: { updateCategory } }) => {
              const { categories } = cache.readQuery({ query: GET_CATEGORIES });
              let editedCategoryIndex = categories.findIndex(category => category._id === updateCategory._id)
              categories[editedCategoryIndex] = updateCategory
              cache.writeQuery({
                query: GET_CATEGORIES,
                data: { categories: categories }
              });
            }}>
            {updateCategory => (
              <FormDialog
                key={this.state.selectedCategory._id}
                category={this.state.selectedCategory}
                open={this.state.openEditDialog}
                onConfirm={(category) => {
                  updateCategory({
                    variables: { ...category }
                  });
                  this.setState({
                    openEditDialog: false
                  });
                }}
                onCancel={this.handleCloseEditDialog}
              />
            )}
          </Mutation>

          {/* ADD */}
          <Fab className={classes.fab} color="primary" aria-label="Add" onClick={this.handleClickOpenAddDialog}>
            <AddIcon />
          </Fab>

          <Mutation mutation={ADD_CATEGORY}
            update={(cache, { data: { createCategory } }) => {
              const { categories } = cache.readQuery({ query: GET_CATEGORIES });
              categories.push(createCategory)
              cache.writeQuery({
                query: GET_CATEGORIES,
                data: { categories: categories }
              });
            }}>
            {createCategory => (
              <FormDialog
                open={this.state.openAddDialog}
                onConfirm={(category) => {
                  createCategory({
                    variables: { ...category }
                  });
                  this.setState({
                    openAddDialog: false
                  });
                }}
                onCancel={this.handleCloseAddDialog}
              />
            )}
          </Mutation>

        </div>
      </Layout>
    );
  }
}

CategoryPage.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(CategoryPage);
