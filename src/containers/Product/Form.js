import React, { Component } from "react";

import { Editor } from "react-draft-wysiwyg";
import { EditorState, ContentState } from "draft-js";
import FormLabel from "@material-ui/core/FormLabel/FormLabel";
import Input from "@material-ui/core/Input/Input"
import FormControlLabel from "@material-ui/core/FormControlLabel/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox/Checkbox"
import { convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import "../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import styles from "./styles";

import Spinner from "../../components/Spinner/Spinner";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
// import InputAdornment from "@material-ui/core/InputAdornment";

import { Query } from "react-apollo";
import Select from "react-select";
import InputLabel from "@material-ui/core/InputLabel";
// import Grid from "@material-ui/core/Grid";
import { GET_SUBCATEGORIES } from "../../pages/Subcategory/constants";
import { isNullOrUndefined } from "util";

export class Form extends Component {
  constructor(props) {
    super(props);

    console.log(props)
    let editorState = EditorState.createEmpty();
    let name = "";
    let imageLinks = [];
    let shortDescription = "";
    let subcategories = [];
    let generic = true;
    let quantity = 0;
    let codes = [""];


    if (props.product) {
      console.log(props.product);
      name = props.product.name ? props.product.name : "";
      shortDescription = props.product.shortDescription ? props.product.shortDescription : "";
      imageLinks = props.product.imageLinks ? props.product.imageLinks : [];
      subcategories = props.product.subcategories ? props.product.subcategories.map(subcategory => subcategory._id) : [];
      quantity = props.product.quantity ? props.product.quantity : 0;
      generic =  !isNullOrUndefined(props.product.generic) ? props.product.generic : true;
      codes = props.product.codes ? [...props.product.codes, ""] : [""];

      //editor
      const html = props.product.description;
      const contentBlock = htmlToDraft(html);
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
        editorState = EditorState.createWithContent(contentState);
      }
    }

    this.state = {
      name,
      shortDescription,
      editorState,
      imageLinks,
      subcategories,
      quantity,
      generic,
      codes,
      uploadingImages: false
    };
  }

  onEditorStateChange = editorState => {
    this.setState({
      editorState
    });
  };

  changeHandler = (name, event) => {
    this.setState({
      [name]: event.target.value
    });
  };

  changeCheckboxHandler = (name, event) => {
    this.setState({
      [name]: event.target.checked
    });
  };

  changeCodesHandler = (index, event) => {
    let codes = [...this.state.codes];

    if (codes[index] === "") {
      codes.push("")
    }

    codes[index] = event.target.value;

    if (codes[index] === "") {
      codes.splice(index, 1)
    }

    this.setState({
      codes
    })
  }


  changeImageHandler = event => {
    this.setState({ uploadingImages: true });

    var formData = new FormData();
    Array.from(event.target.files).forEach(image => {
      formData.append("files", image);
    });

    // headers: { "Content-Type": "multipart/form-data" },
    fetch(`${process.env.REACT_APP_SERVER_URL}/uploadImages`, {
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
        this.setState({ uploadingImages: false, imageLinks: resData });
        console.log(resData);
      })
      .catch(err => {
        this.setState({ uploadingImages: false });
        console.log(err);
      });
  };

  changeSubcategoriesHandler = options => {
    const subcategories = options.map(option => option.value);
    this.setState({
      subcategories
    });
  };

  onSubmitHandler = event => {
    event.preventDefault();

    const name = this.state.name;

    if (name === "") {
      return;
    }

    const generic = this.state.generic;
    let quantity = this.state.quantity;
    let codes = this.state.codes;

    if (generic) {
      codes = null;
    }
    else {
      codes.pop();
      quantity = codes.length;
    }


    let product = {
      name,
      generic,
      quantity,
      codes,
      imageLinks: this.state.imageLinks,
      shortDescription: this.state.shortDescription,
      subcategories: this.state.subcategories,
      description: draftToHtml(
        convertToRaw(this.state.editorState.getCurrentContent())
      ),
    };

    if (this.props.product) {
      product = { id: this.props.product._id, ...product };
    }
    console.log(product);
    this.props.onSubmit(product);
  };

  render() {
    const { classes } = this.props;
    return (
      <form className="product-form" onSubmit={this.onSubmitHandler}>

        <FormControlLabel
          control={
            <Checkbox
              checked={this.state.generic}
              onChange={this.changeCheckboxHandler.bind(this, 'generic')}
              value="generic"
            />
          }
          label="Producto genérico"
        />

        <TextField
          required
          autoFocus
          className={classes.textfield}
          margin="dense"
          label="Nombre"
          type="text"
          fullWidth
          value={this.state.name}
          onChange={this.changeHandler.bind(this, 'name')}
          error={this.state.name === ""}
          helperText={this.state.name === "" ? "Valor Requerido" : ""}
        />

        {this.state.generic && <TextField
          required
          autoFocus
          className={classes.textfield}
          margin="dense"
          label="Cantidad"
          type="number"
          fullWidth
          value={this.state.quantity}
          onChange={this.changeHandler.bind(this, "quantity")}
          error={this.state.quantity < 0}
          helperText={this.state.quantity < 0 ? "La cantidad debe ser un número positivo" : ""}
        />}

        {!this.state.generic &&
          <div className={classes.textfield}>
            <InputLabel>Códigos del producto</InputLabel>
            {this.state.codes.map((code, index) => {
              return (
                <Input fullWidth key={index} value={code} onChange={this.changeCodesHandler.bind(this, index)} />
              );
            })}
          </div>
        }

        {/* image */}
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

          {this.state.imageLinks && (
            <div className={classes.imgContainer}>
              {this.state.uploadingImage ? (
                <Spinner />
              ) : (
                  this.state.imageLinks.map(imageLink => (
                    <img
                      height={100}
                      key={imageLink}
                      className={classes.img}
                      src={imageLink}
                      alt="producto"
                    />
                  ))
                )}
            </div>
          )}
        </div>

        <TextField
          className={classes.textfield}
          margin="dense"
          label="Descripción corta"
          type="text"
          fullWidth
          value={this.state.shortDescription}
          onChange={this.changeHandler.bind(this, "shortDescription")}
        />

        <Query query={GET_SUBCATEGORIES}>
          {({ loading, error, data }) => {
            if (loading) return <Spinner />;
            if (error) return <p>Error :( recarga la página!</p>;

            const options = data.subcategories.map(subcategory => {
              return { value: subcategory._id, label: subcategory.name };
            });

            return (
              <div className={classes.textfield}>
                <InputLabel shrink htmlFor="subcategories">
                  Subcategorias
                    </InputLabel>
                <Select
                  id="subcategories"
                  value={options.filter(option =>
                    this.state.subcategories.includes(option.value)
                  )}
                  onChange={this.changeSubcategoriesHandler}
                  options={options}
                  isMulti
                />
              </div>
            );
          }}
        </Query>

        <div className={classes.textfield}>
          <FormLabel
            required
            error={!this.state.editorState.getCurrentContent().hasText()}
          >
            Características del producto
              </FormLabel>
          <Editor
            editorState={this.state.editorState}
            wrapperClassName={classes.wrapper}
            editorClassName={classes.editor}
            onEditorStateChange={this.onEditorStateChange}
          />
        </div>

        <Button type="submit" variant="contained" color="primary" autoFocus>
          Guardar
          </Button>
      </form>
    );
  }
}

Form.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Form);
