import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";

const styles = theme => {};

const tipoModal = tipo => {
  switch (tipo) {
    case "VER_USUARIO":
      return <h1>Hola</h1>;
  }
};

const ModalTareas = ({ open, handleOpen, tipo }) => {
  return (
    <Modal open={open} onClose={() => handleOpen()}>
      {tipoModal(tipo)}
    </Modal>
  );
};

ModalTareas.propTypes = {
  open: PropTypes.bool.isRequired,
  handleOpen: PropTypes.func.isRequired,
  tipo: PropTypes.string.isRequired
};

export default withStyles(styles)(ModalTareas);
