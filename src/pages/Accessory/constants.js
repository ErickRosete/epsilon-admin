import gql from "graphql-tag";

//GraphQL
export const GET_ACCESSORIES = gql`
  {
    accessories {
      _id
      name
      code
      currentQuantity
      totalQuantity
    }
  }
`;

export const ADD_ACCESSORY = gql`
  mutation CreateAccessory($name: String!,$code:String!, $totalQuantity: Int, $currentQuantity: Int, $deleted: Boolean) {
    createAccessory(accessoryInput: {name: $name,code :$code totalQuantity: $totalQuantity, currentQuantity: $currentQuantity, deleted: $deleted}) {
      _id
      name
      code
      currentQuantity
      totalQuantity
    }
  }
`;

export const EDIT_ACCESSORY = gql`
  mutation UpdateAccessory($id: ID!, $name: String!, $code:String!, $totalQuantity: Int, $currentQuantity: Int, $deleted: Boolean) {
    updateAccessory(
      id: $id
      accessoryInput: { name: $name,code:$code, totalQuantity: $totalQuantity, currentQuantity: $currentQuantity, deleted: $deleted }
    ) {
      _id
      name
      code
      currentQuantity
      totalQuantity
    }
  }
`;

export const DELETE_ACCESSORY = gql`
  mutation DeleteAccessory($id: ID!) {
    deleteAccessory(id: $id) {
      _id
    }
  }
`;


//CSS
export const styles = theme => ({
  accessory: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    display: 'flex',
  },
  fab: {
    position: "fixed",
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2
  },
  progress: {
    margin: theme.spacing.unit * 2
  },
});
