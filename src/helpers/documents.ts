import { SingleEntities } from '../stores/single/single';

/**
 * Get the id and title of a document as a string
 * @param id of the document
 * @param title of the document
 * @param entity type of the document
 */
export function formatDocumentIdTitle(id: number, title: string, entity: SingleEntities): string {
  let entityIdentifier = '';
  if (entity === SingleEntities.Invoice) {
    entityIdentifier = 'F';
  } else if (entity === SingleEntities.Contract) {
    entityIdentifier = 'C';
  } else if (entity === SingleEntities.Company) {
    entityIdentifier = 'Company ';
  } else if (entity === SingleEntities.Contact) {
    entityIdentifier = 'Contact ';
  } else if (entity === SingleEntities.Product) {
    entityIdentifier = 'Product ';
  } else if (entity === SingleEntities.ProductCategory) {
    entityIdentifier = 'Product Category ';
  } else if (entity === SingleEntities.ProductInstance) {
    entityIdentifier = 'Product Instance ';
  } else if (entity === SingleEntities.User) {
    entityIdentifier = 'User ';
  }
  return `${entityIdentifier}${id} ${title}`;
}
