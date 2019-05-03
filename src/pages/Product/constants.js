import gql from "graphql-tag";

export const GET_PRODUCT = gql`
  query Product($id: ID!) {
    product(id: $id) {
      _id
      name
      imageLinks
      shortDescription
      details
      description
      currentQuantity
      totalQuantity
      codes
      subcategories {
        _id
        name
      }
      accessories {
        _id
        name
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
      details
      description
      currentQuantity
      totalQuantity
      codes
      accessories {
        _id
        name
      }
    }
  }
`;

export const ADD_PRODUCT = gql`
  mutation CreateProduct(
    $name: String
    $imageLinks: [String]
    $shortDescription: String
    $details: String
    $description: String
    $subcategories: [ID]
    $accessories: [ID]
    $currentQuantity: Int
    $totalQuantity: Int
    $codes: [String]
    $deleted: Boolean
  ) {
    createProduct(
      productInput: {
        name: $name
        imageLinks: $imageLinks
        shortDescription: $shortDescription
        details: $details
        description: $description
        subcategories: $subcategories
        currentQuantity: $currentQuantity
        totalQuantity: $totalQuantity
        accessories: $accessories
        codes: $codes
        deleted: $deleted
      }
    ) {
      _id
      name
      imageLinks
      shortDescription
      details
      description
      currentQuantity
      totalQuantity
      codes
      accessories {
        _id
        name
      }
    }
  }
`;

export const EDIT_PRODUCT = gql`
  mutation UpdateProduct(
    $id: ID!
    $name: String
    $imageLinks: [String]
    $shortDescription: String
    $details: String
    $description: String
    $subcategories: [ID]
    $accessories: [ID]
    $currentQuantity: Int
    $totalQuantity: Int
    $codes: [String]
  ) {
    updateProduct(id: $id,productInput: {
        name: $name
        imageLinks: $imageLinks
        shortDescription: $shortDescription
        details: $details
        description: $description
        subcategories: $subcategories
        currentQuantity: $currentQuantity
        totalQuantity: $totalQuantity
        accessories: $accessories
        codes: $codes
      }
    ) {
      _id
      name
      imageLinks
      shortDescription
      details
      description
      currentQuantity
      totalQuantity
      codes
      accessories {
        _id
        name
      }
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
