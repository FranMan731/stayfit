export const GET_PROFESOR_ALUMNO = `
query getProfesorPorAlumno($_id: ID!) {
  getProfesorPorAlumno(_id: $_id) {
    _id
    nombre
  }
}
`