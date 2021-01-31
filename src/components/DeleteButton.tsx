import { Button, Popup } from 'semantic-ui-react';
import React from 'react';
import ResourceStatus from '../stores/resourceStatus';
import { SingleEntities } from '../stores/single/single';

interface DeleteProps {
  canDelete: boolean | undefined;
  entity: SingleEntities;
  remove: () => void;
  status: ResourceStatus;
}

function DeleteButton(props: DeleteProps) {
  const {
    canDelete, entity, remove, status,
  } = props;
  if (canDelete === true) {
    return (
      <Popup
        trigger={(
          <Button
            icon="trash"
            loading={status === ResourceStatus.DELETING}
            floated="right"
          />
        )}
        on="click"
        content={(
          <Button
            color="red"
            onClick={remove}
            loading={status === ResourceStatus.DELETING}
            style={{ marginTop: '0.5em' }}
          >
            Delete
            {' '}
            {entity.toLowerCase()}
          </Button>
        )}
        header={`Are you sure you want to delete this ${entity.toLowerCase()}?`}
      />
    );
  }
  if (canDelete === false) {
    let deleteError: string;
    switch (entity) {
      case SingleEntities.Contract:
        deleteError = 'it has a different status than "Created" or has products attached to it';
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
      case SingleEntities.User:
        deleteError = 'this user still has active roles';
        break;
      default:
        throw new Error(`${entity} is not a valid DeleteEntity`);
    }
    return (
      <Popup
        trigger={(
          <Button.Group floated="right">
            <Button
              disabled
              icon="trash"
              loading={status === ResourceStatus.DELETING}
            />
          </Button.Group>
        )}
        on="hover"
        mouseEnterDelay={500}
        content={`You cannot delete this ${entity}, because ${deleteError}.`}
      />
    );
  }
  return null;
}

export default DeleteButton;
