const styles = theme => ({
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
  wrapper: {
    margin: "auto"
  },
  editor: {
    border: "1px solid lightgray",
    minHeight: "40vh"
  },
  button: {
    margin: theme.spacing.unit
  },
  input: {
    display: "none"
  },
  playerWrapper: {
    position: "relative",
    paddingTop: "56.25%" /* Player ratio: 100 / (1280 / 720) */
  },
  reactPlayer: {
    position: "absolute",
    top: 0,
    left: 0
  },
  formControl: {
    margin: theme.spacing.unit,
  },
});

export default styles;
