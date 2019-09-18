import React from "react";
import PropTypes from "prop-types";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// core components
import Grid from "@material-ui/core/Grid";

import Loading from "../../components/Loading/Loading";
import Error from "../../components/Error/Error";

import TableEjercicio from "components/Table/TableEjercicio";

import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";

import Button from "@material-ui/core/Button";

import Fab from "@material-ui/core/Fab";
import Icon from "@material-ui/core/Icon";
import DeleteIcon from "@material-ui/icons/Delete";

import DialogCrear from "./DialogCrear";
import DialogEdit from "./DialogEdit";

import sinImagen from "assets/img/sinImagenEjercicio.png";

//SWAL
import swal from "sweetalert";

//Axios
import axios from "axios";

const url_base = "https://gym-stayfit.herokuapp.com/dash";
const styles = theme => ({
  [theme.breakpoints.down("sm")]: {
    card: {
      marginTop: "30px !important",
      marginLeft: "0px !important"
    },
    marginControl: {
      margin: "10px !important"
    }
  },
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: "center",
    color: theme.palette.text.secondary
  },
  card: {
    marginTop: "24px !important",
    marginLeft: "10px"
  },
  formControl: {
    marginLeft: "5px",
    width: "100%"
  },
  fab: {
    margin: theme.spacing.unit
  },
  extendedIcon: {
    marginRight: theme.spacing.unit
  },
  media: {
    objectFit: "cover"
  },
  botonesCentro: {
    justifyContent: "center !important"
  }
});

class Ejercicios extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ejercicios: "",
      ejercicio: "",
      openEdit: false,
      open: false,
      loading: true,
      error: false,
      openCrear: false
    };

    this.handleClickRow = this.handleClickRow.bind(this);
    this.handleOpenEdit = this.handleOpenEdit.bind(this);
    this.handleGetData = this.handleGetData.bind(this);
    this.handleDeleteEjercicio = this.handleDeleteEjercicio.bind(this);
    this.handleOpenCrear = this.handleOpenCrear.bind(this);
  }

  componentDidMount = async () => {
    await this.handleGetData();
  };

  handleGetData = async () => {
    await axios
      .get(url_base + "/ejercicios")
      .then(response => {
        const { data } = response;
        if (data.status) {
          this.setState({
            ejercicios: data.ejercicios,
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
  };

  handleClickRow = datos => {
    this.setState({
      ejercicio: datos
    });
  };

  handleOpenCrear = () => {
    this.setState({
      openCrear: !this.state.openCrear
    });
  };

  handleOpenEdit = () => {
    this.setState({
      openEdit: !this.state.openEdit
    });
  };

  handleDeleteEjercicio = (e, id) => {
    e.preventDefault();

    swal({
      title: "¿Está seguro de eliminarlo?",
      text: "Una vez eliminado, no se podrá volver atrás.",
      icon: "warning",
      buttons: true,
      dangerMode: true
    }).then(willDelete => {
      if (willDelete) {
        axios({
          method: "delete",
          url: url_base + "/ejercicios/" + id
        }).then(response => {
          const { data } = response;

          if (data.status) {
            swal("Eliminado", "El ejercicio ha sido eliminado", "success").then(
              () => {
                window.location.reload();
              }
            );
          } else {
            swal(
              "Error servidor",
              "El ejercicio no ha sido eliminado, intente luego",
              "error"
            );
          }
        });
      } else {
        swal("No ha sido eliminado");
      }
    });
  };

  render() {
    const { classes } = this.props;
    const { _id, nombre, actividad, imagen } = this.state.ejercicio;
    const { loading, ejercicios, error } = this.state;

    return (
      <div className={classes.root}>
        <Grid container>
          <Grid item xs={12} sm={12} md={12}>
            <Paper className={classes.paper}>
              <Grid container>
                <Grid item xs={12} sm={12} md={8} />
                <Grid item xs={12} sm={12} md={4}>
                  <Button
                    onClick={() => this.setState({ openCrear: true })}
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    autoFocus
                    fullWidth
                  >
                    Crear Ejercicio
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
        {loading ? (
          <Loading />
        ) : error ? (
          <Error classes={classes} tipo="SERVIDOR" />
        ) : 
          (
            <Grid container>
            <Grid item xs={12} sm={12} md={7}>
              <TableEjercicio
                datos={ejercicios}
                handleClickRow={this.handleClickRow}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={5}>
              {this.state.ejercicio ? (
                <Card className={classes.card}>
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      alt="Sin Imagen"
                      className={classes.media}
                      height="140"
                      image={imagen ? imagen : sinImagen}
                      title="Sin Imagen"
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="h2">
                        {nombre}
                      </Typography>
                      <Typography component="p">{actividad}</Typography>
                    </CardContent>
                  </CardActionArea>
                  <CardActions className={classes.botonesCentro}>
                    <Fab
                      color="secondary"
                      aria-label="Edit"
                      className={classes.fab}
                      onClick={() => this.setState({ openEdit: true })}
                    >
                      <Icon>edit_icon</Icon>
                    </Fab>
                    <Fab
                      aria-label="Delete"
                      className={classes.fab}
                      onClick={e => this.handleDeleteEjercicio(e, _id)}
                    >
                      <DeleteIcon />
                    </Fab>
                  </CardActions>
                </Card>
              ) : (
                ""
              )}
            </Grid>
            <DialogCrear
              classes={classes}
              openCrear={this.state.openCrear}
              handleOpenCrear={this.handleOpenCrear}
            />
            <DialogEdit
              classes={classes}
              open={this.state.openEdit}
              handleOpenEdit={this.handleOpenEdit}
              ejercicio={this.state.ejercicio}
            />
          </Grid>
        )}
      </div>
    );
  }
}

Ejercicios.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Ejercicios);
