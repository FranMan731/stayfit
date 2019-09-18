import gql from "graphql-tag";

export const USUARIOS_QUERY = gql`
  query getUsuarios {
    getUsuarios
  }
`;

export const LOGIN = gql`
  query login($email: String!, $password: String!, $onesignal_id: String) {
    login(email: $email, password: $password, onesignal_id: $onesignal_id)
  }
`;

export const GET_EJERCICIOS = gql`
  {
    getEjercicios {
      _id
      nombre
      actividad
      imagen
    }
  }
`;
