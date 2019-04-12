import React, { Component } from "react";
import Layout from "../../containers/Layout/Layout";

// import RentTable from "../../components/Rent/Table"
// import RentDetailDialog from "../../components/Rent/DetailDialog"

//styles
import { styles } from "./constants"
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";

//graphql
import { Query } from "react-apollo";
import { GET_RENTS } from "./constants";
import Spinner from "../../components/Spinner/Spinner"

import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import Link from "react-router-dom/Link";

export class RentPage extends Component {
    state = {
    };


    render() {
        const { classes } = this.props;
        return (
            <Layout title="Lista de rentas">
                <div className={classes.rent}>
                    {/* GET */}
                    <Query query={GET_RENTS}>
                        {({ loading, error, data }) => {
                            if (loading)
                                return <Spinner />;
                            if (error) return <p>Error :(</p>;
                            console.log(data)

                            if (data.rents.length === 0) {
                                return <h2>No se ha registrado ninguna renta</h2>
                            }


                            return (<div>soy una tabla</div>
                                // <QuotationTable
                                //     openQuotation={this.handleOpenQuotation}
                                //     quotations={data.quotations}>
                                // </QuotationTable>
                            );
                        }}
                    </Query>

                    {/* <QuotationDetailDialog
                        open={this.state.openDetailDialog}
                        onClose={this.handleCloseDetailDialog}
                        quotation={this.state.selectedQuotation}
                    /> */}

                    <Link className={classes.fab} to="/rent/add">
                        <Fab color="primary" aria-label="Add">
                            <AddIcon />
                        </Fab>
                    </Link>
                </div>
            </Layout>
        );
    }
}

RentPage.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(RentPage);
