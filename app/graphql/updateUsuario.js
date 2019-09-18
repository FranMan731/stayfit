export const UPDATE_USUARIO = `
mutation updateUsuario($input: UsuarioInput) {
  updateUsuario(input: $input) {
    _id
    peso
  }
}
`