export const CONTACTO_EMAIL = `
mutation contactoEmail($_id: ID, $mensaje: String) {
  contactoEmail(_id: $_id, mensaje: $mensaje)
}

`