import gql from "graphql-tag";

export const GET_PRODUCT = gql`
  query Product($id: ID!) {
    product(id: $id) {
      _id
      name
      imageLinks
      shortDescription
      description
      quantity
      generic
      codes
      subcategories {
        _id
      }
    }
  }
`;

export const GET_PRODUCTS = gql`
  {
    products {
      _id
      name
      imageLinks
      shortDescription
      description
      quantity
      generic
      codes
    }
  }
`;

export const ADD_PRODUCT = gql`
  mutation CreateProduct(
    $name: String
    $imageLinks: [String]
    $shortDescription: String
    $description: String
    $subcategories: [ID]
    $quantity: Int
    $generic: Boolean
    $codes: [String]
  ) {
    createProduct(
      productInput: {
        name: $name
        imageLinks: $imageLinks
        shortDescription: $shortDescription
        description: $description
        subcategories: $subcategories
        quantity: $quantity
        generic: $generic
        codes: $codes
      }
    ) {
      _id
      name
      price
      imageLinks
      shortDescription
      description
      quantity
      generic
      codes
    }
  }
`;

export const EDIT_PRODUCT = gql`
  mutation UpdateProduct(
    $id: ID!
    $name: String
    $imageLinks: [String]
    $shortDescription: String
    $description: String
    $subcategories: [ID]
    $quantity: Int
    $generic: Boolean
    $codes: [String]
  ) {
    updateProduct(
      id: $id
      productInput: {
        name: $name
        imageLinks: $imageLinks
        shortDescription: $shortDescription
        description: $description
        subcategories: $subcategories
        quantity: $quantity
        generic: $generic
        codes: $codes
      }
    ) {
      _id
      name
      imageLinks
      shortDescription
      description
      quantity
      generic
      codes
    }
  }
`;

export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id) {
      _id
    }
  }
`;
