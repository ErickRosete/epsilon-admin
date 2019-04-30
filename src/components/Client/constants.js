import gql from "graphql-tag";

export const GET_CLIENT_INVENTORY = gql`
query ClientInventory($id: ID!) {
   clientInventory(id: $id) {
    client {
      _id
      name
      company
    }
    inventoryProducts {
      quantity
      product {
        _id
        name
        imageLinks
        codes
      }
    }
    inventoryAccessories{
      quantity
      accessory {
        _id
        name
      }
    }
  }
}
`;

//CSS
export const styles = theme => ({
    table: {
        minWidth: 700,
    },
});
