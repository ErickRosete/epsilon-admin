import React, { Component } from "react";

// import { Editor } from "react-draft-wysiwyg";
// import { EditorState, ContentState } from "draft-js";
// import FormLabel from "@material-ui/core/FormLabel/FormLabel";
// import Input from "@material-ui/core/Input/Input"
// import FormControlLabel from "@material-ui/core/FormControlLabel/FormControlLabel";
// import Checkbox from "@material-ui/core/Checkbox/Checkbox"
// import { convertToRaw } from "draft-js";
// import draftToHtml from "draftjs-to-html";
// import htmlToDraft from "html-to-draftjs";
// import "../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import styles from "./styles";

// import Spinner from "../../components/Spinner/Spinner";
// import TextField from "@material-ui/core/TextField";
// import Button from "@material-ui/core/Button";
// import InputAdornment from "@material-ui/core/InputAdornment";


export class Form extends Component {


  render() {
    // const { classes } = this.props;
    return (
      <p>Campos para orden de renta</p>
    );
  }
}

Form.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Form);
