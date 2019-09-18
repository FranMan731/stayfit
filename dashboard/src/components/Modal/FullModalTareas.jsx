import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

import Dialog from "@material-ui/core/Dialog";

import ListItemText from "@material-ui/core/ListItemText";
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";

import Fab from "@material-ui/core/Fab";
import Icon from "@material-ui/core/Icon";
import DeleteIcon from "@material-ui/icons/Delete";
import NavigationIcon from "@material-ui/icons/Navigation";

const styles = theme => ({
  appBar: {
    position: "relative"
  },
  flex: {
    flex: 1
  },
  fab: {
    margin: theme.spacing.unit
  },
  extendedIcon: {
    marginRight: theme.spacing.unit
  }
});

function Transition(props) {
  return <Slide direction="up" {...props} />;
}
function tipoDatos(datos) {
  let valores = [];

  Object.keys(datos).forEach(key => {
    if (key !== "__typename" && key !== "coach" && key !== "alumnos") {
      if (
        datos[key] === null ||
        datos[key] === undefined ||
        datos[key] === "" ||
        datos[key].length === 0
      ) {
        valores.push({
          key: key.toUpperCase(),
          value: "-"
        });
      } else {
        valores.push({
          key: key.toUpperCase(),
          value: datos[key]
        });
      }
    }
  });

  return valores;
}

const FullModalTareas = ({
  classes,
  open,
  handleOpen,
  handleOpenModalEdit,
  datos
}) => {
  let valores = tipoDatos(datos);

  return (
    <div>
      <Dialog
        fullScreen
        open={open}
        onClose={handleOpen}
        TransitionComponent={Transition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              color="inherit"
              onClick={() => handleOpen()}
              aria-label="Close"
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" className={classes.flex}>
              {datos.rol}
            </Typography>
            {datos.rol === "ALUMNO" ? (
              <Fab
                variant="extended"
                aria-label="Delete"
                className={classes.fab}
              >
                <NavigationIcon className={classes.extendedIcon} />
                Profesor
              </Fab>
            ) : (
              ""
            )}
            <Fab
              color="secondary"
              aria-label="Edit"
              className={classes.fab}
              onClick={() => handleOpenModalEdit()}
            >
              <Icon>edit_icon</Icon>
            </Fab>
            <Fab aria-label="Delete" className={classes.fab}>
              <DeleteIcon />
            </Fab>
          </Toolbar>
        </AppBar>
        <List>
          {valores.map((valor, i) => {
            return (
              <div key={i}>
                <ListItem button>
                  <ListItemText primary={valor.key} secondary={valor.value} />
                </ListItem>
                <Divider />
              </div>
            );
          })}
        </List>
      </Dialog>
    </div>
  );
};

FullModalTareas.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  handleOpen: PropTypes.func.isRequired,
  handleOpenModalEdit: PropTypes.func.isRequired,
  datos: PropTypes.object.isRequired
};

export default withStyles(styles)(FullModalTareas);
