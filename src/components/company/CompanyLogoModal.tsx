import { update } from 'lodash';
import React from 'react';
import {
  Modal, Image, Button, Input,
} from 'semantic-ui-react';
import { FilesClient } from '../../clients/filesClient';
import { Client, Company } from '../../clients/server.generated';
import { SingleEntities } from '../../stores/single/single';

interface Props {
  entity: SingleEntities;
  entityId: number;
  entityName: string;
  fileName: string;
  fetchEntity: (entityId: number) => void;
  deleteFunction: string;
}

interface State {
  open: boolean;

}

class CompanyLogoModal extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      open: false,
    };
  }

  openModal = () => {
    this.setState({ open: true });
  };

  closeModal = () => {
    this.setState({ open: false });
  };

  updateImage = async (fileData: any) => {
    const client = new FilesClient();
    const { entityId, entity, fetchEntity } = this.props;
    const formData = new FormData();
    formData.append('file', fileData);
    const result = await client.uploadLogo(
      entityId, formData, entity,
    );
    if (result) {
      fetchEntity(entityId);
    }
  };

  removeImage = async () => {
    const { deleteFunction, entityId } = this.props;
    const client = new Client();
    if (deleteFunction === 'company') {
      await client.deleteCompanyLogo(entityId);
    } else if (deleteFunction === 'user') {
      await client.deleteUserAvatar(entityId);
    }
  };

  public render() {
    const { entityName, entityId, fileName } = this.props;
    const { open } = this.state;
    return (
      <Modal
        onClose={() => this.closeModal()}
        onOpen={() => this.openModal()}
        open={open}
        size="small"
        trigger={(
          <Image
            src={`/static/logos/${fileName}`}
            as="a"
            size="small"
            style={{ cursor: 'pointer' }}
          />
    )}
      >
        <Modal.Header>
          {entityName}
          {' '}
          Logo
        </Modal.Header>
        <Modal.Content image>
          <Image size="medium" src={`/static/logos/${fileName}`} wrapped />
          <Modal.Description>
            <h4>Change logo:</h4>
            <Input
              type="file"
              id={`form-file-${entityId}-file`}
              onChange={(e) => this.updateImage(e.target.files![0])}
            />
            <Button onClick={() => this.removeImage()}>
              {' '}
              Remove Logo
            </Button>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => this.closeModal()}>Cancel</Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default CompanyLogoModal;
