import { Component, ReactNode } from 'react';
import { Button, Icon, Image, Input, Modal } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { withTranslation, WithTranslation } from 'react-i18next';
import { FilesClient } from '../../clients/filesClient';
import { Client, User } from '../../clients/server.generated';
import { SingleEntities } from '../../stores/single/single';
import { RootState } from '../../stores/store';
import { authFetchProfile } from '../../stores/auth/actionCreators';
import UserBackground from '../entities/user/UserBackground';

interface Props extends WithTranslation {
  entity: SingleEntities;
  entityId: number;
  entityName: string;
  fileName: string;
  fetchEntity: (entityId: number) => void;
  adminView: boolean;

  loggedInUser?: User;
  fetchAuthProfile: () => void;
}

interface State {
  open: boolean;
}

class UserBackgroundModal extends Component<Props, State> {
  static defaultProps = {
    loggedInUser: undefined,
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      open: false,
    };
  }

  updateAuthedUser = () => {
    const { entity, entityId, loggedInUser, fetchAuthProfile } = this.props;

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

  updateImage = async (fileData: Blob) => {
    const client = new FilesClient();
    const { entityId, entity, fetchEntity } = this.props;
    const formData = new FormData();
    formData.append('file', fileData);
    const result = await client.uploadBackground(entityId, formData, entity);
    if (result) {
      fetchEntity(entityId);
    }

    this.updateAuthedUser();
    this.closeModal();
  };

  removeImage = async () => {
    const { entityId, fetchEntity } = this.props;
    const client = new Client();
    const result = await client.deleteUserBackground(entityId);
    if (result) {
      fetchEntity(entityId);
    }

    this.updateAuthedUser();
    this.closeModal();
  };

  public renderUserBackground(): ReactNode {
    const { entityName, entityId, fileName, adminView, t } = this.props;

    const { open } = this.state;
    const image =
      fileName === '' ? (
        <Button primary disabled={adminView}>
          <Icon name="picture" />
          {t('pages.user.background.addPersonalBackground')}
        </Button>
      ) : (
        <div>
          <UserBackground fileName={fileName} clickable />
        </div>
      );

    const imageModal =
      fileName === '' ? (
        <Image>
          <Icon name="picture" size="huge" />
        </Image>
      ) : (
        <Image src={`/static/backgrounds/${fileName}`} size="medium" wrapped />
      );

    const deleteButton =
      fileName === '' ? (
        ''
      ) : (
        <Button
          color="red"
          floated="left"
          onClick={() => {
            this.removeImage().catch(console.error);
          }}
        >
          <Icon name="trash" />
          {t('pages.user.background.deleteUsersBackground', { name: entityName })}
        </Button>
      );

    const uploadButton = adminView ? (
      <h4> Uploading not possible as admin</h4>
    ) : (
      <Modal.Description>
        <h4>{t('pages.user.background.uploadUsersBackground', { name: entityName })}</h4>
        <Input
          type="file"
          id={`form-file-${entityId}-file`}
          onChange={(e) => {
            this.updateImage(e.target.files![0]).catch(console.error);
          }}
          style={{ width: '80%' }}
        />
      </Modal.Description>
    );

    return (
      <Modal onClose={() => this.closeModal()} onOpen={() => this.openModal()} open={open} size="small" trigger={image}>
        <Modal.Header>{t('pages.user.background.modalHeader', { name: entityName })}</Modal.Header>
        <Modal.Content image>
          {imageModal}
          {uploadButton}
        </Modal.Content>
        <Modal.Actions>
          {deleteButton}
          <Button onClick={() => this.closeModal()}>{t('pages.user.background.cancel')}</Button>
        </Modal.Actions>
      </Modal>
    );
  }

  public render() {
    const { entity } = this.props;
    switch (entity) {
      case SingleEntities.User:
        return this.renderUserBackground();
      default:
        throw new Error(`Entity ${entity} does not support backgrounds`);
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

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(UserBackgroundModal));
