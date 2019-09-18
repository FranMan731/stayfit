/* eslint-disable react/prop-types */
import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";

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
const FormData = require("form-data");
const styles = theme => ({
  dialogEdit: {
    padding: "20px"
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120
  },
  formGroup: {
    marginBottom: "1rem"
  },
  labelEjercicio: {
    display: "inline-block",
    marginBottom: ".5rem"
  },
  formControlFile: {
    display: "block",
    width: "100%"
  }
});

class DialogCrear extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      nombre: "",
      actividad: "",
      files: "",
      loading: false
    };
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleFiles = files => {
    this.setState({
      files: files
    });
  };

  handleCrearEjercicio = e => {
    e.preventDefault();
    const { nombre, actividad } = this.state;

    if (nombre === "" || actividad === "") {
      swal(
        "Error",
        "Debe completar todos los campos para poder crear",
        "error"
      );
    }

    const data = {
      nombre: nombre,
      actividad: actividad
    };

    this.setState({
      loading: true
    });

    axios({
      method: "post",
      url: url_base + "/ejercicios",
      data: data
    })
      .then(response => {
        const { data } = response;

        if (data.status) {
          this.handleUploadFiles(data.id);
        } else {
          swal(
            "Error en el servidor",
            "El ejercicio no ha sido creado, intente luego.",
            "error"
          );
        }
      })
      .catch(() => {
        swal(
          "Error en el servidor",
          "El ejercicio no ha sido creado, intente luego.",
          "error"
        ).then(() => {
          window.location.reload();
        });
      });
  };

  handleUploadFiles = id => {
    let form = new FormData();

    form.append("type", "ejercicio");
    form.append("id", id);
    form.append("file", this.state.files[0]);

    axios
      .post("https://gym-stayfit.herokuapp.com/upload", form, {
        headers: { "Content-Type": "multipart/form-data" }
      })
      .then(response => {
        if (response.status) {
          this.setState({
            loading: false
          });

          swal({
            title: "Éxito",
            text: "El ejercicio ha sido creado",
            icon: "success",
            button: "Aceptar"
          }).then(() => {
            window.location.reload();
          });
        }
      })
      .catch(() => {
        swal({
          title: "Error",
          text:
            "El ejercicio ha sido creado, pero no se pudo actualizar imagen.",
          icon: "error",
          button: "Aceptar"
        }).then(() => {
          window.location.reload();
        });
      });
  };
  render() {
    const { classes, handleOpenCrear, openCrear } = this.props;
    const { actividad, loading } = this.state;

    return (
      <Dialog
        open={openCrear}
        onClose={() => handleOpenCrear()}
        aria-labelledby="simple-dialog-title"
        scroll="body"
      >
        {loading ? <Loading /> : ""}
        <DialogTitle id="dialogEdit">Crear Ejercicio</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <FormControl className={classes.formControl} fullWidth={true}>
              <TextField
                id="txtNombreEjercicio"
                label="Nombre"
                className={classes.textField}
                margin="normal"
                onChange={e => this.setState({ nombre: e.target.value })}
              />
            </FormControl>
            <FormControl className={classes.formControl} fullWidth={true}>
              <InputLabel htmlFor="filled-select-currency">
                Actividad
              </InputLabel>
              <Select
                id="filled-select-currency"
                select
                label="Actividad"
                value={actividad}
                className={classes.textField}
                onChange={this.handleChange}
                inputProps={{
                  name: "actividad",
                  id: "filled-select-currency"
                }}
                variant="filled"
              >
                <MenuItem name="FUNCIONAL" value="FUNCIONAL">
                  FUNCIONAL
                </MenuItem>
                <MenuItem name="HIIT" value="HIIT">
                  HIIT
                </MenuItem>
                <MenuItem name="FUERZA" value="FUERZA">
                  FUERZA
                </MenuItem>
                <MenuItem name="NUCLEO" value="NUCLEO">
                  NUCLEO
                </MenuItem>
                <MenuItem name="EQUILIBRIO" value="EQUILIBRIO">
                  EQUILIBRIO
                </MenuItem>
                <MenuItem name="AEROBICO" value="AEROBICO">
                  AEROBICO
                </MenuItem>
              </Select>
            </FormControl>
            <FormControl className={classes.formControl} fullWidth={true}>
              <div className={classes.formGroup}>
                <label
                  htmlFor="imagenEjercicio"
                  className={classes.labelEjercicio}
                >
                  Elija imagen
                </label>
                <input
                  type="file"
                  className={classes.formControlFile}
                  id="imagenEjercicio"
                  onChange={e => this.handleFiles(e.target.files)}
                />
              </div>
            </FormControl>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleOpenCrear()} color="default">
            Cerrar
          </Button>
          <Button
            onClick={e => this.handleCrearEjercicio(e)}
            color="secondary"
            autoFocus
          >
            Crear
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

DialogCrear.propTypes = {
  classes: PropTypes.object.isRequired,
  handleOpenCrear: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired
};

export default withStyles(styles)(DialogCrear);
