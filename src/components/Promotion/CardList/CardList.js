import React from "react";
import Card from "./Card/Card";
import { withStyles } from "@material-ui/core/styles";

const styles = {
  cardList: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap"
  }
};

const CardList = props => {
  const { classes } = props;
  return (
    <div className={classes.cardList}>
      {props.promotions.map(promotion => {
        return (
          <Card
            key={promotion._id}
            openEdit={props.openEdit}
            openDelete={props.openDelete}
            promotion={promotion}
          />
        );
      })}
    </div>
  );
};

export default withStyles(styles)(CardList);
