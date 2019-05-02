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

export const GET_CLIENT_RENTS = gql`
query ClientRents($id: ID!) {
   clientRents(id: $id) {
     _id
     startDate
     endDate
     client {
      _id
      name
      company
    }
    rentProducts {
      _id
      code
      quantity
      product {
        _id
        name
        imageLinks
        codes
      }
    }
    rentAccessories {
      _id
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
  // table: {
  //   minWidth: 700,
  // },
  center: {
    textAlign: 'center'
  },
  dialog: {
    minHeight: '50vh',
  },
  paper: {
    overflowX: 'auto', marginRight: 'auto', marginLeft: 'auto', marginTop: '15px', padding: '20px', margin: '10px'
  },
  subtitle: {
    textAlign: 'center', marginBottom: '1px'
  },
  tableCell: {
    padding: 0
  }
});
