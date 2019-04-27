import gql from "graphql-tag";

export const GET_PRODUCTS= gql`
query Products
    {products{
        _id
        imageLinks
        name
        totalQuantity
        currentQuantity
    }
}	
`
export const GET_ACCESORIES= gql`
query Accesories
    {accessories{
        _id
        name
        totalQuantity
        currentQuantity
    }
}	
`


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
    },
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
        overflowX: 'auto',
      },
    table: {
        minWidth: 700,
      },
  });