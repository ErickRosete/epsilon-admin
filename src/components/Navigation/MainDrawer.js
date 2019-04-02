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
import EventIcon from "@material-ui/icons/Event";
import { NavLink } from "react-router-dom";
import logo120w from "../../assets/images/logos/logo-120w.png";



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
    { id: 10, icon: <EventIcon />, text: "Categorias", linkTo: "/category" },
    { id: 20, icon: <EventIcon />, text: "Subcategorias", linkTo: "/subcategory" },
    { id: 30, icon: <EventIcon />, text: "Productos", linkTo: "/product" },
    { id: 40, icon: <EventIcon />, text: "Promociones", linkTo: "/promotion" },
    { id: 50, icon: <EventIcon />, text: "Clientes", linkTo: "/client" },
  ];

  const { classes, theme } = props;
  const drawer = (
    <div>
      <div className={classes.toolbar}>
        <NavLink to="/" className={classes.drawerTitle} exact>
          <img style={{ marginRight: '1rem', width: '90%' }} src={logo120w} alt="logo" />
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
