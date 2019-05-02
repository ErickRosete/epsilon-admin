import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button/Button";
import Spinner from "../Spinner/Spinner"
import Query from "react-apollo/Query";
import { GET_CLIENT_RENTS } from "./constants";
import Paper from '@material-ui/core/Paper/Paper';

//styles
import { styles } from "./constants"
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";

//Table
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

const InventoryDialog = (props) => {
    const classes = props.classes;

    return (
        <Dialog
            open={props.open}
            onClose={props.handleClose}
            aria-labelledby="inventory-dialog"
        >
            <DialogTitle id="inventory-dialog">
                Visualizar rentas de cliente
        </DialogTitle>

            <DialogContent className={classes.dialog}>
                <Query query={GET_CLIENT_RENTS} variables={{ id: props.clientId }}>
                    {
                        ({ loading, error, data }) => {
                            if (loading)
                                return <Spinner />
                            if (error) return <p>Error :(</p>
                            const clientRents = data.clientRents;
                            console.log(clientRents)

                            if (clientRents.length === 0)
                                return <h3>El cliente no cuenta con ninguna renta</h3>

                            return (
                                clientRents.map(rent => {
                                    return (
                                        <div key={rent._id} style={{ width: '100%' }}>
                                            <Paper className={classes.paper}>
                                                <h3 className={classes.center}>Renta de {new Date(rent.startDate).toLocaleDateString()} - {new Date(rent.endDate).toLocaleDateString()}</h3>
                                                <h4 className={classes.subtitle}>Productos</h4>
                                                <Table className={classes.table}>
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell className={classes.tableCell} align="center">Nombre</TableCell>
                                                            <TableCell className={classes.tableCell} align="center">Cantidad</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {rent.rentProducts.map(rentProd => (
                                                            <TableRow key={rentProd._id}>
                                                                <TableCell className={classes.tableCell} align="center">{rentProd.product.name}</TableCell>
                                                                <TableCell className={classes.tableCell} align="center">{rentProd.quantity}</TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                                <h4 className={classes.subtitle}>Accesorios</h4>
                                                <Table className={classes.table}>
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell className={classes.tableCell} align="center">Nombre</TableCell>
                                                            <TableCell className={classes.tableCell} align="center">Cantidad</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {rent.rentAccessories.map(rentAcc => (
                                                            <TableRow key={rentAcc._id}>
                                                                <TableCell className={classes.tableCell} align="center">{rentAcc.accessory.name}</TableCell>
                                                                <TableCell className={classes.tableCell} align="center">{rentAcc.quantity}</TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </Paper>
                                        </div>

                                    )
                                })

                            )
                        }
                    }
                </Query>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.onCancel} color="primary">
                    Cerrar
          </Button>
            </DialogActions>
        </Dialog>
    )
}


InventoryDialog.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(InventoryDialog);
