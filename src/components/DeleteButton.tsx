import { Button, Popup } from 'semantic-ui-react';
import React from 'react';
import ResourceStatus from '../stores/resourceStatus';

export enum DeleteEntity {
  CONTRACT = 'contract',
  INVOICE = 'invoice',
  PRODUCT = 'product',
  COMPANY = 'company',
  CONTACT = 'contact',
}

interface DeleteProps {
  // eslint-disable-next-line react/require-default-props
  canDelete?: boolean | undefined;
  // eslint-disable-next-line react/require-default-props
  entity?: DeleteEntity;
  // eslint-disable-next-line react/require-default-props
  remove?: () => void;
  // eslint-disable-next-line react/require-default-props
  status?: ResourceStatus;
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
            {entity}
          </Button>
        )}
        header={`Are you sure you want to delete this ${entity}?`}
      />
    );
  }
  if (canDelete === false) {
    let deleteError: string;
    switch (entity) {
      case DeleteEntity.CONTRACT:
        deleteError = 'it has a different status than "Created" or has products attached to it';
        break;
      case DeleteEntity.INVOICE:
        deleteError = 'it has a different status than "Created" or has products attached to it';
        break;
      case DeleteEntity.COMPANY:
        deleteError = 'this company has contracts and/or invoices';
        break;
      case DeleteEntity.CONTACT:
        deleteError = 'this contact has contracts';
        break;
      case DeleteEntity.PRODUCT:
        deleteError = 'this product is used in contracts and/or invoices';
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
        content={`You cannot delete this ${entity}, because ${deleteError}`}
      />
    );
  }
  return null;
}

export default DeleteButton;
