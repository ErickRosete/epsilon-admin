import React, { Component } from "react";
import Redirect from "react-router-dom/Redirect";
import Spinner from "../../../components/Spinner/Spinner";
import Layout from "../../../containers/Layout/Layout";
import Form from "../../../containers/Rent/Form";
import { Query, Mutation } from "react-apollo";

import { GET_RENT, ADD_RENT, EDIT_RENT } from "../constants";

class RentFormPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            return: false
        };
    }

    render() {
        return (
            <Layout title={this.props.match.params.id ? "Editar orden de renta" : "Añadir orden de renta"}>

                {this.state.return && <Redirect push to="/rent"></Redirect>}

                {this.props.match.params.id ? (
                    // Edit
                    <Query query={GET_RENT} variables={{ id: this.props.match.params.id }}>
                        {({ loading, error, data }) => {
                            if (loading) return <Spinner />;
                            if (error) return <p>Error :( recarga la página!</p>;
                            return (
                                <Mutation mutation={EDIT_RENT} >
                                    {updateRent => (
                                        <Form
                                            rent={data.rent}
                                            onSubmit={rent => {
                                                updateRent({
                                                    variables: { ...rent }
                                                });
                                                this.setState({ return: true })
                                            }}
                                        />
                                    )}
                                </Mutation>
                            );
                        }}
                    </Query>
                ) : (
                        // ADD
                        <Mutation mutation={ADD_RENT}
                            update={(cache, { data: { createRent } }) => {
                                const { rents } = cache.readQuery({ query: GET_RENT });
                                rents.push(createRent);
                                cache.writeQuery({
                                    query: GET_RENT,
                                    data: { rents }
                                });
                            }}
                        >
                            {createRent => (
                                <Form clientId={this.props.match.params.clientId}
                                    onSubmit={rent => {
                                        createRent({
                                            variables: { ...rent }
                                        });
                                        this.setState({ return: true })
                                    }}
                                />
                            )}
                        </Mutation>
                    )
                }
            </Layout>
        );
    }
}

export default RentFormPage;
