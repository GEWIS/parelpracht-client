import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import {
  Button, Icon, Input, Popup, Table,
} from 'semantic-ui-react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import {
  Partial_FileParams_ as Partial_FileParams,
} from '../../clients/server.generated';
import { FilesClient } from '../../clients/filesClient';
import { formatLastUpdate } from '../../helpers/timestamp';
import { deleteFileSingle, saveSingleFile } from '../../stores/single/actionCreators';
import { SingleEntities } from '../../stores/single/single';
import { GeneralFile } from './GeneralFile';
import ResourceStatus from '../../stores/resourceStatus';
import { TransientAlert } from '../../stores/alerts/actions';
import { showTransientAlert } from '../../stores/alerts/actionCreators';

interface Props extends RouteComponentProps {
  file: GeneralFile;
  create: boolean;
  closeCreate?: (shouldUpdate: boolean) => void;

  entity: SingleEntities;
  entityId: number;

  saveFile: (entityId: number, fileId: number,
    file: Partial_FileParams, entity: SingleEntities) => void;
  deleteFile: (entityId: number, fileId: number, entity: SingleEntities) => void;
  fetchEntity: (entityId: number) => void;
  status: ResourceStatus;
  showTransientAlert: (alert: TransientAlert) => void;
}

interface State {
  editing: boolean;

  fileName: string;
  fileData: any;

  saveLoading: boolean;
}

class SingleFile extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      editing: false,
      saveLoading: false,
      ...this.extractState(props),
    };

    if (this.props.create
      && (this.props.closeCreate === undefined || this.props.closeCreate === null)) {
      throw new Error('A "create" SingleFile should also have a closeCreate function');
    }
  }

  private async getFile() {
    const {
      entityId, file, entity,
    } = this.props;

    const client = new FilesClient();
    await client.getFile(entityId, file.id, entity);
  }

  private toFormDataParams = (): FormData => {
    const formData = new FormData();
    formData.append('name', this.state.fileName);
    formData.append('file', this.state.fileData);
    return formData;
  };

  private toPOSTParams = (): Partial_FileParams => {
    return new Partial_FileParams({
      name: this.state.fileName,
    });
  };

  private extractState = (props: Props) => {
    const { file } = props;
    return {
      fileName: file.name,
      fileData: undefined,
    };
  };

  edit = () => {
    this.setState({ editing: true, ...this.extractState(this.props) });
  };

  cancel= () => {
    if (!this.props.create) {
      this.setState({ editing: false, ...this.extractState(this.props) });
    } else if (this.props.closeCreate) {
      this.props.closeCreate(false);
    }
  };

  save = async () => {
    this.setState({ saveLoading: true });

    if (this.props.create) {
      const client = new FilesClient();
      const result = await client.uploadFile(
        this.props.entityId, this.toFormDataParams(), this.props.entity,
      );
      if (result) {
        if (this.props.closeCreate) this.props.closeCreate(true);
      }
    } else {
      this.props.saveFile(this.props.entityId, this.props.file.id,
        this.toPOSTParams(), this.props.entity);
      this.setState({ editing: false });
    }

    this.setState({ saveLoading: false });
  };

  remove = () => {
    if (!this.props.create && !this.state.editing) {
      this.props.deleteFile(this.props.entityId, this.props.file.id, this.props.entity);
    }
  };

  public render() {
    const { file, create, status } = this.props;
    const { editing } = this.state;
    if (create) {
      return (
        <Table.Row>
          <Table.Cell>
            <Input
              fluid={false}
              id={`form-file-${file.id}-name`}
              placeholder="Name"
              onChange={(e) => this.setState({ fileName: e.target.value })}
            />
          </Table.Cell>
          <Table.Cell colSpan="2">
            <Input
              type="file"
              id={`form-file-${file.id}-file`}
              onChange={(e) => this.setState({ fileData: e.target.files![0] })}
            />
          </Table.Cell>
          <Table.Cell textAlign="right" collapsing>
            <Button
              icon="x"
              negative
              onClick={() => this.cancel()}
            />
            <Button
              icon="save"
              positive
              onClick={() => this.save()}
              loading={this.state.saveLoading}
            />
          </Table.Cell>
        </Table.Row>
      );
    }

    if (editing) {
      return (
        <Table.Row>
          <Table.Cell collapsing>
            <Icon name="file pdf" />
            <Input
              id={`form-file-${file.id}-name`}
              value={this.state.fileName}
              fluid={false}
              placeholder="Name"
              onChange={(e) => this.setState({ fileName: e.target.value })}
            />
          </Table.Cell>
          <Table.Cell>{file!.downloadName}</Table.Cell>
          <Table.Cell>{formatLastUpdate(file!.updatedAt)}</Table.Cell>
          <Table.Cell textAlign="right" collapsing>
            <Button
              icon="x"
              negative
              onClick={() => this.cancel()}
            />
            <Button
              icon="save"
              positive
              onClick={() => this.save()}
              loading={this.state.saveLoading}
            />
            <Button
              icon="download"
              primary
              onClick={() => this.getFile()}
            />
          </Table.Cell>
        </Table.Row>
      );
    }

    return (
      <Table.Row>
        <Table.Cell collapsing>
          <Icon name="file pdf" />
          {file!.name}
        </Table.Cell>
        <Table.Cell>{file!.downloadName}</Table.Cell>
        <Table.Cell>{formatLastUpdate(file!.updatedAt)}</Table.Cell>
        <Table.Cell textAlign="right" collapsing>
          <Popup
            trigger={(
              <Button
                icon="trash"
                negative
                loading={status === ResourceStatus.DELETING}
              />
            )}
            on="click"
            content={(
              <Button
                color="red"
                onClick={() => this.remove()}
                loading={status === ResourceStatus.DELETING}
                style={{ marginTop: '0.5em' }}
              >
                Delete file
              </Button>
            )}
            header="Are you sure you want to delete this file?"
          />
          <Button
            icon="pencil"
            primary
            onClick={() => this.setState({ editing: true })}
          />
          <Button
            icon="download"
            primary
            onClick={() => this.getFile()}
          />
        </Table.Cell>
      </Table.Row>
    );
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  saveFile: (entityId: number, fileId: number,
    file: Partial_FileParams, entity: SingleEntities) => dispatch(
    saveSingleFile(entity, entityId, fileId, file),
  ),
  deleteFile: (entityId: number, fileId: number, entity: SingleEntities) => dispatch(
    deleteFileSingle(entity, entityId, fileId),
  ),
  showTransientAlert: (alert: TransientAlert) => dispatch(showTransientAlert(alert)),
});

export default withRouter(connect(null, mapDispatchToProps)(SingleFile));
