const styles = theme => ({
  paper: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
  dialog: {
    minWidth: "20rem",
    maxWidth: "90%"
  },
  textfield: {
    margin: theme.spacing.unit
  },
  center: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  imgContainer: {
    display: "flex",
    maxWidth: "45vw",
    overflowX: "auto",
    overflowY: "hidden"
  },
  img: {
    margin: theme.spacing.unit
  },
  button: {
    margin: theme.spacing.unit
  },
  input: {
    display: "none"
  }
});

export default styles;
