import React, { Component } from "react";
import Layout from "../../containers/Layout/Layout";

//styles
import { styles } from "./constants"
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import PromotionForm from "../../containers/Promotion/Form";

//graphql
import { Query, Mutation } from "react-apollo";
import Spinner from "../../components/Spinner/Spinner";
import { GET_PROMOTION, EDIT_PROMOTION } from "./constants"

export class PromotionPage extends Component {
    render() {
        const { classes } = this.props;
        return (
            <Layout title="Editar Promoción">
                <div className={classes.promotion}>
                    {/* GET */}
                    <Query query={GET_PROMOTION}>
                        {({ loading, error, data }) => {
                            console.log(data)
                            if (loading)
                                return <Spinner></Spinner>
                            if (error) return <p>Error :(</p>;
                            return (
                                < Mutation mutation={EDIT_PROMOTION} >
                                    {updatePromotion => (
                                        <PromotionForm
                                            promotion={data.firstPromotion}
                                            onSubmit={(promotion) => {
                                                updatePromotion({
                                                    variables: { ...promotion }
                                                });
                                                alert("Promoción guardada exitosamente")
                                            }}
                                        />
                                    )}
                                </Mutation>
                            );
                        }}
                    </Query>
                </div>
            </Layout >
        );
    }
}

PromotionPage.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(PromotionPage);
