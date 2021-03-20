import React from 'react';
import { Button, Icon } from 'semantic-ui-react';
import ResourceStatus from '../stores/resourceStatus';
import DeleteButton from './DeleteButton';
import { SingleEntities } from '../stores/single/single';

interface Props {
  editing: boolean;
  canDelete: boolean | undefined;
  canSave: boolean;
  entity: SingleEntities;
  status: ResourceStatus;
  style?: Partial<CSSStyleDeclaration>;

  cancel: () => void;
  edit: () => void;
  save: () => void;
  remove: () => void;
}

function PropsButtons(props: Props) {
  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    editing, canDelete, canSave, entity, status, cancel, edit, save, remove, style,
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
              disabled={!canSave}
              style={style}
            >
              <Icon name="save" />
              Save
            </Button>
            <Button icon floated="right" onClick={cancel} style={style}>
              Cancel
            </Button>
            <DeleteButton
              entity={entity}
              canDelete={canDelete}
              status={status}
              remove={remove}
              style={style}
            />
          </>
        );
      }
      return (
        <>
          <Button icon labelPosition="left" floated="right" onClick={edit} style={style}>
            <Icon name="pencil" />
            Edit
          </Button>
          <DeleteButton
            entity={entity}
            canDelete={canDelete}
            status={status}
            remove={remove}
            style={style}
          />
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
            style={style}
          >
            <Icon name="save" />
            Save
          </Button>
          <Button icon floated="right" onClick={cancel} disabled style={style}>
            Cancel
          </Button>
          <DeleteButton
            entity={entity}
            canDelete={canDelete === undefined ? undefined : false}
            status={status}
            remove={remove}
            style={style}
          />
        </>
      );
  }
}

PropsButtons.defaultProps = {
  style: {},
};

export default PropsButtons;
