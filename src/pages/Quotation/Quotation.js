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
        orderBy: "createdAt",
        order: "desc",
        selectedQuotation: { _id: "", client: {}, productQuotations: [] },
        openDetailDialog: false
    };

    sortHandler = (orderBy) => {
        if (orderBy === this.state.orderBy) {
            this.setState({ order: this.state.order === 'desc' ? 'asc' : 'desc' })
        } else {
            this.setState({ orderBy, order: "desc" })
        }
    }
    
    comparisonFunction = (a, b) => {
        const order = this.state.order;
        if (a > b)
            return order === "desc" ? -1 : 1;
        if (a < b)
            return order === "desc" ? 1 : -1;
        return 0;
    }

    sortQuotations = (quotations) => {
        let sortedQuotations;
        const orderBy = this.state.orderBy;
        switch (orderBy) {
            case "createdAt": {
                sortedQuotations = quotations.sort((q1, q2) => this.comparisonFunction(new Date(q1.createdAt), new Date(q2.createdAt)))
                break;
            }
            default: {
                sortedQuotations = quotations.sort((q1, q2) => this.comparisonFunction(q1.client[orderBy], q2.client[orderBy]));
            }
        }
        return sortedQuotations;
    }

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
                                
                            const quotations = this.sortQuotations(data.quotations);
                            return (
                                <QuotationTable
                                    orderBy={this.state.orderBy}
                                    order={this.state.order}
                                    sortHandler={this.sortHandler}
                                    openQuotation={this.handleOpenQuotation}
                                    quotations={quotations}>
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
