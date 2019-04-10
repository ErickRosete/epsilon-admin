import gql from "graphql-tag";

//GraphQL
export const GET_CLIENTS = gql`
  {
    clients {
      _id
      name
      email
      company
      phone
      address
    }
  }
`;


export const EDIT_CLIENT = gql`
  mutation UpdateClient($id: ID!, $name: String!, $phone: String, $email: String, $company: String, $address: String) {
    updateClient(
      id: $id
      clientInput: { name: $name, phone: $phone, email: $email, company: $company, address: $address  }) {
        _id
        name
        company
        phone
        email
        address
    }
  }
`;

export const ADD_CLIENT = gql`
  mutation CreateClient( $name: String!, $phone: String, $email: String, $company: String, $address: String) {
    createClient(clientInput: { name: $name, phone: $phone, email: $email, company: $company, address: $address  })  {
        _id
        name
        company
        phone
        email
        address
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
