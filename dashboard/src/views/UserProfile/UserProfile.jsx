/* eslint-disable prettier/prettier */
import React from "react";
import PropTypes from "prop-types";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Card from "components/Card/Card.jsx";
import CardAvatar from "components/Card/CardAvatar.jsx";
import CardBody from "components/Card/CardBody.jsx";

import Icon from '@material-ui/core/Icon';
import Fab from '@material-ui/core/Fab';
import DeleteIcon from "@material-ui/icons/Delete";
import NavigationIcon from '@material-ui/icons/Navigation';

import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

import Modal from '@material-ui/core/Modal';

import sinAvatar from "assets/img/faces/sin-avatar.png";
import Loading from "../../components/Loading/Loading";
import Error from "../../components/Error/Error";

import TableWithPagination from "components/Table/TableWithPagination";
import DialogEdit from "./DialogEdit";
import DialogTipo from "./DialogTipo";

//SWAL
import swal from "sweetalert";

//Axios
import axios from "axios";

const url_base = "https://gym-stayfit.herokuapp.com/dash";

const styles = theme => ({
  [theme.breakpoints.down('sm')]: {
      cardPerfil: {
        marginTop: "60px !important"
      },
  },
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "30",
    marginBottom: "0"
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none"
  },
  button: {
    margin: theme.spacing.unit,
  },
  fab: {
    margin: theme.spacing.unit,
  }
});

class UserProfile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      tipoModal: '',
      perfil: {},
      openModalEditar: false,
      usuarios: '',
      loading: true,
      error: false,
      datos: '',
      openModalTipo: false
    }

    this.handleOpenModalEdit = this.handleOpenModalEdit.bind(this);
    this.handleClickRow = this.handleClickRow.bind(this);
    this.handleGetUsuarios = this.handleGetUsuarios.bind(this);
    this.handleDeleteUsuario = this.handleDeleteUsuario.bind(this);
    this.handleEliminar = this.handleEliminar.bind(this);
    this.handleTipoUsuario = this.handleTipoUsuario.bind(this);
    this.handleModalTipo = this.handleModalTipo.bind(this);
    this.handleExportar = this.handleExportar.bind(this);
  }

  componentDidMount = async () => {
    await this.handleGetUsuarios();
  }

  handleOpenModalEdit = () => {
    this.setState({
      open: !this.state.open
    })
  }

  handleClickRow = (datos) => {
    this.setState({
      perfil: datos
    })
  }

  handleGetUsuarios = async () => {
    await axios
      .get(url_base + "/usuarios")
      .then(response => {
        const { data } = response;
        if (data.status) {
          this.setState({
            usuarios: data.usuarios,
            loading: false,
            error: false
          });
        } else {
          this.setState({
            loading: false,
            error: true
          })
          swal("Error", data.message, "error");
        }
      })
      .catch(() => {
        this.setState({
          loading: false,
          error: true
        })
        swal(
          "Error",
          "Error en el servidor, no se ha podido obtener los datos.",
          "error"
        );
      });
  }

  handleDeleteUsuario = (e, id) => {
    e.preventDefault();

    swal("¿Qué desea hacer?", {
      buttons: {
        cancel: "Cancelar",
        deshabilitar: {
          text: "Deshabilitar",
          value: "deshabilitar",
        },
        eliminar: {
          text: "Eliminar",
          value: "eliminar",
        },
      },
    })
    .then((value) => {
      switch (value) {
        case "deshabilitar":
          swal({
            title: "¿Está seguro?",
            text: "Una vez deshabilitado, el usuario no podrá ingresar.",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
              this.handleEliminar(id, 'deshabilitar')
            }
          });
          break;
     
        case "eliminar":
          swal({
            title: "¿Está seguro?",
            text: "Una vez eliminado, no hay vuelta atrás.",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
              this.handleEliminar(id, 'eliminar')
            }
          });
          break;
     
        default:
          break;
      }
    });
  }

  handleEliminar = (id, tipo) => {
    const data = {
      deshabilitar: true
    };

    switch(tipo) {
      case "deshabilitar":
        axios({
          method: "put",
          url: url_base + "/usuarios/" + id,
          data: data
        })
          .then(response => {
            const { data } = response;
    
            if (data.status) {
              swal("Deshabilitado", "El usuario ha sido deshabilitado", "success").then(
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
              "El usuario no ha sido deshabilitado, intente luego.",
              "error"
            );
          });
        break;
      case "eliminar":
        axios({
          method: "delete",
          url: url_base + "/usuarios/" + id
        })
          .then(response => {
            const { data } = response;
    
            if (data.status) {
              swal("Eliminado", "El usuario ha sido eliminado", "success").then(
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
              "El usuario no ha sido eliminado, intente luego.",
              "error"
            );
          });
        break;
      default:
        break;
    }
  }

  handleTipoUsuario = (e, id, tipo) => {
    e.preventDefault();

    switch(tipo) {
      case "alumno":
        axios({
          method: "get",
          url: url_base + "/profesor/" + id
        }).then((response) => {
          const data = [];
          data.push(response.data.profesor)
          this.setState({
            datos: data,
            openModalTipo: true,
          })
        }).catch(() => {
          swal(
            "Error en el servidor",
            "El usuario no ha sido deshabilitado, intente luego.",
            "error"
          );
        });
        break;
      case "profesor":
        axios({
          method: "get",
          url: url_base + "/alumnos/" + id
        }).then((response) => {
          this.setState({
            datos: response.data.alumnos,
            openModalTipo: true,
          })
        }).catch(() => {
          swal(
            "Error en el servidor",
            "El usuario no ha sido deshabilitado, intente luego.",
            "error"
          );
        });
        break;
      default:
        break;
    }
  }

  handleModalTipo = () => {
    this.setState({
      openModalTipo: !this.state.openModalTipo
    })
  }

  handleExportar = (e) => {
    e.preventDefault();

    axios({
      method: "get",
      url: url_base + "/usuarios/exportar"
    }).then((response) => {
      if(response) {
        console.log(response.data.filename)
        window.location.href = `https://gym-stayfit.herokuapp.com/uploads/exports/${response.data.filename}`
      }
    }).catch(err => {
      console.log("Error" + err)
    })
  }

  render() {
    const { perfil, open, loading, usuarios, error } = this.state;
    const { classes } = this.props
    const { _id, nombre, email, rol, avatar } = perfil;
    return (
      <div>
        {loading ? (
          <Loading />
        ) : error ? (
          <Error classes={classes} tipo="SERVIDOR" />
        ) : 
          (
            <div>
              <GridContainer>
                <GridItem xs={12} sm={12} md={8}>
                  <Paper>
                  <Button variant="contained" color="primary" className={classes.button} onClick={e => this.handleExportar(e)}>
                    EXPORTAR
                  </Button>
                  </Paper>
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={12} md={8}>
                  <TableWithPagination datos={usuarios} handleClickRow={this.handleClickRow} />
                </GridItem>
                <GridItem xs={12} sm={12} md={4}>
                  {(nombre) ? 
                    <Card profile className={classes.cardPerfil}>
                      <CardAvatar profile>
                        <a href="#" onClick={e => e.preventDefault()}>
                          {(!avatar) ?
                            <img src={sinAvatar} alt="..." />
                          :
                          <img src={avatar} alt="..." />
                        }
                        </a>
                      </CardAvatar>
                      <CardBody profile>
                        <h4>{nombre}</h4>
                        <h6>{rol}</h6>
                        <h5>{email}</h5>

                        {rol === "ADMIN" ? "" : (
                          rol === "ALUMNO" ? (
                            <Fab variant="extended" aria-label="Delete" className={classes.fab} onClick={e => this.handleTipoUsuario(e, _id, 'alumno')}>
                              <NavigationIcon className={classes.extendedIcon} />
                              PROFESOR
                            </Fab>
                          ) : (
                            <Fab variant="extended" aria-label="Delete" className={classes.fab} onClick={e => this.handleTipoUsuario(e, _id, 'profesor')}>
                              <NavigationIcon className={classes.extendedIcon} />
                              ALUMNOS
                            </Fab>
                          )
                        )}
                        <Fab color="secondary" aria-label="Edit" className={classes.fab} onClick={this.handleOpenModalEdit}>
                          <Icon>edit_icon</Icon>
                        </Fab>
                        <Fab aria-label="Delete" className={classes.fab} onClick={e => this.handleDeleteUsuario(e, _id)}>
                          <DeleteIcon />
                        </Fab>
                      </CardBody>
                    </Card>
                  : ''}
                </GridItem>
              </GridContainer>
            </div>
          )}
          <DialogEdit classes={classes} open={open} handleOpenModalEdit={this.handleOpenModalEdit} id={_id} />
        {this.state.openModalTipo ? (
          <DialogTipo id_usuario={_id} classes={classes} usuarios={usuarios} rol={rol} datos={this.state.datos} open={this.state.openModalTipo} handleModalTipo={this.handleModalTipo}/>
        ) : ""}
      </div>
    );
  }
}

UserProfile.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(UserProfile);
