import React from "react";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
// import Typography from "@material-ui/core/Typography";


import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Hidden from "@material-ui/core/Hidden";
// import CategoryIcon from "@material-ui/icons/List";
import SubcategoryIcon from "@material-ui/icons/ListAlt";
import ProductIcon from "@material-ui/icons/Laptop";
import AccessoryIcon from "@material-ui/icons/Mouse"
import PromotionIcon from "@material-ui/icons/AttachMoney";
import ClientIcon from "@material-ui/icons/AccountCircle";
import QuotationIcon from "@material-ui/icons/Ballot"
import RentIcon from "@material-ui/icons/Event";
import { NavLink } from "react-router-dom";
import whiteLogo120w from "../../assets/images/logos/logo-blanco-120w.png";

const drawerWidth = 241;

const styles = theme => ({
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0
    }
  },
  toolbar: {
    ...theme.mixins.toolbar,
    alignItems: "center",
    display: "flex",
    backgroundColor: theme.palette.primary.main,
    color: "white"
  },
  drawerTitle: {
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    margin: 'auto',
    textDecoration: 'none',
  },
  drawerPaper: {
    width: drawerWidth
  }
});

const ResponsiveDrawer = props => {
  const sideLinks = [
    // { id: 10, icon: <CategoryIcon />, text: "Categorias", linkTo: "/category" },
    { id: 20, icon: <SubcategoryIcon />, text: "Subcategorias", linkTo: "/subcategory" },
    { id: 30, icon: <ProductIcon />, text: "Productos", linkTo: "/product" },
    { id: 35, icon: <AccessoryIcon />, text: "Accesorios", linkTo: "/accessory" },
    { id: 40, icon: <PromotionIcon />, text: "Promociones", linkTo: "/promotion" },
    { id: 50, icon: <ClientIcon />, text: "Clientes", linkTo: "/client" },
    { id: 60, icon: <QuotationIcon />, text: "Cotizaciones", linkTo: "/quotation" },
    { id: 70, icon: <RentIcon />, text: "Rentas", linkTo: "/rent" }
  ];

  const { classes, theme } = props;
  const drawer = (
    <div>
      <div className={classes.toolbar}>
        <NavLink to="/" className={classes.drawerTitle} exact>
          <img style={{ width: '80%' }} src={whiteLogo120w} alt="logo" />
          {/* <Typography variant="h6" color="inherit">
            CYDCOM
          </Typography> */}
        </NavLink>
      </div>

      <Divider />

      <List>
        {sideLinks.map(sideLink => (
          <ListItem
            button
            key={sideLink.id}
            component={NavLink}
            to={sideLink.linkTo}
          >
            <ListItemIcon>{sideLink.icon}</ListItemIcon>
            <ListItemText primary={sideLink.text} />
          </ListItem>
        ))}
      </List>


      <Divider />
    </div>
  );

  return (
    <nav className={classes.drawer}>
      <Hidden smUp implementation="css">
        <Drawer
          variant="temporary"
          anchor={theme.direction === "rtl" ? "right" : "left"}
          open={props.open}
          onClose={props.toggleDrawer}
          classes={{
            paper: classes.drawerPaper
          }}
        >
          {drawer}
        </Drawer>
      </Hidden>
      <Hidden xsDown implementation="css">
        <Drawer
          classes={{
            paper: classes.drawerPaper
          }}
          variant="permanent"
          open
        >
          {drawer}
        </Drawer>
      </Hidden>
    </nav>
  );
};

ResponsiveDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(ResponsiveDrawer);
