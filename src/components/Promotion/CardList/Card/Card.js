import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
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

const PromotionCard = props => {
  const { classes, promotion } = props;
  return (
    <Card className={classes.card}>
      <CardActionArea>
        <CardMedia
          className={classes.media}
          image={promotion.imageLink}
          title={promotion.name}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {promotion.name}
          </Typography>
        </CardContent>
      </CardActionArea>

      <CardActions>
        <Button
          variant="contained"
          color="primary"
          aria-label="Edit"
          className={classes.button}
          onClick={props.openEdit.bind(this, promotion)}
        >
          Editar
          <EditIcon className={classes.rightIcon} />
        </Button>

        <Button
          variant="contained"
          color="secondary"
          aria-label="Delete"
          className={classes.button}
          onClick={props.openDelete.bind(this, promotion)}
        >
          Eliminar
          <DeleteIcon className={classes.rightIcon} />
        </Button>
      </CardActions>
    </Card>
  );
};

PromotionCard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(PromotionCard);
