import React, {
  ChangeEvent,
} from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import {
  Checkbox,
  Form, Input, Label, Segment, TextArea,
} from 'semantic-ui-react';
import companyReducer from '../../stores/company/reducer';
import { Company, CompanyParams, CompanyStatus } from '../../clients/server.generated';
import { createSingleCompany, saveSingleCompany } from '../../stores/company/actionCreators';
import ResourceStatus from '../../stores/resourceStatus';
import { RootState } from '../../stores/store';
import CompanyPropsButtons from './CompanyPropsButtons';

interface Props {
  create?: boolean;
  onCancel?: () => void;

  company: Company;
  status: ResourceStatus;

  saveCompany: (id: number, company: CompanyParams) => void;
  createCompany: (company: CompanyParams) => void;
}

interface State {
  editing: boolean;
  name: string;
  description: string;
  phoneNumber: string;
  comments: string;
  status: CompanyStatus;
}

class CompanyProps extends React.Component<Props, State> {
  public constructor(props: Props) {
    super(props);

    this.state = {
      editing: props.create ?? false,
      ...this.extractState(props),
    };
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.status === ResourceStatus.SAVING
      && this.props.status === ResourceStatus.FETCHED) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ editing: false });
    }
  }

  extractState = (props: Props) => {
    const { company } = props;
    return {
      name: company.name,
      description: company.description,
      phoneNumber: company.phoneNumber,
      comments: company.comments,
      status: company.status,
      // lastUpdated: company.lastUpdated,
      endDate: company.endDate,
    };
  };

  toParams = (): CompanyParams => {
    return new CompanyParams({
      name: this.state.name,
      description: this.state.description,
      phoneNumber: this.state.phoneNumber,
      comments: this.state.comments,
      status: this.state.status,
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
    if (this.props.create) {
      this.props.createCompany(this.toParams());
    } else {
      this.props.saveCompany(this.props.company.id, this.toParams());
    }
  };

  render() {
    const {
      editing,
      name,
      description,
      phoneNumber,
      comments,
      status,
    } = this.state;

    return (
      <>
        <h2>
          {this.props.create ? 'New Company' : 'Details'}

          <CompanyPropsButtons
            editing={editing}
            status={this.props.status}
            cancel={this.cancel}
            edit={this.edit}
            save={this.save}
          />
        </h2>

        <Form style={{ marginTop: '2em' }}>
          <Form.Group widths="equal">
            <Form.Field
              disabled={!editing}
              id="form-input-name"
              fluid
              control={Input}
              label="Name"
              value={name}
              onChange={(e: ChangeEvent<HTMLInputElement>) => this.setState({
                name: e.target.value,
              })}
            />
            <Form.Field disabled={!editing}>
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label htmlFor="form-input-description">
                Description
              </label>
              <TextArea
                id="form-input-description"
                value={description}
                onChange={(e) => this.setState({ description: e.target.value })}
                placeholder="Description"
              />
            </Form.Field>
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Field
              disabled={!editing}
              id="form-input-phonenumber"
              fluid
              control={Input}
              label="phoneNumber"
              value={phoneNumber}
              onChange={(e: ChangeEvent<HTMLInputElement>) => this.setState({
                phoneNumber: e.target.value,
              })}
            />
            <Form.Field disabled={!editing}>
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label htmlFor="form-check-status">
                Status
              </label>
              <Checkbox
                toggle
                id="form-check-status"
                label={status === CompanyStatus.ACTIVE ? 'Active' : 'Inactive'}
                checked={status === CompanyStatus.ACTIVE}
                onChange={(_, data) => this.setState({
                  status:
                    data.checked ? CompanyStatus.ACTIVE : CompanyStatus.INACTIVE,
                })}
              />
            </Form.Field>
          </Form.Group>
          <Form.Field disabled={!editing}>
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="form-input-comments">
              comments
            </label>
            <TextArea
              id="form-input-comments"
              value={comments}
              onChange={
                (e) => this.setState({ comments: e.target.value })
              }
              placeholder="Comments"
            />
          </Form.Field>
        </Form>
      </>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    status: state.company.singleStatus,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  saveCompany: (id: number, company: CompanyParams) => dispatch(saveSingleCompany(id, company)),
  createCompany: (company: CompanyParams) => dispatch(createSingleCompany(company)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CompanyProps);
