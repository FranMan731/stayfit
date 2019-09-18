import React from "react";
import PropTypes from "prop-types";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2
  }
});

function renderSwitch(classes, tipo) {
  switch (tipo) {
    case "SERVIDOR":
      return (
        <Paper className={classes.root} elevation={1}>
          <Typography variant="h5" component="h3">
            FALLA EN EL SERVIDOR
          </Typography>
          <Typography component="p">
            No se ha podido traer los datos, intente luego.
          </Typography>
        </Paper>
      );
    case "VACIO":
      return (
        <Paper className={classes.root} elevation={1}>
          <Typography variant="h5" component="h3">
            SIN DATOS
          </Typography>
          <Typography component="p">
            No hay ningún dato de este tipo creado.
          </Typography>
        </Paper>
      );
    default:
      return (
        <Paper className={classes.root} elevation={1}>
          <Typography variant="h5" component="h3">
            ERROR
          </Typography>
          <Typography component="p">
            Ha habido un problem, intente luego.
          </Typography>
        </Paper>
      );
  }
}

const Error = props => {
  const { classes, tipo } = props;

  const renderizar = renderSwitch(classes, tipo);

  return <div>{renderizar}</div>;
};

Error.propTypes = {
  classes: PropTypes.object.isRequired,
  tipo: PropTypes.string.isRequired
};

export default withStyles(styles)(Error);
