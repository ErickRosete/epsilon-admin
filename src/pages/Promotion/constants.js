import gql from "graphql-tag";

export const GET_PROMOTIONS = gql`
  {
    promotions {
      _id
      name
      imageLink
      active
    }
  }
`;

export const ADD_PROMOTION = gql`
  mutation CreatePromotion(
    $name: String
    $imageLink: String
    $active: Boolean
  ) {
    createPromotion(
      promotionInput: {
        name: $name
        imageLink: $imageLink
        active: $active
      }
    ) {
      _id
      name
      imageLink
      active
    }
  }
`;

export const EDIT_PROMOTION = gql`
  mutation UpdatePromotion(
    $id: ID!
    $name: String
    $imageLink: String
    $active: Boolean
  ) {
    updatePromotion(
      id: $id
      promotionInput: {
        name: $name
        imageLink: $imageLink
        active: $active
      }
    ) {
        _id
        name
        imageLink
        active
    }
  }
`;

export const DELETE_PROMOTION = gql`
  mutation DeletePromotion($id: ID!) {
    deletePromotion(id: $id) {
      _id
    }
  }
`;

//CSS
export const styles = theme => ({
    promotion: {
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        display: 'flex',
    },
    fab: {
        position: "absolute",
        bottom: theme.spacing.unit * 2,
        right: theme.spacing.unit * 2
    },
    progress: {
        margin: theme.spacing.unit * 2
    },
});
