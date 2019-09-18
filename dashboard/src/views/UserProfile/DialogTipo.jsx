import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";

import Fab from "@material-ui/core/Fab";
import DeleteIcon from "@material-ui/icons/Delete";

//SWAL
import swal from "sweetalert";
import Swal from "sweetalert2";

//Axios
import axios from "axios";

const url_base = "https://gym-stayfit.herokuapp.com/dash";

const styles = theme => ({});

class DialogTipo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      rows: []
    };
  }

  componentDidMount = () => {
    const { datos } = this.props;

    this.setState({
      rows: datos
    });
  };

  handleDelete = (e, row, rol) => {
    e.preventDefault();
    let id = "";
    if (rol === "ALUMNO") {
      id = this.props.id_usuario
    } else {
      id = row._id;
    }

    swal({
      title: "¿Está seguro de quitarlo de la lista?",
      text: "Una vez quitado, no se podrá volver atrás.",
      icon: "warning",
      buttons: true,
      dangerMode: true
    }).then(willDelete => {
      if (willDelete) {
        let url_quitar = url_base + "/alumnos/" + id;

        axios({
          method: "delete",
          url: url_quitar
        }).then(response => {
          const { data } = response;

          if (data.status) {
            swal("Eliminado", "El usuario ha sido quitado", "success").then(
              () => {
                window.location.reload();
              }
            );
          } else {
            swal(
              "Error servidor",
              "El usuario no ha sido eliminado, intente luego",
              "error"
            );
          }
        });
      } else {
        swal("No ha sido quitado");
      }
    });
  };

  handleAgregar = async (e, rol, handleModalTipo) => {
    e.preventDefault();
    const { usuarios } = this.props;
    let options_alumnos = {};
    let options_profesor = {};

    usuarios.map(function(o) {
      if (o.rol !== "ADMIN") {
        if (o.rol === "PROFESOR") {
          options_alumnos[o._id] = o.nombre;
        } else {
          options_profesor[o._id] = o.nombre;
        }
      }
    });

    handleModalTipo();

    let options = {};

    if (rol === "ALUMNO") {
      options = options_alumnos;
    } else {
      options = options_profesor;
    }

    await Swal.fire({
      title: "Seleccione un usuario",
      input: "select",
      inputOptions: options,
      inputPlaceholder: "Seleccione un usuario",
      showCancelButton: true,
      inputValidator: value => {
        return new Promise(resolve => {
          if (value) {
            resolve(this.agregarAlumno(value));
          } else {
            resolve("Necesita seleccionar un usuario");
          }
        });
      }
    });
  };

  agregarAlumno = value => {
    const url = url_base + "/profesor";
    const datos = {
      id_uno: value,
      id_dos: this.props.id_usuario
    };

    axios({
      method: "post",
      url: url,
      data: datos
    })
      .then(response => {
        const { data } = response;

        if (data.status) {
          swal("Agregado", data.message, "success").then(() => {
            window.location.reload();
          });
        } else {
          swal("Error servidor", data.message, "error");
        }
      })
      .catch(err => {
        console.log(err);
        swal("Error servidor", "Error al asignar alumno", "error");
      });
  };

  render() {
    const { classes, open, handleModalTipo, rol } = this.props;
    const { rows } = this.state;
    console.log(rows)
    return (
      <Dialog
        open={open}
        onClose={() => handleModalTipo()}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {rol === "ALUMNO" ? "PROFESOR" : "ALUMNOS"}
        </DialogTitle>
        <DialogContent>
          {rows.length > 0 && rows[0] !== "" ? (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="right">Nombre</TableCell>
                  <TableCell align="right" />
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map(row => (
                  <TableRow key={row._id} style={{ cursor: "pointer" }}>
                    <TableCell component="th" scope="row">
                      {row.nombre}
                    </TableCell>
                    <TableCell align="right">
                      <Fab
                        aria-label="Delete"
                        className={classes.fab}
                        onClick={e => this.handleDelete(e, row, rol)}
                      >
                        <DeleteIcon />
                      </Fab>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            "No tiene asignado."
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleModalTipo()} color="primary">
            Cerrar
          </Button>
          <Button
            disabled={rows.length > 0 && rol === "ALUMNO" && rows[0] !== "" ? true : false}
            onClick={e => this.handleAgregar(e, rol, handleModalTipo)}
            color="primary"
          >
            {rol === "ALUMNO" ? "ASIGNAR PROFESOR" : "ASIGNAR ALUMNO"}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

DialogTipo.propTypes = {
  classes: PropTypes.object.isRequired,
  datos: PropTypes.array.isRequired,
  handleModalTipo: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  rol: PropTypes.string.isRequired,
  usuarios: PropTypes.array
};

export default withStyles(styles)(DialogTipo);
