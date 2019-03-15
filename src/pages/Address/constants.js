import gql from "graphql-tag";

export const SEARCH_USER_BY_ID= gql`
query MiQuery2($id: ID!) 
  {
    user(id: $id){
      _id
      name
      birthdate
      email
      mainAddress{
        _id
      }
      addresses{
          _id
      }
    }
  }
`;   
export const GET_ADDRESSES = gql`
    {
        addresses{
            _id
            street
        }
    }
`;
// export const GET_ADDRESS = gql`
//     {
//         address(id:"5c5c97646850f20204d875d7"){
//             _id
//             street
//         }
//     }
// `;
export const GET_ADDRESS = gql`
    query Address($id: ID!) {
        address(id: $id) 
        {
            _id
            street
        }
    }
`;

export const ADD_ADDRESS = gql`
  mutation createAddress(
    $street: String
    $exteriorNumber: Int
    $city: String
    $country: String
    $zipCode: Int
    ) 
    {
        createAddress(
        addressInput: {
            street: $street
            exteriorNumber: $exteriorNumber
            city: $city
            country: $country
            zipCode: $zipCode
        }
        ) {
        _id
        street
        }
    }
`;

export const ADD_ADDRESS_TO_USER=gql `
  mutation addAddressDiferente($userId:ID!,$addressId:ID!){
    addAddress(userId: $userId, addressId: $addressId){
      _id
      addresses{
        _id
      }
    }
  }
`
// createAddress(addressInput: AddressInput): Address
// input AddressInput{
//   street: String
//   exteriorNumber: Int
//   city: String
//   country: String
//   zipCode: Int
// }