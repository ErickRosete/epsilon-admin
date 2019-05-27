import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Paper from '@material-ui/core/Paper';

import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import styles from "./styles";
import promotionImg from "../../assets/images/discounts/promotion.png"

import "./promotion.css"


export class PromotionForm extends Component {
  constructor(props) {
    super(props);

    let id = "";
    let title = "";
    let subtitle = "";
    let percentage = "";

    if (this.props.promotion) {
      id = this.props.promotion._id ? this.props.promotion._id : "";
      title = this.props.promotion.title ? this.props.promotion.title : "";
      subtitle = this.props.promotion.subtitle ? this.props.promotion.subtitle : "";
      percentage = this.props.promotion.percentage ? this.props.promotion.percentage : "";
    }

    this.state = {
      id,
      title,
      subtitle,
      percentage,
    }
  }

  changeHandler = (name, event) => {
    this.setState({
      [name]: event.target.value
    })
  }

  onConfirmHandler = () => {
    //validation
    if (this.state.title === "") {
      return;
    }

    //grouping info
    let promotion = {
      ...this.state
    }

    this.props.onSubmit(promotion);
  }

  render() {
    const { classes } = this.props;

    return (
      <Paper className={classes.paper} elevation={1}>
        <TextField
          required
          autoFocus
          margin="normal"
          label="Título"
          type="text"
          fullWidth
          className={classes.TextField}
          value={this.state.title}
          onChange={this.changeHandler.bind(this, "title")}
          error={this.state.title === ""}
          helperText={this.state.title === "" ? "Valor Requerido" : ""}
        />

        <TextField
          required
          autoFocus
          margin="normal"
          label="Subtítulo"
          type="text"
          fullWidth
          className={classes.TextField}
          value={this.state.subtitle}
          onChange={this.changeHandler.bind(this, "subtitle")}
        />

        <TextField
          required
          autoFocus
          margin="normal"
          label="Porcentaje"
          type="text"
          fullWidth
          className={classes.TextField}
          value={this.state.percentage}
          onChange={this.changeHandler.bind(this, "percentage")}
        />

        <Button style={{ margin: 'auto', marginTop: '1rem', display: "block" }} onClick={this.onConfirmHandler} variant="contained" color="primary" autoFocus>
          Confirmar
        </Button>

        <div>
          <p>Vista Previa</p>
          <div className="promotion">
            <img src={promotionImg} alt="Promoción" />
            <div className="promotion-first-bg"></div>
            <div className="promotion-second-bg">
              <p className="promotion-percentage">{this.state.percentage}</p>
              <div>
                <p className="promotion-title">{this.state.title}</p>
                <p className="promotion-subtitle">{this.state.subtitle}</p>
              </div>
            </div>
          </div>
        </div>
      </Paper>

    );
  }
}
PromotionForm.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(PromotionForm);