import React from 'react';
import { connect } from 'react-redux';
import { Form, TextArea } from 'semantic-ui-react';
import { Dispatch } from 'redux';
import {
  ContractStatus,
  ContractStatusParams,
  InvoiceStatus,
  InvoiceStatusParams,
} from '../../clients/server.generated';
import ResourceStatus from '../../stores/resourceStatus';
import { RootState } from '../../stores/store';
import PropsButtons from '../PropsButtons';
import { SingleEntities } from '../../stores/single/single';
import { formatStatus } from '../../helpers/activity';
import { createSingleStatus } from '../../stores/single/actionCreators';

interface Props {
  create?: boolean;
  createSingleStatus: (entity: SingleEntities, id: number, statusParams: object) => void;

  documentStatusParams: InvoiceStatusParams | ContractStatusParams;
  resourceStatus: ResourceStatus;
  documentId: number;
  documentType: SingleEntities;
  documentStatus: ContractStatus | InvoiceStatus;

  close: () => void;
}

interface State {
  editing: boolean;

  description: string;
}

class DocumentStatusProps extends React.Component<Props, State> {
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
      // eslint-disable-next-line react/no-did-update-set-state
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

  toInvoiceParams = (): InvoiceStatusParams => {
    return new InvoiceStatusParams({
      description: this.state.description,
      subType: this.props.documentStatus as InvoiceStatus,
    });
  };

  toContractParams = (): ContractStatusParams => {
    return new ContractStatusParams({
      description: this.state.description,
      subType: this.props.documentStatus as ContractStatus,
    });
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

  saveInvoice = () => {
    this.props.createSingleStatus(
      SingleEntities.Invoice,
      this.props.documentId,
      this.toInvoiceParams(),
    );
  };

  saveContract = () => {
    this.props.createSingleStatus(
      SingleEntities.Contract,
      this.props.documentId,
      this.toInvoiceParams(),
    );
  };

  render() {
    const {
      editing,
      description,
    } = this.state;
    const { documentStatus, documentType } = this.props;

    if (documentType === SingleEntities.Invoice) {
      return (
        <>
          <h2>
            {this.props.create ? `Post ${formatStatus(documentStatus)} Status`
              : `${formatStatus(documentStatus)} Details} `}

            <PropsButtons
              editing={editing}
              canDelete={undefined}
              entity={SingleEntities.Invoice}
              status={this.props.resourceStatus}
              cancel={this.cancel}
              edit={this.edit}
              save={this.saveInvoice}
              remove={() => {
              }}
            />
          </h2>

          <Form style={{ marginTop: '2em' }}>
            <Form.Field disabled={!editing}>
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
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
    return (
      <>
        <h2>
          {this.props.create ? `Post ${formatStatus(documentStatus)} Status`
            : `${formatStatus(documentStatus)} Details} `}

          <PropsButtons
            editing={editing}
            canDelete={undefined}
            entity={SingleEntities.Contract}
            status={this.props.resourceStatus}
            cancel={this.cancel}
            edit={this.edit}
            save={this.saveContract}
            remove={() => {
            }}
          />
        </h2>

        <Form style={{ marginTop: '2em' }}>
          <Form.Field disabled={!editing}>
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
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

const mapStateToProps = (state: RootState) => ({
  options: state.summaries.Products.options,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  createSingleStatus: (entity: SingleEntities, id: number, statusParams: object) => dispatch(
    createSingleStatus(entity, id, statusParams),
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(DocumentStatusProps);
