import gql from "graphql-tag";

//GraphQL
export const GET_SUBCATEGORIES = gql`
  {
    subcategories {
      _id
      name
      description
      imageLink
    }
  }
`;

export const EDIT_SUBCATEGORY = gql`
  mutation UpdateSubcategory($id: ID!, $name: String!, $imageLink: String, $description: String) {
    updateSubcategory(
      id: $id
      subcategoryInput: { name: $name, imageLink: $imageLink, description: $description }
    ) {
      _id
      name
      description
      imageLink
    }
  }
`;

export const ADD_SUBCATEGORY = gql`
  mutation CreateSubcategory($name: String!, $imageLink: String, $description: String) {
    createSubcategory(subcategoryInput: {name: $name, imageLink: $imageLink, description: $description}) {
      _id
      name
      description
      imageLink
    }
  }
`;

export const DELETE_SUBCATEGORY = gql`
  mutation DeleteSubcategory($id: ID!) {
    deleteSubcategory(id: $id) {
      _id
    }
  }
`;

//CSS
export const styles = theme => ({
    subcategory: {
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
