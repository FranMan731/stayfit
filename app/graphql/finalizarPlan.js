export const FINALIZAR_PLAN = `
mutation finalizarPlan($_id: ID!) {
  finalizarPlan(_id: $_id) 
}
`