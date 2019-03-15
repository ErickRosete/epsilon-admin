import React, { Component } from 'react'
import Layout from "../../containers/Layout/Layout"
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

import { Query } from "react-apollo";
import CircularProgress from "@material-ui/core/CircularProgress";
import { GET_ADDRESSES } from "./constants";

//Route
import Link from "react-router-dom/Link";

//Buttons
import Fab from "@material-ui/core/Fab";
import EditIcon from "@material-ui/icons/Edit";
import AddIcon from "@material-ui/icons/Add";


const styles = theme => ({
    address: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        backgroundColor: theme.palette.secondary.main,
        flexDirection: "column"
    },
    linea:{
        display:'flex'
    },
    // boton de agregar
    fab: {
        position: "fixed",
        bottom: theme.spacing.unit * 2,
        right: theme.spacing.unit * 2
    }
});

export class AddressPage extends Component {
  render() {
    const classes = this.props.classes;
    return (
        <Layout 
        title="Lista de direcciones">
            <div className={classes.address}>
                <h1>hola mundo</h1>
                <Query query={GET_ADDRESSES }>
                    {({ loading, error, data }) => {
                        if (loading)
                            return <CircularProgress className={classes.progress} />;
                        if (error) return <p>Error :(</p>;
                        console.log(data.addresses)
                        return (
                            // data.blog.map(tile => (
                            //             <p>{tile._id}</p>
                            // ))
                            // <p>data</p>
                            data.addresses.map(tile => (
                                <div className={classes.linea} key={tile._id}>
                                    {tile._id}
                                    <Link to={`address/edit/${tile._id}`}>
                                        <Fab
                                        color="primary"
                                        aria-label="Edit"
                                        className={classes.fabOptions}
                                        >
                                            <EditIcon />
                                        </Fab>
                                    </Link>
                                </div>
                            ))
                        );
                    }}
                </Query>
                <Link className={classes.fab} to="/address/add">
                    <Fab color="primary" aria-label="Add">
                    <AddIcon />
                    </Fab>
                </Link>
            </div>
        </Layout>
    )
  }
}

AddressPage.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AddressPage)
