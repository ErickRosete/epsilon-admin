import React, { Component } from "react";

import { Editor } from "react-draft-wysiwyg";
import { EditorState, ContentState } from "draft-js";
import FormLabel from "@material-ui/core/FormLabel";
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
import InputAdornment from "@material-ui/core/InputAdornment";

import { Query } from "react-apollo";
import Select from "react-select";
import InputLabel from "@material-ui/core/InputLabel";
import Grid from "@material-ui/core/Grid";
import { GET_SUBCATEGORIES } from "../../pages/Subcategory/constants";

export class Form extends Component {
  constructor(props) {
    super(props);

    let editorState = EditorState.createEmpty();
    let name = "";
    let price = 0;
    let imageLinks = [];
    let shortDescription = "";
    let subcategories = [];

    if (props.product) {
      console.log(props.product);
      name = props.product.name ? props.product.name : "";
      price = props.product.price ? props.product.price : 0;
      shortDescription = props.product.shortDescription
        ? props.product.shortDescription
        : "";
      imageLinks = props.product.imageLinks ? props.product.imageLinks : [];

      subcategories = props.product.subcategories
        ? props.product.subcategories.map(subcategory => subcategory._id)
        : [];

      //editor
      const html = props.product.description;
      const contentBlock = htmlToDraft(html);
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(
          contentBlock.contentBlocks
        );
        editorState = EditorState.createWithContent(contentState);
      }
    }

    this.state = {
      name,
      price,
      shortDescription,
      editorState,
      imageLinks,
      subcategories,
      uploadingImages: false
    };
  }

  onEditorStateChange = editorState => {
    this.setState({
      editorState
    });
  };

  changeNameHandler = event => {
    this.setState({
      name: event.target.value
    });
  };

  changePriceHandler = event => {
    this.setState({
      price: +event.target.value
    });
  };

  changeSubnameHandler = event => {
    this.setState({
      subname: event.target.value
    });
  };

  changeShortDescriptionHandler = event => {
    this.setState({
      shortDescription: event.target.value
    });
  };

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
    const price = this.state.price;

    if (name === "" || price < 0) {
      return;
    }

    let product = {
      name,
      price,
      imageLinks: this.state.imageLinks,
      shortDescription: this.state.shortDescription,
      subcategories: this.state.subcategories,
      description: draftToHtml(
        convertToRaw(this.state.editorState.getCurrentContent())
      )
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
        <Grid container spacing={24} justify="center">
          <Grid item xs={8}>
            <TextField
              required
              autoFocus
              className={classes.textfield}
              margin="dense"
              label="Nombre"
              type="text"
              fullWidth
              value={this.state.name}
              onChange={this.changeNameHandler}
              error={this.state.name === ""}
              helperText={this.state.name === "" ? "Valor Requerido" : ""}
            />
          </Grid>

          <Grid item xs={4}>
            <TextField
              required
              autoFocus
              className={classes.textfield}
              margin="dense"
              label="Precio"
              type="number"
              fullWidth
              value={this.state.price}
              onChange={this.changePriceHandler}
              error={this.state.price < 0}
              helperText={
                this.state.price < 0
                  ? "El precio debe ser un número positivo"
                  : ""
              }
              InputProps={{
                inputProps: { min: 0, max: 100000, step: 0.01 },
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                )
              }}
            />
          </Grid>

          {/* image */}
          <Grid item xs={12}>
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
          </Grid>

          <Grid item xs={12}>
            <TextField
              className={classes.textfield}
              margin="dense"
              label="Descripción corta"
              type="text"
              fullWidth
              value={this.state.shortDescription}
              onChange={this.changeShortDescriptionHandler}
            />
          </Grid>

          <Grid item xs={12}>
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
          </Grid>

          <Grid item xs={12}>
            <div className={classes.textfield}>
              <FormLabel
                required
                error={!this.state.editorState.getCurrentContent().hasText()}
              >
                Contenido del blog
              </FormLabel>
              <Editor
                editorState={this.state.editorState}
                wrapperClassName={classes.wrapper}
                editorClassName={classes.editor}
                onEditorStateChange={this.onEditorStateChange}
              />
            </div>
          </Grid>

          <Button type="submit" variant="contained" color="primary" autoFocus>
            Guardar
          </Button>
        </Grid>
      </form>
    );
  }
}

Form.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Form);
