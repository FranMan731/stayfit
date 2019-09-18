export const DELETE_ALUMNO = `
mutation deleteAlumno($id_alumno: ID) {
  deleteAlumno(id_alumno: $id_alumno)
}
`