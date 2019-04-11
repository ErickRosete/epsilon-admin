import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";

const DetailDialog = props => {
  const client = props.quotation.client;
  const productQuotations = props.quotation.productQuotations;

  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
    >
      <DialogTitle id="alert-dialog-title">
        Detalle de solicitud de cotización
      </DialogTitle>
      <DialogContent>
        <div style={{ border: '1px solid black', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem' }}>
          <h3 style={{ textAlign: 'center', marginTop: 0 }}>Cliente</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div><b>Nombre: </b>{client.name}</div>
            <div><b>Compañía: </b>{client.company}</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div><b>Teléfono: </b>{client.phone}</div>
            <div><b>Correo: </b>{client.email}</div>
          </div>
          <div><b>Dirección: </b>{client.address}</div>
        </div>

        <div style={{ border: '1px solid black', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem', maxHeight: '30vh', overflow: 'auto' }}>
          <h3 style={{ textAlign: 'center', marginTop: 0 }}>Productos</h3>

          {productQuotations.map((productQuotation) => {
            return (
              <div key={productQuotation._id} style={{ display: 'flex' }}>
                <div style={{ marginRight: '1rem' }}>
                  <img width={100} src={productQuotation.product.imageLinks[0]} alt={productQuotation.product.name}></img>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', flexGrow: '1' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>{productQuotation.product.name}</span>
                    <span><b>Cantidad: </b>{productQuotation.quantity}</span>
                  </div>
                  <div>
                    <b>Comentarios: </b>{productQuotation.comment ? productQuotation.comment : "Ninguno"}
                  </div>
                </div>
              </div>
            );
          })}

        </div>

      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose} color="primary" autoFocus>
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DetailDialog;
