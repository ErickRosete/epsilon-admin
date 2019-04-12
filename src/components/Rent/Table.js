import React from 'react'
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

//Buttons
// import DeleteIcon from "@material-ui/icons/Delete";
// import EditIcon from "@material-ui/icons/Edit";
import PageViewIcon from "@material-ui/icons/Pageview"
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

const QuotationTable = (props) => {
    const { classes } = props;
    return (
        <Paper className={classes.tableRoot}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Fecha de solicitud</TableCell>
                        <TableCell>Cliente</TableCell>
                        <TableCell>Empresa</TableCell>
                        <TableCell>Correo</TableCell>
                        <TableCell align="right">acciones</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.quotations.map(row => (
                        <TableRow key={row._id}>
                            <TableCell component="th" scope="row">
                                {new Date(row.createdAt).toLocaleString()}
                            </TableCell>
                            <TableCell component="th" scope="row">
                                {row.client.name}
                            </TableCell>
                            <TableCell component="th" scope="row">
                                {row.client.company}
                            </TableCell>
                            <TableCell component="th" scope="row">
                                {row.client.email}
                            </TableCell>
                            <TableCell align="right">
                                <Button
                                    variant="contained"
                                    color="primary"
                                    aria-label="Edit"
                                    className={classes.button}
                                    onClick={props.openQuotation.bind(this, row)}
                                >
                                    Detalles
                                    <PageViewIcon className={classes.rightIcon} />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    )
}

QuotationTable.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(QuotationTable);
