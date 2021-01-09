import React from 'react';
import { Button, Icon } from 'semantic-ui-react';
import ResourceStatus from '../stores/resourceStatus';
import DeleteButton, { DeleteEntity } from './DeleteButton';

interface Props {
  editing: boolean;
  // eslint-disable-next-line react/require-default-props
  canDelete?: boolean | undefined;
  // eslint-disable-next-line react/require-default-props
  entity?: DeleteEntity;
  status: ResourceStatus;

  cancel: () => void;
  edit: () => void;
  save: () => void;
  // eslint-disable-next-line react/require-default-props
  remove?: () => void;
}

function PropsButtons(props: Props) {
  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    editing, canDelete, entity, status, cancel, edit, save, remove,
  } = props;

  switch (status) {
    default:
    case ResourceStatus.FETCHED:
      if (editing) {
        return (
          <>
            <Button
              icon
              labelPosition="left"
              color="green"
              floated="right"
              onClick={save}
            >
              <Icon name="save" />
              Save
            </Button>
            <Button icon floated="right" onClick={cancel}>
              Cancel
            </Button>
            <DeleteButton entity={entity} canDelete={canDelete} status={status} remove={remove} />
          </>
        );
      }
      return (
        <>
          <Button icon labelPosition="left" floated="right" onClick={edit}>
            <Icon name="pencil" />
            Edit
          </Button>
          <DeleteButton entity={entity} canDelete={canDelete} status={status} remove={remove} />
        </>
      );
    case ResourceStatus.SAVING:
      return (
        <>
          <Button
            icon
            labelPosition="left"
            color="green"
            floated="right"
            loading
          >
            <Icon name="save" />
            Save
          </Button>
          <Button icon floated="right" onClick={cancel} disabled>
            Cancel
          </Button>
          <DeleteButton
            entity={entity}
            canDelete={canDelete === undefined ? undefined : false}
            status={status}
            remove={remove}
          />
        </>
      );
  }
}

export default PropsButtons;
