import { Button, Popup, SemanticCOLORS } from 'semantic-ui-react';
import React from 'react';
import { SemanticSIZES } from 'semantic-ui-react/dist/commonjs/generic';
import ResourceStatus from '../stores/resourceStatus';
import { SingleEntities } from '../stores/single/single';

interface DeleteProps {
  canDelete: boolean | undefined;
  entity: SingleEntities | 'InvoiceProduct';
  remove: () => void;
  status: ResourceStatus;
  size?: SemanticSIZES;
  color?: SemanticCOLORS;
  style?: Partial<CSSStyleDeclaration>;
}

function DeleteButton(props: DeleteProps) {
  const {
    canDelete, entity, remove, status, size, color, style,
  } = props;
  if (canDelete === true) {
    return (
      <Popup
        trigger={(
          <Button
            icon="trash"
            loading={status === ResourceStatus.DELETING}
            floated="right"
            size={size}
            color={color}
            style={style}
          />
        )}
        on="click"
        hideOnScroll
        content={(
          <Button
            color="red"
            onClick={remove}
            loading={status === ResourceStatus.DELETING}
            style={{ marginTop: '0.5em' }}
          >
            Delete
            {' '}
            {entity.replace(/([a-z])([A-Z])/g, '$1 $2').trim().toLowerCase()}
          </Button>
        )}
        header="Are you sure you want to delete this?"
      />
    );
  }
  if (canDelete === false) {
    let deleteError: string;
    switch (entity) {
      case SingleEntities.Contract:
        deleteError = 'it has a different status than "Created", has products attached to it or has files attached to it';
        break;
      case SingleEntities.Invoice:
        deleteError = 'it has a different status than "Created" or has products attached to it';
        break;
      case SingleEntities.Company:
        deleteError = 'this company has contracts, invoices and/or contacts';
        break;
      case SingleEntities.Contact:
        deleteError = 'this contact has contracts';
        break;
      case SingleEntities.Product:
        deleteError = 'this product is used in contracts and/or invoices';
        break;
      case SingleEntities.ProductCategory:
        deleteError = 'this product category is used by one or more products';
        break;
      case SingleEntities.ProductInstance:
        deleteError = 'this product has an invoice or is delivered/cancelled/deferred or its contract is already sent or proposed';
        break;
      case 'InvoiceProduct':
        deleteError = 'this invoice has already been sent or finished';
        break;
      case SingleEntities.User:
        deleteError = 'this user still has active roles';
        break;
      default:
        throw new Error(`${entity} is not a valid DeleteEntity`);
    }

    return (
      <Popup
        trigger={(
          <Button.Group floated="right" size={size}>
            <Button
              disabled
              icon="trash"
              loading={status === ResourceStatus.DELETING}
              color={color}
              style={style}
            />
          </Button.Group>
        )}
        on="hover"
        mouseEnterDelay={500}
        content={`You cannot delete this, because ${deleteError}.`}
      />
    );
  }
  return null;
}

DeleteButton.defaultProps = {
  size: 'medium',
  color: undefined,
  style: {},
};

export default DeleteButton;
