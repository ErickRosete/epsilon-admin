import React, { Component } from "react";
import Layout from "../../containers/Layout/Layout";

//styles
import { styles } from "./constants"
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";

//table
import Table from "../../components/Accessory/Table";

//Buttons
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";

//Dialog
import DeleteDialog from "../../components/Dialog/DeleteDialog";
import FormDialog from "../../containers/Accessory/FormDialog";

//graphql
import { Query, Mutation } from "react-apollo";
import Spinner from "../../components/Spinner/Spinner"
import { GET_ACCESSORIES, ADD_ACCESSORY, EDIT_ACCESSORY, DELETE_ACCESSORY } from "./constants"

export class AccessoryPage extends Component {
  state = {
    openDeleteDialog: false,
    openEditDialog: false,
    openAddDialog: false,
    selectedAccessory: { _id: "" },
  };

  handleOpenDeleteDialog = accessory => {
    this.setState({
      selectedAccessory: accessory,
      openDeleteDialog: true
    });
  };

  handleCloseDeleteDialog = () => {
    this.setState({ openDeleteDialog: false });
  };

  handleOpenEditDialog = accessory => {
    this.setState({
      selectedAccessory: accessory,
      openEditDialog: true
    });
  };

  handleCloseEditDialog = () => {
    this.setState({ openEditDialog: false });
  };

  handleOpenAddDialog = () => {
    this.setState({ openAddDialog: true });
  };

  handleCloseAddDialog = () => {
    this.setState({ openAddDialog: false });
  };

  render() {
    const { classes } = this.props;
    return (
      <Layout title="Lista de accesorios">
        <div className={classes.accessory}>
          {/* GET */}
          <Query query={GET_ACCESSORIES}>
            {({ loading, error, data }) => {
              if (loading)
                return <Spinner />;
              if (error) return <p>Error :(</p>;
              return (<Table accessories={data.accessories}
                openEdit={this.handleOpenEditDialog}
                openDelete={this.handleOpenDeleteDialog} />);
            }}
          </Query>

          {/* DELETE */}
          <Mutation
            mutation={DELETE_ACCESSORY}
            update={(cache, { data: { deleteAccessory } }) => {
              const { accessories } = cache.readQuery({ query: GET_ACCESSORIES });
              const accessoryIndex = accessories.findIndex(
                accessory => accessory._id === deleteAccessory._id
              );
              accessories.splice(accessoryIndex, 1);
              cache.writeQuery({
                query: GET_ACCESSORIES,
                data: { accessories }
              });
            }}
          >
            {deleteAccessory => (
              <DeleteDialog
                info="accesorio"
                open={this.state.openDeleteDialog}
                onConfirm={() => {
                  deleteAccessory({
                    variables: { id: this.state.selectedAccessory._id }
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
          <Mutation mutation={EDIT_ACCESSORY}
            update={(cache, { data: { updateAccessory } }) => {
              const { accessories } = cache.readQuery({ query: GET_ACCESSORIES });
              let editedAccessoryIndex = accessories.findIndex(accessory => accessory._id === updateAccessory._id)
              accessories[editedAccessoryIndex] = updateAccessory
              cache.writeQuery({
                query: GET_ACCESSORIES,
                data: { accessories }
              });
            }}>
            {updateAccessory => (
              <FormDialog
                key={this.state.selectedAccessory._id}
                accessory={this.state.selectedAccessory}
                open={this.state.openEditDialog}
                onConfirm={(accessory) => {
                  updateAccessory({
                    variables: { ...accessory }
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
          <Fab className={classes.fab} color="primary" aria-label="Add" onClick={this.handleOpenAddDialog}>
            <AddIcon />
          </Fab>

          <Mutation mutation={ADD_ACCESSORY}
            update={(cache, { data: { createAccessory } }) => {
              const { accessories } = cache.readQuery({ query: GET_ACCESSORIES });
              accessories.push(createAccessory)
              cache.writeQuery({
                query: GET_ACCESSORIES,
                data: { accessories }
              });
            }}>
            {createAccessory => (
              <FormDialog
                open={this.state.openAddDialog}
                onConfirm={(accessory) => {
                  createAccessory({
                    variables: { ...accessory }
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

AccessoryPage.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(AccessoryPage);
