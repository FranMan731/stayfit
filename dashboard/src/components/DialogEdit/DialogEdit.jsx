/* eslint-disable react/prop-types */
import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { ApolloConsumer } from "react-apollo";

import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';

import Button from "@material-ui/core/Button";

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";

import { Mutation } from "react-apollo";
import { EDITAR_USUARIO } from "../../graphql/mutations";

//Sweet Alert
import swal from "sweetalert";

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
      rol: ""
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

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes, handleOpenModalEdit, open, id_usuario, rolActual } = this.props;
    const { rol } = this.state;
    return (
      <Mutation
        mutation={EDITAR_USUARIO}
        onCompleted={() => {
          swal({
            title: "Editado",
            text: "El usuario ha sido editado",
            icon: "success",
            button: "Aceptar"
          }).then(() => {
            window.location.reload();
          });
        }}
        onError={() => {
          swal({
            title: "Editar",
            text: "No se pudo editar el usuario, intente luego.",
            icon: "error",
            button: "Aceptar"
          }).then(() => {
            window.location.reload();
          });
        }}
      >
        {updateUsuario => (
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
                onClick={e => {
                  e.preventDefault();

                  const { rol } = this.state;
                  const input = {
                    _id: id_usuario,
                    rol
                  };

                  updateUsuario({
                    variables: { input }
                  });
                }}
                color="secondary"
                autoFocus
              >
                Guardar
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </Mutation>
    );
  }
}

DialogEdit.propTypes = {
  classes: PropTypes.object.isRequired,
  handleOpenModalEdit: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired
};

export default withStyles(styles)(DialogEdit);
