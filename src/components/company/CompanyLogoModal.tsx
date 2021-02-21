import React from 'react';
import {
  Modal, Image, Button, Input, Icon,
} from 'semantic-ui-react';
import { FilesClient } from '../../clients/filesClient';
import { Client } from '../../clients/server.generated';
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
    const { deleteFunction, entityId, fetchEntity } = this.props;
    const client = new Client();
    let result;
    if (deleteFunction === 'company') {
      result = await client.deleteCompanyLogo(entityId);
    } else if (deleteFunction === 'user') {
      result = await client.deleteUserAvatar(entityId);
    }
    if (result) {
      fetchEntity(entityId);
    }
  };

  public render() {
    const { entityName, entityId, fileName } = this.props;
    const { open } = this.state;
    const image = fileName === '' ? (
      <Button
        floated="right"
        primary
        style={{
          marginTop: '10px',
        }}
      >
        <Icon
          name="building"
        />
        Add company logo
      </Button>
    ) : (
      <Image
        floated="right"
        src={`/static/logos/${fileName}`}
        style={{ cursor: 'pointer', maxHeight: '50px', width: 'auto' }}
      />
    );

    const imageModal = fileName === '' ? (
      <Image>
        <Icon
          name="building"
          size="huge"
        />
      </Image>
    ) : (
      <Image
        src={`/static/logos/${fileName}`}
        size="medium"
        wrapped
      />
    );

    const deleteButton = fileName === '' ? (
      ''
    ) : (
      <Button
        color="red"
        floated="left"
        onClick={() => this.removeImage()}
      >
        <Icon name="trash" />
        Delete
        {' '}
        {entityName}
        {' '}
        logo
      </Button>
    );

    return (
      <Modal
        onClose={() => this.closeModal()}
        onOpen={() => this.openModal()}
        open={open}
        size="small"
        trigger={image}
      >
        <Modal.Header>
          {entityName}
          {' '}
          Logo
        </Modal.Header>
        <Modal.Content image>
          {imageModal}
          <Modal.Description>
            <h4>
              Upload
              {' '}
              {entityName}
              {' '}
              logo
            </h4>
            <Input
              type="file"
              id={`form-file-${entityId}-file`}
              onChange={(e) => this.updateImage(e.target.files![0])}
              style={{ width: '80%' }}
            />
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          {deleteButton}
          <Button onClick={() => this.closeModal()}>Cancel</Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default CompanyLogoModal;
