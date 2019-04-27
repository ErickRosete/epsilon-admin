import React, { Component } from "react";
import Layout from "../../containers/Layout/Layout";

//styles
import { styles } from "./constants"
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";

import CardList from "../../components/Promotion/CardList/CardList";

//Buttons
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";

//Dialog
import DeleteDialog from "../../components/Dialog/DeleteDialog";
import FormDialog from "../../containers/Promotion/FormDialog";

//graphql
import { Query, Mutation } from "react-apollo";
import Spinner from "../../components/Spinner/Spinner";
import { GET_PROMOTIONS, DELETE_PROMOTION, EDIT_PROMOTION, ADD_PROMOTION } from "./constants"

export class PromotionPage extends Component {
    state = {
        openDeleteDialog: false,
        openEditDialog: false,
        openAddDialog: false,
        selectedPromotion: { _id: "" },
    };

    handleClickOpenDeleteDialog = promotion => {
        this.setState({
            selectedPromotion: promotion,
            openDeleteDialog: true
        });
    };

    handleCloseDeleteDialog = () => {
        this.setState({ openDeleteDialog: false });
    };

    handleClickOpenEditDialog = promotion => {
        this.setState({
            selectedPromotion: promotion,
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
            <Layout title="Lista de promociones">
                <div className={classes.promotion}>
                    {/* GET */}
                    <Query query={GET_PROMOTIONS}>
                        {({ loading, error, data }) => {
                            if (loading)
                                return <Spinner></Spinner>
                            if (error) return <p>Error :(</p>;
                            return (<CardList promotions={data.promotions}
                                openEdit={this.handleClickOpenEditDialog}
                                openDelete={this.handleClickOpenDeleteDialog} />);
                        }}
                    </Query>

                    {/* DELETE */}
                    <Mutation
                        mutation={DELETE_PROMOTION}
                        update={(cache, { data: { deletePromotion } }) => {
                            function spliceNoMutate(myArray,indexToRemove) {
                                return myArray.slice(0,indexToRemove).concat(myArray.slice(indexToRemove+1));
                            }
                            const { promotions } = cache.readQuery({ query: GET_PROMOTIONS });
                            const promotionIndex = promotions.findIndex(
                                promotion => promotion._id === deletePromotion._id
                            );
                            //does not update
                            // promotions.splice(promotionIndex, 1);
                            cache.writeQuery({
                                query: GET_PROMOTIONS,
                                // does not update
                                // data: { promotions }
                                data:{promotions:spliceNoMutate(promotions ,promotionIndex)}
                            });
                        }}
                    >
                        {deletePromotion => (
                            <DeleteDialog
                                info="promoción"
                                open={this.state.openDeleteDialog}
                                onConfirm={() => {
                                    deletePromotion({
                                        variables: { id: this.state.selectedPromotion._id }
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
                    <Mutation mutation={EDIT_PROMOTION}>
                        {updatePromotion => (
                            <FormDialog
                                key={this.state.selectedPromotion._id}
                                promotion={this.state.selectedPromotion}
                                open={this.state.openEditDialog}
                                onConfirm={(promotion) => {
                                    updatePromotion({
                                        variables: { ...promotion }
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

                    <Mutation mutation={ADD_PROMOTION}
                        update={(cache, { data: { createPromotion } }) => {
                            function add(myArray,addedValue) {
                                return myArray.concat(addedValue)
                            }
                            const { promotions } = cache.readQuery({ query: GET_PROMOTIONS });
                            //does not update
                            // promotions.push(createPromotion)
                            cache.writeQuery({
                                query: GET_PROMOTIONS,
                                //does not update
                                // data: { promotions }
                                data: { promotions: add(promotions,createPromotion) }
                            });
                        }}>
                        {createPromotion => (
                            <FormDialog
                                open={this.state.openAddDialog}
                                onConfirm={(promotion) => {
                                    createPromotion({
                                        variables: { ...promotion }
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

PromotionPage.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(PromotionPage);
