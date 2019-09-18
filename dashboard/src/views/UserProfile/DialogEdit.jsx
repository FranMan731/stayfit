/* eslint-disable react/prop-types */
import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";

import Button from "@material-ui/core/Button";

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";

//Axios
import axios from "axios";

// loading
import Loading from "../../components/Loading/Loading";

//Sweet Alert
import swal from "sweetalert";

const url_base = "https://gym-stayfit.herokuapp.com/dash";

const styles = theme => ({
  dialogEdit: {
    padding: "20px"
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120
  }
});

class DialogEdit extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      rol: "",
      loading: false
    };
  }

  handleSelect = value => {
    this.setState({
      rol: value
    });
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleEditRol = (e, id) => {
    e.preventDefault();
    const { rol } = this.state;

    if (rol === "") {
      swal(
        "Error",
        "Debe completar todos los campos para poder editar",
        "error"
      );
    }

    const data = {
      rol: rol
    };

    this.setState({
      loading: true
    });

    axios({
      method: "put",
      url: url_base + "/usuarios/" + id,
      data: data
    })
      .then(response => {
        const { data } = response;

        if (data.status) {
          swal("Actualizado", "El usuario ha sido actualizado", "success").then(
            () => {
              this.setState({
                loading: false
              });

              window.location.reload();
            }
          );
        }
      })
      .catch(() => {
        swal(
          "Error en el servidor",
          "El usuario no ha sido actualizado, intente luego.",
          "error"
        );
      });
  };
  render() {
    const { classes, handleOpenModalEdit, open, id } = this.props;
    const { rol } = this.state;
    return (
      <Dialog
        open={open}
        onClose={() => handleOpenModalEdit()}
        aria-labelledby="simple-dialog-title"
        scroll="body"
      >
        <DialogTitle id="dialogEdit">Editar Rol</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <FormControl className={classes.formControl} fullWidth={true}>
              <InputLabel htmlFor="filled-select-currency">Rol</InputLabel>
              <Select
                id="filled-select-currency"
                select
                label="Rol"
                value={rol}
                className={classes.textField}
                onChange={this.handleChange}
                inputProps={{
                  name: "rol",
                  id: "filled-select-currency"
                }}
                variant="filled"
              >
                <MenuItem name="ADMIN" value="ADMIN">
                  ADMIN
                </MenuItem>
                <MenuItem name="PROFESOR" value="PROFESOR">
                  PROFESOR
                </MenuItem>
                <MenuItem name="ALUMNO" value="ALUMNO">
                  ALUMNO
                </MenuItem>
              </Select>
            </FormControl>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleOpenModalEdit()} color="default">
            Cerrar
          </Button>
          <Button
            color="secondary"
            autoFocus
            onClick={e => this.handleEditRol(e, id)}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

DialogEdit.propTypes = {
  classes: PropTypes.object.isRequired,
  handleOpenModalEdit: PropTypes.func.isRequired
};

export default withStyles(styles)(DialogEdit);
