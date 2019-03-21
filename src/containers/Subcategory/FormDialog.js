import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import Spinner from "../../components/Spinner/Spinner"
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import styles from "./styles";

export class FormDialog extends Component {
  constructor(props) {
    super(props);

    let name = "";
    let description = "";
    let imageLink = "";
    if (this.props.subcategory) {
      name = this.props.subcategory.name ? this.props.subcategory.name : "";
      description = this.props.subcategory.description ? this.props.subcategory.description : "";
      imageLink = this.props.subcategory.imageLink ? this.props.subcategory.imageLink : "";
    }

    this.state = {
      name, description, imageLink, uploadingImage: false
    }
  }

  changeHandler = (name, event) => {
    this.setState({
      [name]: event.target.value
    })
  }

  changeImageHandler = event => {
    this.setState({ uploadingImage: true });

    var formData = new FormData();
    formData.append("file", event.target.files[0]);

    fetch(`${process.env.REACT_APP_SERVER_URL}/uploadImage`, {
      method: "POST",
      body: formData
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then(resData => {
        this.setState({ uploadingImage: false, imageLink: resData });
        console.log(resData);
      })
      .catch(err => {
        this.setState({ uploadingImage: false });
        console.log(err);
      });
  };

  onConfirmHandler = () => {
    //validation
    if (this.state.name === "") {
      return;
    }

    //grouping info
    let subcategory = {
      name: this.state.name,
      description: this.state.description,
      imageLink: this.state.imageLink
    }

    //adding id in edit
    if (this.props.subcategory) {
      subcategory = { ...subcategory, id: this.props.subcategory._id }
    }

    this.props.onConfirm(subcategory);
    this.setState({ name: "", description: "", imageLink: "" })
  }

  render() {
    const classes = this.props.classes;

    return (
      <Dialog
        open={this.props.open}
        onClose={this.props.handleClose}
        aria-labelledby="form-subcategory-dialog"
      >

        <DialogTitle id="form-subcategory-dialog">
          {this.props.subcategory ? "Editar Subcategoria" : "Añadir Subcategoria"}
        </DialogTitle>

        <DialogContent>
          <TextField
            required
            autoFocus
            margin="dense"
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
            margin="dense"
            label="Descripción"
            type="text"
            fullWidth
            value={this.state.description}
            onChange={this.changeHandler.bind(this, "description")}
          />

          <div className={classes.center}>
            <input
              accept="image/*"
              onChange={this.changeImageHandler}
              className={classes.input}
              id="contained-button-file"
              type="file"
              multiple={true}
            />
            <label htmlFor="contained-button-file">
              <Button
                variant="contained"
                component="span"
                className={classes.button}
              >
                Subir Imagenes
                </Button>
            </label>

            {this.state.imageLink && (
              <div className={classes.imgContainer}>
                {this.state.uploadingImage ? (
                  <Spinner />
                ) : (
                    <img
                      height={100}
                      key={this.state.imageLink}
                      src={this.state.imageLink}
                      className={classes.img}
                      alt="producto"
                    />
                  )}
              </div>
            )}
          </div>
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

FormDialog.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(FormDialog);
