import React from 'react'
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

//Buttons
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import Button from "@material-ui/core/Button";

//wrappers
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";

const styles = theme => ({
    tableRoot: {
        marginTop: theme.spacing.unit * 2,
        display: 'flex',
        overflowX: 'auto',
        overflowY: 'hidden',
        minWidth: '80%',
    },
    button: {
        margin: theme.spacing.unit
    },
    rightIcon: {
        marginLeft: theme.spacing.unit
    }
});

const ClientTable = (props) => {
    const { classes } = props;
    return (
        <Paper className={classes.tableRoot}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Nombre</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Empresa</TableCell>
                        <TableCell align="right">acciones</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.clients.map(row => (
                        <TableRow key={row._id}>
                            <TableCell component="th" scope="row">
                                {row.name}
                            </TableCell>
                            <TableCell component="th" scope="row">
                                {row.email}
                            </TableCell>
                            <TableCell component="th" scope="row">
                                {row.company}
                            </TableCell>
                            <TableCell align="right">
                                <Button
                                    variant="contained"
                                    color="primary"
                                    aria-label="Edit"
                                    className={classes.button}
                                    onClick={props.openEdit.bind(this, row)}
                                >
                                    Editar
                              <EditIcon className={classes.rightIcon} />
                                </Button>

                                <Button
                                    variant="contained"
                                    color="secondary"
                                    aria-label="Delete"
                                    className={classes.button}
                                    onClick={props.openDelete.bind(this, row)}
                                >
                                    Eliminar
                              <DeleteIcon className={classes.rightIcon} />
                                </Button>

                                <Button
                                    variant="contained"
                                    aria-label="Inventory"
                                    className={classes.button}
                                    onClick={props.openInventory.bind(this, row)}
                                >
                                    Productos en renta
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    )
}

ClientTable.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ClientTable);
