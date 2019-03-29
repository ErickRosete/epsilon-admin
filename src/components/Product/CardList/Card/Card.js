import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Link from "react-router-dom/Link";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";

import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";

import Typography from "@material-ui/core/Typography";

const styles = theme => ({
  card: {
    display: "flex",
    flexDirection: "column",
    maxWidth: 345,
    margin: "1rem"
  },
  media: {
    height: 140
  },
  button: {
    margin: theme.spacing.unit
  },
  link: {
    textDecoration: "none"
  },
  rightIcon: {
    marginLeft: theme.spacing.unit
  }
});

const ProductCard = props => {
  const { classes, product } = props;
  return (
    <Card className={classes.card}>
      <Link className={classes.link} to={`product/edit/${product._id}`}>
        <CardActionArea>
          <CardMedia
            className={classes.media}
            image={product.imageLinks ? product.imageLinks[0] : "/placeholder"}
            title={product.name}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {product.name}
            </Typography>
            <Typography component="p">{product.shortDescription}</Typography>
          </CardContent>
        </CardActionArea>
      </Link>

      <CardActions>
        <Link className={classes.link} to={`product/edit/${product._id}`}>
          <Button
            variant="contained"
            color="primary"
            aria-label="Edit"
            className={classes.button}
          >
            Editar
            <EditIcon className={classes.rightIcon} />
          </Button>
        </Link>
        <Button
          variant="contained"
          color="secondary"
          aria-label="Edit"
          className={classes.button}
          onClick={props.openDeleteDialog.bind(this, product._id)}
        >
          Eliminar
          <DeleteIcon className={classes.rightIcon} />
        </Button>
      </CardActions>
    </Card>
  );
};

ProductCard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ProductCard);
