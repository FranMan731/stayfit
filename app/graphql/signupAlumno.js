export const SIGNUP_ALUMNO = `
mutation signupAlumno($email: String!, $password: String!, $nombre: String!) {
  signupAlumno(email: $email, password: $password, nombre: $nombre)
}
`