import React from 'react'
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from '@material-ui/core/TableSortLabel';

import Paper from "@material-ui/core/Paper";
import Link from "react-router-dom/Link";
//Buttons
// import DeleteIcon from "@material-ui/icons/Delete";
// import EditIcon from "@material-ui/icons/Edit";
import PageViewIcon from "@material-ui/icons/Pageview"
import RentIcon from "@material-ui/icons/Forward"
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


const QuotationTable = props => {
    const { classes } = props;
    return (
        <Paper className={classes.tableRoot}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>
                            <TableSortLabel
                                active={props.orderBy === 'createdAt'}
                                direction={props.order}
                                onClick={props.sortHandler.bind(this, "createdAt")}>
                                Fecha de solicitud
                            </TableSortLabel>
                        </TableCell>
                        <TableCell>
                            <TableSortLabel
                                active={props.orderBy === 'name'}
                                direction={props.order}
                                onClick={props.sortHandler.bind(this, "name")}>
                                Cliente
                            </TableSortLabel>
                        </TableCell>
                        <TableCell>
                            <TableSortLabel
                                active={props.orderBy === 'company'}
                                direction={props.order}
                                onClick={props.sortHandler.bind(this, "company")}>
                                Empresa
                            </TableSortLabel>
                        </TableCell>
                        <TableCell>
                            <TableSortLabel
                                active={props.orderBy === 'email'}
                                direction={props.order}
                                onClick={props.sortHandler.bind(this, "email")}>
                                Correo
                            </TableSortLabel>
                        </TableCell>
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
                                <Link to={`rent/add/${row.client._id}`} style={{ textDecoration: 'none' }}>
                                    <Button
                                        variant="contained"
                                        aria-label="Add Rent"
                                        className={classes.button}
                                    >
                                        Renta
                                        <RentIcon className={classes.rightIcon} />
                                    </Button>
                                </Link>
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
