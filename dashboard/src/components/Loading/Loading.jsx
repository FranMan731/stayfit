import React from "react";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";

const styles = theme => ({
  progress: {
    margin: theme.spacing.unit * 2
  }
});

function Loading(props) {
  const { classes } = props;
  return (
    <Grid container direction="row" justify="center" alignItems="center">
      <CircularProgress className={classes.progress} color="secondary" />
    </Grid>
  );
}

export default withStyles(styles)(Loading);
