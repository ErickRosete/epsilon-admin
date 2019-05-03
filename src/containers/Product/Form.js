import React, { Component } from "react";

import { Editor } from "react-draft-wysiwyg";
import { EditorState, ContentState } from "draft-js";
import FormLabel from "@material-ui/core/FormLabel/FormLabel";
import Input from "@material-ui/core/Input/Input"

import { convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

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
import { GET_ACCESSORIES } from "../../pages/Accessory/constants";

export class Form extends Component {
  constructor(props) {
    super(props);
    let editorState = EditorState.createEmpty();
    let name = "";
    let imageLinks = [];
    let shortDescription = "";
    let details = "";
    let subcategories = [];
    let accessories = [];
    let currentQuantity = 0;
    let totalQuantity = 0;
    let codes = [""];


    if (props.product) {
      console.log(props.product);
      name = props.product.name ? props.product.name : "";
      shortDescription = props.product.shortDescription ? props.product.shortDescription : "";
      imageLinks = props.product.imageLinks ? props.product.imageLinks : [];
      subcategories = props.product.subcategories ? props.product.subcategories.map(subcategory => subcategory._id) : [];
      accessories = props.product.accessories ? props.product.accessories.map(accessory => accessory._id) : [];
      totalQuantity = props.product.totalQuantity ? props.product.totalQuantity : 0;
      currentQuantity = props.product.currentQuantity ? props.product.currentQuantity : 0;
      codes = props.product.codes ? [...props.product.codes, ""] : [""];
      details = props.product.details ? props.product.details : "";

      console.log(accessories)
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
      accessories,
      totalQuantity,
      currentQuantity,
      codes,
      details,
      uploadingImages: false
    };
  }

  componentDidMount() {
    //start at top
    window.scrollTo(0, 0);
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
    formData.append("folder", "productImages");
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

  changeSelectHandler = (name, options) => {
    const selectedOptions = options.map(option => option.value);
    this.setState({
      [name]: selectedOptions
    });
  };

  onSubmitHandler = event => {
    event.preventDefault();

    const name = this.state.name;

    if (name === "") {
      return;
    }

    let codes = this.state.codes;
    codes.pop();
    let totalQuantity = codes.length;
    let currentQuantity = totalQuantity;

    let product = {
      name,
      totalQuantity,
      currentQuantity,
      codes,
      deleted: false,
      imageLinks: this.state.imageLinks,
      shortDescription: this.state.shortDescription,
      details: this.state.details,
      subcategories: this.state.subcategories,
      accessories: this.state.accessories,
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

        <div className={classes.textfield}>
          <InputLabel>Códigos del producto</InputLabel>
          {this.state.codes.map((code, index) => {
            return (
              <Input fullWidth key={index} value={code} onChange={this.changeCodesHandler.bind(this, index)} />
            );
          })}
        </div>

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


          {this.state.uploadingImage ? (
            <Spinner />) : (
              <p></p>
            )}

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

        {/* subcategorias */}
        <Query query={GET_SUBCATEGORIES}>
          {({ loading, error, data }) => {
            if (loading) return <Spinner />;
            if (error) return <p>Error :( recarga la página!</p>;

            const options = data.subcategories.map(subcategory => {
              return { value: subcategory._id, label: subcategory.name };
            });

            return (
              <div className={classes.textfield} >
                <InputLabel shrink htmlFor="subcategories">
                  Subcategorias
                    </InputLabel>
                <Select
                  maxMenuHeight={190}
                  id="subcategories"
                  value={options.filter(option =>
                    this.state.subcategories.includes(option.value)
                  )}
                  onChange={this.changeSelectHandler.bind(this, "subcategories")}
                  options={options}
                  isMulti
                />
              </div>
            );
          }}
        </Query>

        {/* accesorios */}
        <Query query={GET_ACCESSORIES}>
          {({ loading, error, data }) => {
            if (loading) return <Spinner />;
            if (error) return <p>Error :( recarga la página!</p>;
            console.log("accesorios ")
            console.log(data.accessories)
            // return(<p>great</p>)
            const options = data.accessories.map(accessory => {
              return { value: accessory._id, label: accessory.name };
            });
            console.log(options)
            console.log("accesorios del producto ")
            let filtrado = options.filter(option =>
              this.state.accessories.includes(option.value)
            )
            console.log(filtrado)
            return (
              <div className={classes.textfield} >
                <InputLabel shrink htmlFor="accessories"
                >
                  Accesorios
                    </InputLabel>
                <Select

                  id="accessories"
                  value={options.filter(option =>
                    this.state.accessories.includes(option.value)
                  )}
                  onChange={this.changeSelectHandler.bind(this, "accessories")}
                  options={options}
                  isMulti
                />
              </div>
            );
          }}
        </Query>

        <TextField
          className={classes.textfield}
          margin="dense"
          label="Descripción corta"
          type="text"
          fullWidth
          value={this.state.shortDescription}
          onChange={this.changeHandler.bind(this, "shortDescription")}
        />


        <TextField
          className={classes.textfield}
          margin="dense"
          label="Descripción larga"
          type="text"
          fullWidth
          value={this.state.details}
          onChange={this.changeHandler.bind(this, "details")}
        />

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
