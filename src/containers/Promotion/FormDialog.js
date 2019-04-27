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
    let imageLink = "";

    if (this.props.promotion) {
      name = this.props.promotion.name ? this.props.promotion.name : "";
      imageLink = this.props.promotion.imageLink ? this.props.promotion.imageLink : "";
    }

    this.state = {
      name,
      imageLink,
      uploadingImage: false,
    }
  }

  changeNameHandler = (event) => {
    this.setState({
      name: event.target.value
    })
  }

  changeImageHandler = event => {
    this.setState({ uploadingImage: true });

    var formData = new FormData();
    formData.append("folder", "promotionImages");
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
    let promotion = {
      name: this.state.name,
      imageLink: this.state.imageLink,
      active: true
    }

    //adding id in edit
    if (this.props.promotion) {
      promotion = { ...promotion, id: this.props.promotion._id }
    }

    this.props.onConfirm(promotion);
  }

  render() {
    const { classes } = this.props;

    return (
      <Dialog
        open={this.props.open}
        classes={{ paper: classes.dialog }}
        onClose={this.props.handleClose}
        aria-labelledby="form-promotion-dialog"
      >
        {this.props.subcategory ?
          <DialogTitle id="form-promotion-dialog">Editar Promoción</DialogTitle> :
          <DialogTitle id="form-promotion-dialog">Añadir Promoción</DialogTitle>}

        <DialogContent>
          <TextField
            required
            autoFocus
            margin="normal"
            label="Name"
            type="text"
            fullWidth
            className={classes.TextField}
            value={this.state.name}
            onChange={this.changeNameHandler}
            error={this.state.name === ""}
            helperText={this.state.name === "" ? "Valor Requerido" : ""}
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


            {this.state.uploadingImage ? (
                  <Spinner />): (
                   <p></p>
            )}
            
            {this.state.imageLink && (
              <div className={classes.imgContainer}>
                {this.state.uploadingImage ? (
                  <Spinner />
                ) : (
                    <img
                      height={100}
                      key={this.state.imageLink}
                      className={classes.img}
                      src={this.state.imageLink}
                      alt="promoción"
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