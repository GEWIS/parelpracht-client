import React from 'react';
import { Button, Icon } from 'semantic-ui-react';
import ResourceStatus from '../../stores/resourceStatus';

interface Props {
  editing: boolean;
  status: ResourceStatus;

  cancel: () => void;
  edit: () => void;
  save: () => void;
}

function CompanyPropsButtons(props: Props) {
  const {
    editing, status, cancel, edit, save,
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
          </>
        );
      }
      return (
        <Button icon labelPosition="left" floated="right" onClick={edit}>
          <Icon name="pencil" />
          Edit
        </Button>
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
        </>
      );
  }
}

export default CompanyPropsButtons;
