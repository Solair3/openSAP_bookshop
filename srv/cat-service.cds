using { sap.capire.bookshop as my } from '../db/schema';

@path:'/browse'
@imp:'./cat-service.js'
service CatalogService {

  @readonly entity Books as SELECT from my.Books { *, author.name as authorcreatedBy } excluding { createdBy, modifiedBy };

  @requires_: 'authenticated-user'
  @insertonly entity Orders as projection on my.Orders;

}