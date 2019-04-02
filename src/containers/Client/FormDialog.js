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
    let email = "";
    let phone = "";
    let detail = "";

    if (props.client) {
      name = props.client.name ? props.client.name : "";
      email = props.client.email ? props.client.email : "";
      phone = props.client.phone ? props.client.phone : "";
      detail = props.client.detail ? props.client.detail : "";
    }

    this.state = {
      name, email, phone, detail
    }
  }

  changeHandler = (name, event) => {
    this.setState({
      [name]: event.target.value
    })
  }

  onConfirmHandler = () => {
    //validation
    if (this.state.name === "") {
      return;
    }

    //grouping info
    let client = {
      name: this.state.name,
      email: this.state.email,
      phone: this.state.phone,
      detail: this.state.detail
    }

    //adding id in edit
    if (this.props.client) {
      client = { ...client, id: this.props.client._id }
    }

    this.props.onConfirm(client);
  }

  render() {
    return (
      <Dialog
        open={this.props.open}
        onClose={this.props.handleClose}
        aria-labelledby="form-client-dialog"
      >
        <DialogTitle id="form-client-dialog">
          {this.props.category ? "Editar Cliente" : "Añadir Cliente"}
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
            autoFocus
            margin="normal"
            label="Correo electrónico"
            type="text"
            fullWidth
            value={this.state.email}
            onChange={this.changeHandler.bind(this, "email")}
          />

          <TextField
            autoFocus
            margin="normal"
            label="Teléfono"
            type="text"
            fullWidth
            value={this.state.phone}
            onChange={this.changeHandler.bind(this, "phone")}
          />

          <TextField
            autoFocus
            margin="normal"
            label="Detalle"
            type="text"
            fullWidth
            value={this.state.detail}
            onChange={this.changeHandler.bind(this, "detail")}
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
