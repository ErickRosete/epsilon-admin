import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import Spinner from "../../components/Spinner/Spinner";
import { Query } from "react-apollo"

import InputLabel from '@material-ui/core/InputLabel';
import Select from 'react-select';

import { GET_SUBCATEGORIES } from "../../pages/Subcategory/constants";

export class FormDialog extends Component {
  constructor(props) {
    super(props);

    let name;
    let description;
    let subcategories;

    if (props.category) {
      name = props.category.name ? props.category.name : "";
      description = props.category.description ? props.category.description : "";
      subcategories = props.category.subcategories ?
        props.category.subcategories.map(subcategory => subcategory._id) :
        [];
    }
    else {
      name = "";
      description = "";
      subcategories = [];
    }

    this.state = {
      name, description, subcategories
    }
  }

  changeNameHandler = (event) => {
    this.setState({
      name: event.target.value
    })
  }

  changeDescriptionHandler = (event) => {
    this.setState({
      description: event.target.value
    })
  }

  changeSubcategoriesHandler = options => {
    const subcategories = options.map(option => option.value);
    this.setState({
      subcategories
    });
  };

  onConfirmHandler = () => {
    //validation
    if (this.state.name === "") {
      return;
    }

    //grouping info
    let category = {
      name: this.state.name,
      description: this.state.description,
      subcategories: this.state.subcategories,
    }

    //adding id in edit
    if (this.props.category) {
      category = { ...category, id: this.props.category._id }
    }

    this.props.onConfirm(category);
  }

  render() {
    return (
      <Dialog
        open={this.props.open}
        onClose={this.props.handleClose}
        aria-labelledby="form-category-dialog"
      >
        <DialogTitle id="form-category-dialog">
          {this.props.category ? "Editar Categoria" : "Añadir Categoria"}
        </DialogTitle>

        <DialogContent style={{ minHeight: '50vh' }}>
          <TextField
            required
            autoFocus
            margin="normal"
            label="Name"
            type="text"
            fullWidth
            value={this.state.name}
            onChange={this.changeNameHandler}
            error={this.state.name === ""}
            helperText={this.state.name === "" ? "Valor Requerido" : ""}
          />
          <TextField
            autoFocus
            margin="normal"
            label="Description"
            type="text"
            fullWidth
            value={this.state.description}
            onChange={this.changeDescriptionHandler}
          />

          <Query query={GET_SUBCATEGORIES}>
            {({ loading, error, data }) => {
              if (loading) return <Spinner />;
              if (error) return <p>Error :( recarga la página!</p>;

              const options = data.subcategories.map(subcategory => {
                return ({ value: subcategory._id, label: subcategory.name });
              })

              return (
                <div style={{ marginTop: '16px', marginBottom: '8px' }}>
                  <InputLabel shrink htmlFor="subcategories">Subcategorias</InputLabel>
                  <Select
                    id="subcategories"
                    value={options.filter(option => this.state.subcategories.includes(option.value))}
                    onChange={this.changeSubcategoriesHandler}
                    options={options}
                    isMulti
                  />
                </div>
              );
            }}
          </Query>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.onCancel} color="primary">
            Cancelar
          </Button>
          <Button onClick={this.onConfirmHandler} color="primary" autoFocus>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default FormDialog;
