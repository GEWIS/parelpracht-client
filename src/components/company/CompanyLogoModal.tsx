import { update } from 'lodash';
import React from 'react';
import {
  Modal, Image, Button, Input, Icon,
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
      <Image floated="right" style={{ cursor: 'pointer' }}>
        <Icon
          name="building"
          size="large"
        />
      </Image>
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
            <Input
              type="file"
              id={`form-file-${entityId}-file`}
              onChange={(e) => this.updateImage(e.target.files![0])}
              style={{ width: '80%' }}
            />
            <Button size="large" floated="right" icon="trash" onClick={() => this.removeImage()} />
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
