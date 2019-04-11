import React, { Component } from "react";
import Layout from "../../containers/Layout/Layout";

import QuotationTable from "../../components/Quotation/Table"
import QuotationDetailDialog from "../../components/Quotation/DetailDialog"

//styles
import { styles } from "./constants"
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";

//graphql
import { Query } from "react-apollo";
import { GET_QUOTATIONS } from "./constants";
import Spinner from "../../components/Spinner/Spinner"

export class QuotationPage extends Component {
    state = {
        selectedQuotation: { _id: "", client: {}, productQuotations: [] },
        openDetailDialog: false
    };

    handleOpenQuotation = quotation => {
        console.log(quotation)
        this.setState({
            selectedQuotation: quotation,
            openDetailDialog: true
        });
    }

    handleCloseDetailDialog = () => {
        this.setState({
            openDetailDialog: false
        })
    }

    render() {
        const { classes } = this.props;
        return (
            <Layout title="Lista de cotizaciones">
                <div className={classes.quotation}>
                    {/* GET */}
                    <Query query={GET_QUOTATIONS}>
                        {({ loading, error, data }) => {
                            if (loading)
                                return <Spinner />;
                            if (error) return <p>Error :(</p>;
                            return (
                                <QuotationTable
                                    openQuotation={this.handleOpenQuotation}
                                    quotations={data.quotations}>
                                </QuotationTable>
                            );
                        }}
                    </Query>

                    <QuotationDetailDialog
                        open={this.state.openDetailDialog}
                        onClose={this.handleCloseDetailDialog}
                        quotation={this.state.selectedQuotation}
                    />

                </div>
            </Layout>
        );
    }
}

QuotationPage.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(QuotationPage);
