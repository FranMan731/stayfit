export const INSERT_PLAN = `
mutation insertPlan($input: PlanInput) {
  insertPlan(input: $input) {
    _id
  }
}

`