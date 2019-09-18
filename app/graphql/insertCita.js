export const INSERT_CITA = `
mutation insertCita($input: CitaInput) {
  insertCita(input: $input) {
    _id
    hora
    fecha
  }
}
`