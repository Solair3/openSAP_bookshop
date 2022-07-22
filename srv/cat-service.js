const cds = require('@sap/cds')
const { Books } = cds.entities

/** Service implementation for CatalogService */
module.exports = cds.service.impl(srv => {
  srv.after ('READ', 'Books', each => each.stock > 111 && _addDiscount2(each,11))
  srv.before ('CREATE', 'Orders', _reduceStock)
  // srv.before ('*', (req) => { console.debug ('>>>', req.method, req.target.name) })
})

/** Add some discount for overstocked books */
function _addDiscount2 (each,discount) {
  each.title += ` -- ${discount}% discount!`
}
/** Reduce stock of ordered books if available stock suffices */
function _reduceStock(req) {
    const { Items: OrderItems } = req.data;
    const tx = cds.transaction(req);
  
    return Promise
      .all(OrderItems.map((orderItem => tx.run(UPDATE(Books)
        .where({ ID: orderItem.book_ID })
        .and('stock >=', orderItem.amount)
        .set('stock -= ', orderItem.amount)))))
      .then(affectedRows => {
        if (affectedRows.some(row => !row)) {
          req.error(409, 'Sold out!');
        }
      });
  }