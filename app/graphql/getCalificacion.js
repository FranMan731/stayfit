export const GET_CALIFICACION = `
query($_id: ID!) {
  getCalificacion(_id: $_id) 
}
`