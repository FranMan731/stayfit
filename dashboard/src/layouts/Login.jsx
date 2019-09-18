import React from "react";
import { ApolloConsumer } from "react-apollo";

import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { AUTH_TOKEN } from "./../constants/index";

import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import WarningIcon from "@material-ui/icons/Warning";

import logo from "assets/img/logo.png";
import dashboardStyle from "assets/jss/material-dashboard-react/layouts/dashboardStyle.jsx";
import { LOGIN } from "../graphql/queries";

const styles = theme => ({
  logo: {
    width: "140px !important",
    heigth: "170px !important"
  },
  alert: {
    position: "relative",
    padding: ".75rem 1.25rem",
    marginBottom: "1rem",
    border: "1px solid transparent",
    borderRadius: ".25rem",
    color: "#721c24",
    backgroundColor: "#f8d7da",
    borderColor: "#f5c6cb"
  }
});

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      addAlert: false
    };
  }

  iniciarSesion = async (e, client) => {
    e.preventDefault();
    const { email, password } = this.state;

    const { data } = await client
      .query({
        query: LOGIN,
        variables: { email, password }
      })
      .catch(err => {
        this.setState({ addAlert: true });
      });

    if (data) {
      this._saveUserData(data);
      // eslint-disable-next-line react/prop-types
      this.props.history.push(`/`);
    }
  };

  _saveUserData = ({ login }) => {
    localStorage.setItem(AUTH_TOKEN, login.token);
  };

  render() {
    const { classes } = this.props;
    const { addAlert } = this.state;
    return (
      <div>
        <ApolloConsumer>
          {client => (
            <Grid
              container
              justify="center"
              alignItems="center"
              style={{ padding: "10px", height: "100vh" }}
            >
              <Grid item xs={12} sm={4}>
                <Paper style={{ padding: "10px" }}>
                  <Grid container justify="center" alignItems="center">
                    <img src={logo} alt="..." className={classes.logo} />
                  </Grid>
                  <form>
                    <Grid item>
                      <TextField
                        id="filled-email-input"
                        label="Email"
                        className={classes.textField}
                        type="email"
                        name="email"
                        autoComplete="email"
                        fullWidth
                        margin="normal"
                        onChange={e => this.setState({ email: e.target.value })}
                      />
                    </Grid>
                    <Grid item>
                      <TextField
                        id="filled-password-input"
                        label="Password"
                        className={classes.textField}
                        fullWidth
                        type="password"
                        autoComplete="current-password"
                        margin="normal"
                        onChange={e =>
                          this.setState({ password: e.target.value })
                        }
                      />
                    </Grid>
                    <Grid item>
                      {addAlert ? (
                        <div className={classes.alert}>Datos incorrectos</div>
                      ) : (
                        ""
                      )}
                    </Grid>
                    <Grid item>
                      <Button
                        margin="dense"
                        fullWidth
                        variant="contained"
                        color="secondary"
                        className={classes.button}
                        onClick={e => this.iniciarSesion(e, client)}
                      >
                        Ingresar
                      </Button>
                    </Grid>
                  </form>
                </Paper>
              </Grid>
            </Grid>
          )}
        </ApolloConsumer>
      </div>
    );
  }
}

Login.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Login);
