import gql from "graphql-tag";

export const GET_PROMOTION = gql`
  {
    firstPromotion {
      _id
      title
      subtitle
      percentage
    }
  }
`;

export const EDIT_PROMOTION = gql`
  mutation UpdatePromotion(
    $id: ID!
    $title: String
    $subtitle: String
    $percentage: String
  ) {
    updatePromotion(
      id: $id
      promotionInput: {
        title: $title
        subtitle: $subtitle
        percentage: $percentage
      }
    ) {
        _id
        title
        subtitle
        percentage
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
        position: "fixed",
        bottom: theme.spacing.unit * 2,
        right: theme.spacing.unit * 2
    },
    progress: {
        margin: theme.spacing.unit * 2
    },
});
