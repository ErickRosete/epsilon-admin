import gql from "graphql-tag";

export const GET_QUOTATIONS = gql`
  {
    quotations {
      _id
      createdAt
      client {
          email
          name
          company
          address
          phone
      }
      productQuotations {
        _id
        quantity
        comment
        product {
            name
            imageLinks
        }
      }
    }
  }
`;

//CSS
export const styles = theme => ({
    quotation: {
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
