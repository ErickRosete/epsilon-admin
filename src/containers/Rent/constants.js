import gql from "graphql-tag";

export const GET_PRODUCTS= gql`
query Products{
    products{
        name
        description
        totalQuantity
        currentQuantity
        imageLinks
        shortDescription
        accessories{
            name
            code
        }
        codes
        subcategories {
        name
        }
        _id
    }
}`;   

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

export const RENT_PRODUCT = gql`
mutation CreateRentProduct($quantity: Int, $code: String,$product: ID) {
  createRentProduct(rentProductInput: { quantity: $quantity, code: $code ,product:$product}) {
      _id
    }
}`;
export const RENT_ACC = gql`
mutation CreateRentAccessory($quantity: Int,$accessory: ID) {
  createRentAccessory(rentAccessoryInput: { quantity: $quantity,accessory:$accessory}) {
      _id
    }
}`;

export const RENT_TOTAL=gql`
mutation CreateRent($startDate: String,$endDate: String,$client:ID,$rentProducts:[ID],$rentAccessories:[ID]) {
  createRent(rentInput: 
  { startDate: $startDate,
    endDate: $endDate,
    client: $client,
    rentProducts: $rentProducts,
    rentAccessories: $rentAccessories
  })
    {
    _id
  }
}
`
// createRentAccessory(rentAccessoryInput: RentAccessoryInput!): RentAccessory
