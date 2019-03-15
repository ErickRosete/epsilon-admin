import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";

export class FormDialog extends Component {
  constructor(props) {
    super(props);

    let name;
    let description;
    if (this.props.subcategory) {
      name = this.props.subcategory.name ? this.props.subcategory.name : "";
      description = this.props.subcategory.description ? this.props.subcategory.description : "";
    }
    else {
      name = "";
      description = "";
    }

    this.state = {
      name, description
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

  onConfirmHandler = () => {
    //validation
    if (this.state.name === "") {
      return;
    }

    //grouping info
    let subcategory = {
      name: this.state.name,
      description: this.state.description
    }

    //adding id in edit
    if (this.props.subcategory) {
      subcategory = { ...subcategory, id: this.props.subcategory._id }
    }

    this.props.onConfirm(subcategory);
  }

  render() {
    return (
      <Dialog
        open={this.props.open}
        onClose={this.props.handleClose}
        aria-labelledby="form-subcategory-dialog"
      >
        {this.props.subcategory ?
          <DialogTitle id="form-subcategory-dialog">Editar Subcategoria</DialogTitle> :
          <DialogTitle id="form-subcategory-dialog">Añadir Subcategoria</DialogTitle>}

        <DialogContent>
          <TextField
            required
            autoFocus
            margin="dense"
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
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            value={this.state.description}
            onChange={this.changeDescriptionHandler}
          />
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
