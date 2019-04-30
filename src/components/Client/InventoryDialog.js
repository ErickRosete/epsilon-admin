import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button/Button";
import Spinner from "../Spinner/Spinner"
import Query from "react-apollo/Query";
import { GET_CLIENT_INVENTORY } from "./constants";

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
                Visualizar inventario de cliente
        </DialogTitle>

            <DialogContent style={{ minHeight: '50vh' }}>
                <Query query={GET_CLIENT_INVENTORY} variables={{ id: props.clientId }}>
                    {
                        ({ loading, error, data }) => {
                            if (loading)
                                return <Spinner />
                            if (error) return <p>Error :(</p>
                            const clientInventory = data.clientInventory;
                            if (clientInventory.inventoryProducts.length === 0)
                                return <h3>El cliente no cuenta con ningun producto en renta</h3>

                            const inventoryProducts = clientInventory.inventoryProducts;
                            const inventoryAccessories = clientInventory.inventoryAccessories;
                            return (
                                <React.Fragment>
                                    <h3>Productos</h3>
                                    <Table className={classes.table}>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell align="center">Nombre</TableCell>
                                                <TableCell align="center">Cantidad</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {inventoryProducts.map(invProd => (
                                                <TableRow key={invProd.product_id}>
                                                    <TableCell align="center">{invProd.product.name}</TableCell>
                                                    <TableCell align="center">{invProd.quantity}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                    <h3>Accesorios</h3>
                                    <Table className={classes.table}>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell align="center">Nombre</TableCell>
                                                <TableCell align="center">Cantidad</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {inventoryAccessories.map(invAcc => (
                                                <TableRow key={invAcc.accesory._id}>
                                                    <TableCell align="center">{invAcc.accesory.name}</TableCell>
                                                    <TableCell align="center">{invAcc.quantity}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </React.Fragment>
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
