import React from "react";

const CustomerCard = props => {
  const customer = props.selectedCustomer;
//   const productQuotations = props.quotation.productQuotations;

  return (
    <div style={{ border: '1px solid black', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem' }}>
        <h3 style={{ textAlign: 'center', marginTop: 0 }}>Cliente</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div><b>Nombre: </b>{customer.name}</div>
        <div><b>Compañía: </b>{customer.company}</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div><b>Teléfono: </b>{customer.phone}</div>
        <div><b>Correo: </b>{customer.email}</div>
        </div>
        <div><b>Dirección: </b>{customer.address}</div>
    </div>
  );
}
export default CustomerCard;
