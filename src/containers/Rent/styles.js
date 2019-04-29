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
  //buscador de producto
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: 400,
  },
  input: {
    marginLeft: 8,
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  //buscador producto textfield
  margin: {
    margin: theme.spacing.unit,
  },
  textField: {
    flexBasis: 200,
  },
 
});

export default styles;
