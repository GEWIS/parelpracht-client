import React from 'react';
import { connect } from 'react-redux';
import { Step } from 'semantic-ui-react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Dispatch } from 'redux';
import { WithTranslation, withTranslation } from 'react-i18next';
import {
  formatStatus,
} from '../../helpers/activity';
import DocumentStatusModal from './DocumentStatusModal';
import { SingleEntities } from '../../stores/single/single';
import { DocumentStatus } from './DocumentStatus';
import ResourceStatus from '../../stores/resourceStatus';
import { TransientAlert } from '../../stores/alerts/actions';
import { showTransientAlert } from '../../stores/alerts/actionCreators';
import { Roles } from '../../clients/server.generated';
import { RootState } from '../../stores/store';
import { authedUserHasRole } from '../../stores/auth/selectors';

/**
 * Definition of used variables
 */
interface Props extends RouteComponentProps, WithTranslation {
  documentId: number;
  documentType: SingleEntities;
  // If the document is a ProductInstance, the parentId is the contract ID
  parentId?: number;
  status: DocumentStatus;
  statusChecked: boolean;
  statusClickable: boolean;
  statusDescription: string;
  statusDisabled: boolean;
  statusIcon: JSX.Element;

  resourceStatus: ResourceStatus;
  showTransientAlert: (alert: TransientAlert) => void;

  hasRole: (role: Roles) => boolean;

  roles: Roles[];
}

interface State {
  stepModalOpen: boolean;
}

class FinancialDocumentProgress extends React.Component<Props, State> {
  public constructor(props: Props) {
    super(props);
    this.state = {
      stepModalOpen: false,
    };
  }

  closeStepModal = () => {
    this.setState({
      stepModalOpen: false,
    });
  };

  public render() {
    const {
      documentId, documentType, status,
      statusChecked, statusClickable, statusDescription, statusDisabled, statusIcon,
      resourceStatus, parentId, hasRole, roles,
    } = this.props;
    const { stepModalOpen } = this.state;

    // check if status can be clicked and give properties depending on that
    let statusClickableString = '';
    let onStepClick;
    const permissionToClick = roles.some(hasRole);
    if (statusClickable) {
      statusClickableString = 'clickable';
      onStepClick = () => {
        this.setState({
          stepModalOpen: true,
        });
      };
    }

    return (
      <>
        <Step
          completed={statusChecked}
          className={statusClickableString}
          onClick={onStepClick}
          disabled={!permissionToClick || statusDisabled}
        >
          {statusIcon}
          <Step.Content>
            <Step.Title>
              {formatStatus(status)}
            </Step.Title>
            <Step.Description style={{ maxWidth: '20ch', wordWrap: 'break-word' }}>
              {statusDescription}
            </Step.Description>
          </Step.Content>
        </Step>
        <DocumentStatusModal
          open={stepModalOpen}
          documentId={documentId}
          parentId={parentId}
          documentType={documentType}
          documentStatus={status}
          close={this.closeStepModal}
          resourceStatus={resourceStatus}
        />
      </>
    );
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  showTransientAlert: (alert: TransientAlert) => dispatch(showTransientAlert(alert)),
});

const mapStateToProps = (state: RootState) => {
  return {
    hasRole: (role: Roles): boolean => authedUserHasRole(state, role),
  };
};

export default withTranslation()(withRouter(connect(mapStateToProps,
  mapDispatchToProps)(FinancialDocumentProgress)));
