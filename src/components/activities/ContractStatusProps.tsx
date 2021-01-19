import React from 'react';
import { connect } from 'react-redux';
import { Form, TextArea } from 'semantic-ui-react';
import { ContractStatus, ContractStatusParams } from '../../clients/server.generated';
import ResourceStatus from '../../stores/resourceStatus';
import { RootState } from '../../stores/store';
import PropsButtons from '../PropsButtons';
import { SingleEntities } from '../../stores/single/single';
import { formatStatus } from '../../helpers/activity';
import { fetchSingle } from '../../stores/single/actionCreators';

interface Props {
  create?: boolean;
  onCancel?: () => void;

  contractStatusParams: ContractStatusParams;
  resourceStatus: ResourceStatus;
  contractId: number;

  addContractStatus: (contractStatusParams: ContractStatusParams) => void;
}

interface State {
  editing: boolean;

  description: string;
  subType: ContractStatus;
}

class ContractStatusProps extends React.Component<Props, State> {
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
    const { contractStatusParams } = props;
    return {
      description: contractStatusParams.description,
      subType: contractStatusParams.subType,
    };
  };

  toParams = (): ContractStatusParams => {
    return new ContractStatusParams({
      description: this.state.description,
      subType: this.state.subType,
    });
  };

  edit = () => {
    this.setState({ editing: true, ...this.extractState(this.props) });
  };

  cancel = () => {
    if (!this.props.create) {
      this.setState({ editing: false, ...this.extractState(this.props) });
    } else if (this.props.onCancel) {
      this.props.onCancel();
    }
  };

  save = () => {
    this.props.addContractStatus(this.toParams());
  };

  render() {
    const {
      editing,
      description,
      subType,
    } = this.state;

    return (
      <>
        <h2>
          {this.props.create ? `Post ${formatStatus(subType)} Status` : `${formatStatus(subType)} Details} `}

          <PropsButtons
            editing={editing}
            canDelete={undefined}
            entity={SingleEntities.Contract}
            status={this.props.resourceStatus}
            cancel={this.cancel}
            edit={this.edit}
            save={this.save}
            remove={() => {}}
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

export default connect(mapStateToProps)(ContractStatusProps);
