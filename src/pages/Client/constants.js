import gql from "graphql-tag";

//GraphQL
export const GET_CLIENTS = gql`
  {
    clients {
      _id
      name
      phone
      email
      detail
      address {
        _id
        street
        exteriorNumber
        city
        country
        zipCode
      }
    }
  }
`;


export const EDIT_CLIENT = gql`
  mutation UpdateClient($id: ID!, $name: String, $phone: String, $email: String, $detail: String) {
    updateClient(
      id: $id
      clientInput: { name: $name, phone: $phone, email: $email, detail: $detail }) {
        _id
        name
        phone
        email
        detail
        address {
            _id
            street
            exteriorNumber
            city
            country
            zipCode
        }
    }
  }
`;

export const ADD_CLIENT = gql`
  mutation CreateClient($name: String!, $phone: String, $email: String, $detail: String) {
    createClient(clientInput: {name: $name, phone: $phone, email: $email, detail: $detail}) {
        _id
        name
        phone
        email
        detail
        address {
            _id
            street
            exteriorNumber
            city
            country
            zipCode
        }
    }
  }
`;


export const DELETE_CLIENT = gql`
  mutation DeleteClient($id: ID!) {
    deleteClient(id: $id) {
      _id
    }
  }
`;

//CSS
export const styles = theme => ({
    client: {
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        display: 'flex',
    },
    fab: {
        position: "fixed",
        bottom: theme.spacing.unit * 2,
        right: theme.spacing.unit * 2
    }
});
