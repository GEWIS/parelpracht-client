import { Component } from 'react';
import { connect } from 'react-redux';
import { Form } from 'semantic-ui-react';
import { Dispatch } from 'redux';
import {
  ContractStatusParams,
  InvoiceStatusParams,
} from '../../clients/server.generated';
import ResourceStatus from '../../stores/resourceStatus';
import PropsButtons from '../PropsButtons';
import { SingleEntities } from '../../stores/single/single';
import { formatStatus } from '../../helpers/activity';
import { createSingleStatus } from '../../stores/single/actionCreators';
import { createInstanceStatusSingle } from '../../stores/productinstance/actionCreator';
import TextArea from '../TextArea';
import { DocumentStatus } from './DocumentStatus';

interface Props {
  create?: boolean;
  createSingleStatus: (entity: SingleEntities, id: number, statusParams: object) => void;
  createSingleInstanceStatus: (id: number, instanceId: number, statusParam: object) => void;


  documentStatusParams: InvoiceStatusParams | ContractStatusParams;
  resourceStatus: ResourceStatus;
  documentId: number;
  documentType: SingleEntities;
  documentStatus: DocumentStatus;
  // If the document is a ProductInstance, the parentId is the contract ID
  parentId?: number;

  close: () => void;
}

interface State {
  editing: boolean;

  description: string;
}

class DocumentStatusProps extends Component<Props, State> {
  static defaultProps = {
    parentId: undefined,
    create: undefined,
  };

  public constructor(props: Props) {
    super(props);

    this.state = {
      editing: props.create ?? false,
      ...this.extractState(props),
    };
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.resourceStatus === ResourceStatus.SAVING
      && this.props.resourceStatus === ResourceStatus.FETCHED) {

      this.setState({ editing: false });
    }
  }

  extractState = (props: Props) => {
    const { documentStatusParams } = props;
    return {
      description: documentStatusParams.description,
      subType: documentStatusParams.subType,
    };
  };

  toStatusParams = (): object => {
    return {
      description: this.state.description,
      subType: this.props.documentStatus,
    };
  };

  edit = () => {
    this.setState({ editing: true, ...this.extractState(this.props) });
  };

  cancel = () => {
    if (!this.props.create) {
      this.setState({ editing: false, ...this.extractState(this.props) });
    }
    this.props.close();
  };

  saveDocument = () => {
    if (this.props.documentType === SingleEntities.ProductInstance) {
      this.props.createSingleInstanceStatus(
        this.props.parentId!,
        this.props.documentId,
        this.toStatusParams(),
      );
    } else {
      this.props.createSingleStatus(
        this.props.documentType,
        this.props.documentId,
        this.toStatusParams(),
      );
    }
    this.props.close();
  };

  render() {
    const {
      editing,
      description,
    } = this.state;
    const { documentStatus, documentType } = this.props;

    return (
      <>
        <h2>
          {this.props.create ? `Post ${formatStatus(documentStatus)} Status`
            : `${formatStatus(documentStatus)} Details} `}

          <PropsButtons
            editing={editing}
            canDelete={undefined}
            canEdit
            canSave
            entity={documentType}
            status={this.props.resourceStatus}
            cancel={this.cancel}
            edit={this.edit}
            save={this.saveDocument}
            remove={() => {
            }}
          />
        </h2>

        <Form style={{ marginTop: '2em' }}>
          <Form.Field>
                        <label htmlFor="form-input-description">
              Comments
            </label>
            <TextArea
              id="form-delivery-spec-english"
              value={description}
              onChange={
                (e) => this.setState({ description: e.target.value })
              }
              placeholder="Comments"
            />
          </Form.Field>
        </Form>
      </>
    );
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  createSingleStatus: (entity: SingleEntities, id: number, statusParams: object) => dispatch(
    createSingleStatus(entity, id, statusParams),
  ),
  createSingleInstanceStatus: (id: number, instanceId: number, statusParam: object) => dispatch(
    createInstanceStatusSingle(id, instanceId, statusParam),
  ),
});

export default connect(null, mapDispatchToProps)(DocumentStatusProps);
