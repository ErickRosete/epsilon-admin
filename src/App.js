import React, { Component } from "react";

//theme
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { blueGrey, red } from "@material-ui/core/colors";
import CssBaseline from "@material-ui/core/CssBaseline";
import "./App.css";

//routes
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import AuthPage from "./pages/Auth/Auth";
import CategoryPage from "./pages/Category/Category";
import SubcategoryPage from "./pages/Subcategory/Subcategory";
import ProductPage from "./pages/Product/Product";
import ProductFormPage from "./pages/Product/Form/ProductForm";
import AddressPage from "./pages/Address/Address";
import AddressesPage from "./pages/Address/Addresses";
import AddressFormPage from "./pages/Address/Form/AddressForm";
import PromotionPage from "./pages/Promotion/Promotion";
import ClientPage from "./pages/Client/Client";

//Providers and context
import { ApolloProvider } from "react-apollo";
import ApolloClient from "apollo-boost";
import AuthContext from "./context/auth-context";

const client = new ApolloClient({
  uri: `${process.env.REACT_APP_SERVER_URL}/graphql`
});

class App extends Component {
  state = {
    token: null,
    userId: null
  };

  constructor(props) {
    super(props);
    const data = JSON.parse(localStorage.getItem("jwtToken"));
    if (data) {
      this.state = {
        ...data
      };
    }
  }

  login = (token, userId, tokenExpiration, role) => {

    // https://medium.com/@rajaraodv/securing-react-redux-apps-with-jwt-tokens-fcfe81356ea0
    //If you use localStorage instead of sessionStorage, then this will persist across tabs and new windows.
    //sessionStorage = persists only in current tab
    // https://stackoverflow.com/questions/15171711/expiry-of-sessionstorage
    console.log(`tokenExpiration: ${tokenExpiration}`)
    console.log(`role: ${role}`)

    let authObject = {
      token,
      userId
    };

    if (role === "Admin") {
      this.setState(authObject);
      authObject = JSON.stringify(authObject);
      localStorage.setItem("jwtToken", authObject);
    }
  };

  logout = () => {
    this.setState({ token: null, userId: null });
    localStorage.setItem("jwtToken", null);
  };

  render() {
    // if (this.state.token) {
    //   console.log("yey");
    // } else {
    //   console.log("wtf");
    // }
    const theme = createMuiTheme({
      palette: {
        primary: blueGrey,
        secondary: red
      },
      typography: {
        useNextVariants: true
      }
    });

    return (
      <BrowserRouter>
        <AuthContext.Provider
          value={{
            token: this.state.token,
            userId: this.state.userId,
            login: this.login,
            logout: this.logout
          }}
        >
          <ApolloProvider client={client}>
            <MuiThemeProvider theme={theme}>
              <CssBaseline />
              {this.state.token ?
                (<Switch>
                  <Route path="/category" component={CategoryPage} />
                  <Route path="/subcategory" component={SubcategoryPage} />
                  <Route path="/product/add" component={ProductFormPage} />
                  <Route path="/product/edit/:id" component={ProductFormPage} />
                  <Route path="/product" component={ProductPage} />
                  <Route path="/address/add" component={AddressFormPage} />
                  <Route path="/address/edit/:id" component={AddressFormPage} />
                  <Route path="/address" component={AddressPage} />
                  <Route path="/profile/:id/addresses" component={AddressesPage} />
                  <Route path="/promotion" component={PromotionPage} />
                  <Route path="/client" component={ClientPage} />
                  <Redirect to="/product" />
                </Switch>) :
                (<Switch>
                  <Route path="/auth" component={AuthPage} />
                  <Redirect to="/auth" />
                </Switch>)
              }
            </MuiThemeProvider>
          </ApolloProvider>
        </AuthContext.Provider>
      </BrowserRouter>
    );
  }
}

export default App;