export const LOGIN = `
query login($email: String!, $password: String!, $onesignal_id: String) {
  login(email: $email, password: $password, onesignal_id: $onesignal_id)
}
`