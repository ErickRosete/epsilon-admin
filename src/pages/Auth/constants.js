import gql from "graphql-tag";

export const LOGIN = gql`
  query Login($email: String, $password: String) {
    login(userInput: { email: $email, password: $password }) {
      userId
      token
      tokenExpiration
      role
    }
  }
`;

export const styles = theme => ({
  authRoot: {
    height: "100vh",
    display: "flex",
    backgroundColor: theme.palette.primary.main
  },
  authForm: {
    width: "25rem",
    maxWidth: "80%",
    margin: "auto",
    backgroundColor: "white",
    padding: "3rem",
    border: `1px solid ${theme.palette.primary.main}`,
    borderRadius: ".5rem"
  },
  title: {
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginBottom: "2rem",
    // backgroundColor: "black"
  },
  button: {
    display: "block",
    marginTop: "2rem",
    marginLeft: "auto"
  },
  image: {
    width: "100%",
    backgroundColor: 'rgba(96, 125, 139, 0.75)',
    padding: '1rem',
    borderRadius: '3px'
  }
});
