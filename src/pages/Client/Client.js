import React, { Component } from "react";
import Layout from "../../containers/Layout/Layout";

//styles
import { styles } from "./constants"
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";

//Buttons
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";

//Table
import Table from "../../components/Client/Table";
//Dialog
import DeleteDialog from "../../components/Dialog/DeleteDialog";
import FormDialog from "../../containers/Client/FormDialog";

//graphql
import { Query, Mutation } from "react-apollo";
import Spinner from "../../components/Spinner/Spinner";
import { GET_CLIENTS, DELETE_CLIENT, EDIT_CLIENT, ADD_CLIENT } from "./constants"

export class ClientPage extends Component {
    state = {
        openDeleteDialog: false,
        openEditDialog: false,
        openAddDialog: false,
        selectedClient: { _id: "" },
    };

    handleOpenDeleteDialog = client => {
        this.setState({
            selectedClient: client,
            openDeleteDialog: true
        });
    };

    handleCloseDeleteDialog = () => {
        this.setState({ openDeleteDialog: false });
    };

    handleOpenEditDialog = client => {
        this.setState({
            selectedClient: client,
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
            <Layout title="Lista de clientes">
                <div className={classes.client}>
                    {/* GET */}
                    <Query query={GET_CLIENTS}>
                        {({ loading, error, data }) => {
                            if (loading)
                                return <Spinner />;
                            if (error) return <p>Error :(</p>;
                            return (<Table clients={data.clients}
                                openEdit={this.handleOpenEditDialog}
                                openDelete={this.handleOpenDeleteDialog} />);
                        }}
                    </Query>

                    {/* DELETE */}
                    <Mutation
                        mutation={DELETE_CLIENT}
                        update={(cache, { data: { deleteClient } }) => {
                            const { clients } = cache.readQuery({ query: GET_CLIENTS });
                            const clientIndex = clients.findIndex(
                                client => client._id === deleteClient._id
                            );
                            clients.splice(clientIndex, 1);
                            cache.writeQuery({
                                query: GET_CLIENTS,
                                data: { clients }
                            });
                        }}
                    >
                        {deleteClient => (
                            <DeleteDialog
                                info="cliente"
                                open={this.state.openDeleteDialog}
                                onConfirm={() => {
                                    deleteClient({
                                        variables: { id: this.state.selectedClient._id }
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
                    <Mutation mutation={EDIT_CLIENT}
                        update={(cache, { data: { updateClient } }) => {
                            const { clients } = cache.readQuery({ query: GET_CLIENTS });
                            let editedClientIndex = clients.findIndex(client => client._id === updateClient._id)
                            clients[editedClientIndex] = updateClient
                            cache.writeQuery({
                                query: GET_CLIENTS,
                                data: { clients }
                            });
                        }}>
                        {updateClient => (
                            <FormDialog
                                key={this.state.selectedClient._id}
                                client={this.state.selectedClient}
                                open={this.state.openEditDialog}
                                onConfirm={(client) => {
                                    updateClient({
                                        variables: { ...client }
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

                    <Mutation mutation={ADD_CLIENT}
                        update={(cache, { data: { createClient } }) => {
                            const { clients } = cache.readQuery({ query: GET_CLIENTS });
                            clients.push(createClient)
                            cache.writeQuery({
                                query: GET_CLIENTS,
                                data: { clients }
                            });
                        }}>
                        {createClient => (
                            <FormDialog
                                open={this.state.openAddDialog}
                                onConfirm={(client) => {
                                    createClient({
                                        variables: { ...client }
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

ClientPage.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ClientPage);
