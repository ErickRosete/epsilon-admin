import gql from "graphql-tag";

export const GET_RENTS = gql`
  {
    rents {
      _id
      startDate
      endDate
      client {
          email
          name
          company
          address
          phone
      }
      rentProducts {
        _id
        quantity
        code
        product {
            name
            imageLinks
        }
      }
    }
  }
`;

export const GET_RENT = gql`
  query Rent($id: ID!) {
    rent(id: $id) {
      _id
      startDate
      endDate
      client {
          email
          name
          company
          address
          phone
      }
      rentProducts {
        _id
        quantity
        code
        product {
            name
            imageLinks
        }
      }
    }
  }
`;

export const ADD_RENT = gql`
  mutation CreateRent($startDate:String, $endDate:String, $client:ID, $rentProducts:[ID]) {
    createRent(rentInput:{startDate: $startDate, endDate: $endDate, client: $client, rentProducts: $rentProducts}) {
      _id
      startDate
      endDate
      client {
          email
          name
          company
          address
          phone
      }
      rentProducts {
        _id
        quantity
        code
        product {
            name
            imageLinks
        }
      }
    }
  }
`;

export const EDIT_RENT = gql`
mutation UpdateRent($id: ID!, $startDate:String, $endDate:String, $client:ID, $rentProducts:[ID]) {
  updateRent(id: $id, rentInput:{startDate: $startDate, endDate: $endDate, client: $client, rentProducts: $rentProducts}) {
      _id
      startDate
      endDate
      client {
          email
          name
          company
          address
          phone
      }
      rentProducts {
        _id
        quantity
        code
        product {
            name
            imageLinks
        }
      }
    }
  }
`;

export const ADD_RENT_PRODUCT = gql`
  mutation CreateRentProduct($quantity: Int, $code: String, $product: ID) {
    createRentProduct(rentProductInput:{ quantity: $quantity, code: $comment, product: $product }) {
      _id
      quantity
      code
      product {
          name
          imageLinks
      }
    }
  }
`;

//CSS
export const styles = theme => ({
  rent: {
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
