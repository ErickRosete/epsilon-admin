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

    let name = "";
    let totalQuantity = 1;
    let code ="";
    if (props.accessory) {
      name = props.accessory.name ? props.accessory.name : "";
      totalQuantity = props.accessory.totalQuantity ? props.accessory.totalQuantity : 1;
      code = props.accessory.code ? props.accessory.code : "";

    }

    this.state = {
      name, totalQuantity,code
    }
  }

  changeHandler = (name, event) => {
    this.setState({
      [name]: event.target.value
    })
  }

  onConfirmHandler = () => {
    if (this.state.name === "") {
      return;
    }

    let accessory = {
      ...this.state,
      totalQuantity: +this.state.totalQuantity,
      deleted: false,
    }

    if (this.props.accessory) {
      accessory = { ...accessory, id: this.props.accessory._id }
    }

    this.props.onConfirm(accessory);
  }

  render() {
    return (
      <Dialog
        open={this.props.open}
        onClose={this.props.handleClose}
        aria-labelledby="form-accessory-dialog"
      >
        <DialogTitle id="form-accessory-dialog">
          {this.props.accessory ? "Editar Accesorio" : "Añadir Accesorio"}
        </DialogTitle>

        <DialogContent style={{ minHeight: '50vh' }}>
          <TextField
            required
            autoFocus
            margin="normal"
            label="Nombre"
            type="text"
            fullWidth
            value={this.state.name}
            onChange={this.changeHandler.bind(this, "name")}
            error={this.state.name === ""}
            helperText={this.state.name === "" ? "Valor Requerido" : ""}
          />
            <TextField
            required
            autoFocus
            margin="normal"
            label="Código"
            type="text"
            fullWidth
            value={this.state.code}
            onChange={this.changeHandler.bind(this, "code")}
          />
          <TextField
            autoFocus
            margin="normal"
            label="Cantidad"
            type="number"
            fullWidth
            value={this.state.totalQuantity}
            onChange={this.changeHandler.bind(this, "totalQuantity")}
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
