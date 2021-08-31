import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import {
  Button, Icon, Input, Popup, Table,
} from 'semantic-ui-react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { WithTranslation, withTranslation } from 'react-i18next';
import {
  Partial_FileParams, Roles,
} from '../../clients/server.generated';
import { FilesClient } from '../../clients/filesClient';
import { formatLastUpdate } from '../../helpers/timestamp';
import { deleteFileSingle, saveSingleFile } from '../../stores/single/actionCreators';
import { SingleEntities } from '../../stores/single/single';
import { GeneralFile } from './GeneralFile';
import ResourceStatus from '../../stores/resourceStatus';
import { TransientAlert } from '../../stores/alerts/actions';
import { showTransientAlert } from '../../stores/alerts/actionCreators';
import AuthorizationComponent from '../AuthorizationComponent';

interface Props extends RouteComponentProps, WithTranslation {
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

  cancel = () => {
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

  private getFileIcon = (fileName: string) => {
    const fileExtension = fileName.split('.').pop();
    if (fileExtension == null) {
      return 'file alternate';
    }
    if (fileExtension.match(/(jpg|jpeg|png|bmp|gif|ico|svg|eps|ps|psd|xcf|ai|cdr|tif|tiff)$/i)) {
      return 'file image';
    }
    if (fileExtension.match(/(mp4|mkv|avi|mov|flv|f4v|f4p|f4a|f4b|wmv|webm|mpg|mp2|mpeg|mpe|mpv|ogg|ogv|vob|gifv|mng|m4p|m4v|qt|swf|3gp|3g2|h264|rm)$/i)) {
      return 'file video';
    }
    if (fileExtension.match(/(aa|aac|aax|act|aif|aiff|alac|amr|ape|au|awb|dss|dvf|flac|gsm|iklax|ivs|m4a|m4b|m4p|mid|midi|mmf|mpc|msv|nmf|ogg|oga|mogg|org|opus|ra|rf64|sln|tta|voc|vox|wav|wma|wv|8svx|cda|wpl)$/i)) {
      return 'file audio';
    }
    if (fileExtension.match(/(pdf)$/i)) {
      return 'file pdf';
    }
    if (fileExtension.match(/(zip|rar|7z|tar|arj|deb|pkg|rpm|gz|tar.gz|z)$/i)) {
      return 'file archive';
    }
    if (fileExtension.match(/(docx|doc|odt|docm|dot|dotm|dotx|wps|wpd)$/i)) {
      return 'file word';
    }
    if (fileExtension.match(/(bin|dmg|iso|toast|vcd)$/i)) {
      return 'folder';
    }
    if (fileExtension.match(/(ppt|pptx|odp|pps|key)$/i)) {
      return 'file powerpoint';
    }
    if (fileExtension.match(/(xls|xlsx|xlsm|ods)$/i)) {
      return 'file excel';
    }
    if (fileExtension.match(/(csv|dat|db|dbf|log|mdb|sav|sql|tar|xml)$/i)) {
      return 'database';
    }
    if (fileExtension.match(/(txt|rtf)$/i)) {
      return 'file';
    }
    if (fileExtension.match(/(php)$/i)) {
      return 'php';
    }
    if (fileExtension.match(/(css|asp|aspx|cer|cgi|pl|cfm|part|rss|c|class|cpp|cs|h|java|sh|swift|vb)$/i)) {
      return 'file code';
    }
    if (fileExtension.match(/(js|jsp|ts|tsx)$/i)) {
      return 'js';
    }
    if (fileExtension.match(/(fnt|fon|otf|ttf)$/i)) {
      return 'font';
    }
    if (fileExtension.match(/(py)$/i)) {
      return 'python';
    }
    if (fileExtension.match(/(xhtml|html|htm)$/i)) {
      return 'internet explorer';
    }
    if (fileExtension.match(/(email|eml|emlx|msg|oft|ost|pst|vcf)$/i)) {
      return 'mail';
    }
    return 'file alternate';
  };

  public render() {
    const {
      file, create, status, t,
    } = this.props;
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
          <Table.Cell>
            <Input
              type="file"
              id={`form-file-${file.id}-file`}
              onChange={(e) => this.setState({ fileData: e.target.files![0] })}
            />
          </Table.Cell>
          <Table.Cell>
            <Button
              icon="x"
              negative
              onClick={() => this.cancel()}
              title={t('buttons.files.cancel')}
            />
            <Button
              icon="save"
              positive
              onClick={() => this.save()}
              loading={this.state.saveLoading}
              title={t('buttons.files.save')}
            />
          </Table.Cell>
        </Table.Row>
      );
    }

    if (editing) {
      return (
        <Table.Row>
          {/* <Table.Cell> */}
          {/*  <Icon name={this.getFileIcon(this.state.fileName)} /> */}
          {/*  {file!.downloadName} */}
          {/* </Table.Cell> */}
          <Table.Cell>
            <Input
              id={`form-file-${file.id}-name`}
              value={this.state.fileName}
              fluid={false}
              placeholder="Name"
              onChange={(e) => this.setState({ fileName: e.target.value })}
            />
          </Table.Cell>
          <Table.Cell>{formatLastUpdate(file!.updatedAt)}</Table.Cell>
          <Table.Cell>
            <Button
              icon="x"
              negative
              onClick={() => this.cancel()}
              title={t('buttons.files.cancel')}
            />
            <Button
              icon="save"
              positive
              onClick={() => this.save()}
              loading={this.state.saveLoading}
              title={t('buttons.files.save')}
            />
            <Button
              icon="download"
              primary
              onClick={() => this.getFile()}
              title={t('buttons.files.download')}
            />
          </Table.Cell>
        </Table.Row>
      );
    }

    const fileHasLabel = file!.name !== undefined && file!.name !== '';

    return (
      <Table.Row>
        <Table.Cell>
          <Icon name={this.getFileIcon(file!.downloadName)} />
          <span title={file!.downloadName}>{file!.downloadName}</span>
          {fileHasLabel ? (
            <>
              <br />
              <span className="label" title={file!.name}>{file!.name}</span>
            </>
          ) : undefined}
        </Table.Cell>
        <Table.Cell>{formatLastUpdate(file!.createdAt)}</Table.Cell>
        <Table.Cell>
          <AuthorizationComponent roles={[Roles.GENERAL, Roles.ADMIN]} notFound={false}>
            <Popup
              trigger={(
                <Button
                  icon="trash"
                  negative
                  loading={status === ResourceStatus.DELETING}
                  title={t('buttons.files.delete')}
                />
            )}
              on="click"
              hideOnScroll
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
              title={t('buttons.files.edit')}
            />
          </AuthorizationComponent>
          <Button
            icon="download"
            primary
            onClick={() => this.getFile()}
            title={t('buttons.files.download')}
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

export default withTranslation()(withRouter(connect(null, mapDispatchToProps)(SingleFile)));
