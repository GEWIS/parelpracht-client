import React from 'react';
import {
  Button, Icon, Image, Input, Modal,
} from 'semantic-ui-react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { withTranslation, WithTranslation } from 'react-i18next';
import { FilesClient } from '../../clients/filesClient';
import { Client, User } from '../../clients/server.generated';
import { SingleEntities } from '../../stores/single/single';
import UserAvatar from '../entities/user/UserAvatar';
import { RootState } from '../../stores/store';
import { authFetchProfile } from '../../stores/auth/actionCreators';

interface Props extends WithTranslation {
  entity: SingleEntities;
  entityId: number;
  entityName: string;
  fileName: string;
  fetchEntity: (entityId: number) => void;

  loggedInUser?: User;
  fetchAuthProfile: () => void;
}

interface State {
  open: boolean;
}

class LogoAvatarModal extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      open: false,
    };
  }

  updateAuthedUser = () => {
    const {
      entity, entityId, loggedInUser, fetchAuthProfile,
    } = this.props;

    if (entity === SingleEntities.User && entityId === loggedInUser!.id) {
      fetchAuthProfile();
    }
  };

  openModal = () => {
    this.setState({ open: true });
  };

  closeModal = () => {
    this.setState({ open: false });
  };

  updateImage = async (fileData: any) => {
    const client = new FilesClient();
    const {
      entityId, entity, fetchEntity,
    } = this.props;
    const formData = new FormData();
    formData.append('file', fileData);
    const result = await client.uploadLogo(
      entityId, formData, entity,
    );
    if (result) {
      fetchEntity(entityId);
    }

    if (entity === SingleEntities.User) this.updateAuthedUser();
  };

  removeImage = async () => {
    const { entity, entityId, fetchEntity } = this.props;
    const client = new Client();
    let result;
    if (entity === SingleEntities.Company) {
      result = await client.deleteCompanyLogo(entityId);
    } else if (entity === SingleEntities.User) {
      result = await client.deleteUserAvatar(entityId);
    }
    if (result) {
      fetchEntity(entityId);
    }

    if (entity === SingleEntities.User) this.updateAuthedUser();
  };

  public renderUserAvatar(): JSX.Element {
    const {
      entityName, entityId, fileName, t,
    } = this.props;
    const { open } = this.state;
    const image = fileName === '' ? (
      <Button
        floated="right"
        primary
        style={{
          marginTop: '10px',
          whiteSpace: 'nowrap',
        }}
      >
        <Icon
          name="user circle"
        />
        {t('pages.user.avatar.addButton')}
      </Button>
    ) : (
      <div>
        <UserAvatar fileName={fileName} size="4rem" clickable imageCss={{ float: 'right' }} />
      </div>
    );

    const imageModal = fileName === '' ? (
      <Image>
        <Icon
          name="user circle"
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
        {t('pages.user.avatar.deleteUsersAvatar', { name: entityName })}
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
          {t('pages.user.avatar.modalHeader', { name: entityName })}
        </Modal.Header>
        <Modal.Content image>
          {imageModal}
          <Modal.Description>
            <h4>
              {t('pages.user.avatar.uploadUsersAvatar', { name: entityName })}
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
          <Button onClick={() => this.closeModal()}>{t('buttons.cancel')}</Button>
        </Modal.Actions>
      </Modal>
    );
  }

  public renderCompanyLogo(): JSX.Element {
    const { entityName, entityId, fileName } = this.props;
    const { open } = this.state;
    const image = fileName === '' ? (
      <Button
        floated="right"
        primary
        style={{
          marginTop: '10px',
          whiteSpace: 'nowrap',
        }}
      >
        <Icon
          name="building"
        />
        Add company logo
      </Button>
    ) : (
      <div>
        <Image
          floated="right"
          src={`/static/logos/${fileName}`}
          style={{ cursor: 'pointer', maxHeight: '4rem', width: 'auto' }}
          title="Click to upload a new image"
        />
      </div>
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

  public render() {
    const { entity } = this.props;
    switch (entity) {
      case SingleEntities.Company:
        return this.renderCompanyLogo();
      case SingleEntities.User:
        return this.renderUserAvatar();
      default:
        throw new Error(`Entity ${entity} does not support logos or avatars`);
    }
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    loggedInUser: state.auth.profile,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  fetchAuthProfile: () => dispatch(authFetchProfile()),
});

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(LogoAvatarModal));
