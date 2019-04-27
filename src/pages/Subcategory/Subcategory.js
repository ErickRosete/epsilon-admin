import React, { Component } from "react";
import Layout from "../../containers/Layout/Layout";

//styles
import { styles } from "./constants"
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";

//table
import Table from "../../components/Subcategory/Table";

//Buttons
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";

//Dialog
import DeleteDialog from "../../components/Dialog/DeleteDialog";
import FormDialog from "../../containers/Subcategory/FormDialog";


//graphql
import { Query, Mutation } from "react-apollo";
import CircularProgress from "@material-ui/core/CircularProgress";
import { GET_SUBCATEGORIES, DELETE_SUBCATEGORY, EDIT_SUBCATEGORY, ADD_SUBCATEGORY } from "./constants"

export class SubcategoryPage extends Component {
    state = {
        openDeleteDialog: false,
        openEditDialog: false,
        openAddDialog: false,
        selectedSubcategory: { _id: "" },
        uploading:false,
    };

    handleClickOpenDeleteDialog = subcategory => {
        this.setState({
            selectedSubcategory: subcategory,
            openDeleteDialog: true
        });
    };

    handleCloseDeleteDialog = () => {
        this.setState({ openDeleteDialog: false });
    };

    handleClickOpenEditDialog = subcategory => {
        this.setState({
            selectedSubcategory: subcategory,
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
            <Layout title="Lista de subcategorias">
                <div className={classes.subcategory}>
                    {/* GET */}
                    <Query query={GET_SUBCATEGORIES}>
                        {({ loading, error, data }) => {
                            if (loading)
                                return <CircularProgress className={classes.progress} />;
                            if (error) return <p>Error :(</p>;
                            return (<Table subcategories={data.subcategories}
                                openEdit={this.handleClickOpenEditDialog}
                                openDelete={this.handleClickOpenDeleteDialog} />);
                        }}
                    </Query>

                    {/* DELETE */}
                    <Mutation
                        mutation={DELETE_SUBCATEGORY}
                        update={(cache, { data: { deleteSubcategory } }) => {
                            function spliceNoMutate(myArray,indexToRemove) {
                                return myArray.slice(0,indexToRemove).concat(myArray.slice(indexToRemove+1));
                            }
                            const { subcategories } = cache.readQuery({ query: GET_SUBCATEGORIES });
                            console.log(subcategories)
                            const subcategoryIndex = subcategories.findIndex(
                                subcategory => subcategory._id === deleteSubcategory._id
                            );
                            //does not update
                            // subcategories.splice(subcategoryIndex, 1);
                            cache.writeQuery({
                                query: GET_SUBCATEGORIES,
                                //does not update
                                // data: { subcategories }
                                data:{subcategories:spliceNoMutate(subcategories,subcategoryIndex)}
                            });
                            console.log(cache)
                        }}
                    >
                        {deleteSubcategory => (
                            <DeleteDialog
                                info="subcategoria"
                                open={this.state.openDeleteDialog}
                                onConfirm={() => {
                                    deleteSubcategory({
                                        variables: { id: this.state.selectedSubcategory._id }
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
                    <Mutation mutation={EDIT_SUBCATEGORY}
                        update={(cache, { data: { updateSubcategory } }) => {
                            const { subcategories } = cache.readQuery({ query: GET_SUBCATEGORIES });
                            let editedSubcategoryIndex = subcategories.findIndex(subcategory => subcategory._id === updateSubcategory._id)
                            subcategories[editedSubcategoryIndex] = updateSubcategory
                            cache.writeQuery({
                                query: GET_SUBCATEGORIES,
                                data: { subcategories }
                            });
                        }}>
                        {updateSubcategory => (
                            <FormDialog
                                key={this.state.selectedSubcategory._id}
                                subcategory={this.state.selectedSubcategory}
                                open={this.state.openEditDialog}
                                onConfirm={(subcategory) => {
                                    updateSubcategory({
                                        variables: { ...subcategory }
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

                    <Mutation mutation={ADD_SUBCATEGORY}
                        update={(cache, { data: { createSubcategory } }) => {
                            // console.log(cache)
                            // console.log(createSubcategory)
                            const { subcategories } = cache.readQuery({ query: GET_SUBCATEGORIES });
                            function add(myArray,addedValue) {
                                return myArray.concat(addedValue)
                            }
                            //does not update
                            // subcategories.push(createSubcategory)
                            cache.writeQuery({
                                query: GET_SUBCATEGORIES,
                                //does not update
                                //     data: { subcategories }
                                data: { subcategories: add(subcategories,createSubcategory) }
                            });
                        }}>
                        {createSubcategory => (
                            <FormDialog
                                open={this.state.openAddDialog}
                                onConfirm={(subcategory) => {
                                    createSubcategory({
                                        variables: { ...subcategory }
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

SubcategoryPage.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SubcategoryPage);
