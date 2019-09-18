export const CALIFICAR_PROFESOR = `
mutation($id: ID, $calificacion: Float) {
  calificarProfesor(_id: $id, calificacion: $calificacion) {
   	_id
	}
}
`