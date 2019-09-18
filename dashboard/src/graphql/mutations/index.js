import gql from "graphql-tag";

export const EDITAR_USUARIO = gql`
  mutation updateUsuario($input: UsuarioInput) {
    updateUsuario(input: $input) {
      rol
    }
  }
`;

export const EDITAR_EJERCICIO = gql`
  mutation updateEjercicio($input: EjercicioInput) {
    updateEjercicio(input: $input) {
      _id
      nombre
      actividad
      imagen
    }
  }
`;

export const ELIMINAR_EJERCICIO = gql`
  mutation deleteEjercicio($_id: ID!) {
    deleteEjercicio(_id: $_id)
  }
`;
