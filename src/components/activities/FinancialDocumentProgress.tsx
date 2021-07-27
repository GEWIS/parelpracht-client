import React from 'react';
import { connect } from 'react-redux';
import {
  Button, Grid, Icon, Popup, Step,
} from 'semantic-ui-react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { GeneralActivity } from './GeneralActivity';
import FinancialDocumentStep from './FinancialDocumentStep';
import {
  formatDocumentStatusTitle,
  formatDocumentType,
  getAllDocumentStatuses,
  getAllStatusActivities,
  getCompletedDocumentStatuses,
  getLastStatusNotCancelled,
  getStatusesFromActivities,
  getToDoStatus,
} from '../../helpers/activity';
import DocumentStatusModal from './DocumentStatusModal';
import { SingleEntities } from '../../stores/single/single';
import { DocumentStatus } from './DocumentStatus';
import ResourceStatus from '../../stores/resourceStatus';
import { Roles } from '../../clients/server.generated';
import AuthorizationComponent from '../AuthorizationComponent';

interface Props extends RouteComponentProps {
  documentId: number;
  // If the document is a ProductInstance, the parentId is the contract ID
  parentId?: number;
  activities: GeneralActivity[];
  documentType: SingleEntities;

  canCancel: boolean;
  cancelReason?: string;

  resourceStatus: ResourceStatus;
  roles: Roles[];
}

interface State {
  deferModalOpen: boolean;
  cancelModalOpen: boolean;
  irrecoverableModalOpen: boolean;
}

class FinancialDocumentProgress extends React.Component<Props, State> {
  public constructor(props: Props) {
    super(props);
    this.state = {
      deferModalOpen: false,
      cancelModalOpen: false,
      irrecoverableModalOpen: false,
    };
  }

  closeCancelModal = () => {
    this.setState({
      cancelModalOpen: false,
    });
  };

  closeDeferModal = () => {
    this.setState({
      deferModalOpen: false,
    });
  };

  closeIrrecoverableModal = () => {
    this.setState({
      irrecoverableModalOpen: false,
    });
  };

  public render() {
    const {
      activities, documentType, documentId, resourceStatus, parentId, roles,
      canCancel, cancelReason,
    } = this.props;
    const { cancelModalOpen, deferModalOpen, irrecoverableModalOpen } = this.state;
    const allPossibleDocumentStatuses = getAllDocumentStatuses(documentType);
    const allStatusActivities = getAllStatusActivities(activities);
    const completedStatuses = getStatusesFromActivities(allStatusActivities);
    const lastActiveStatus = getLastStatusNotCancelled(completedStatuses);
    const allCompletedStatuses = getCompletedDocumentStatuses(lastActiveStatus, documentType);
    const realLastStatus = completedStatuses[completedStatuses.length - 1];

    let leftButton;
    if (documentType === SingleEntities.ProductInstance) {
      leftButton = (
        <AuthorizationComponent
          roles={[Roles.GENERAL, Roles.ADMIN, Roles.FINANCIAL]}
          notFound={false}
        >
          <Popup
            header={`Defer ${formatDocumentType(documentType).toLowerCase()}`}
            content={`By defering this ${formatDocumentType(documentType).toLowerCase()}, you indicate that it will
          not be delivered in the current academic year and that delivery will be postponed until the next academic year.`}
            mouseEnterDelay={500}
            wide
            trigger={(
              <Button
                floated="left"
                labelPosition="left"
                icon="stopwatch"
                basic
                onClick={() => {
                  this.setState({
                    deferModalOpen: true,
                  });
                }}
                content={`Defer ${formatDocumentType(documentType).toLowerCase()}`}
                disabled={allCompletedStatuses[allCompletedStatuses.length - 1]
                !== DocumentStatus.NOTDELIVERED}
              />
          )}
          />
        </AuthorizationComponent>
      );
    } else if (documentType === SingleEntities.Invoice) {
      leftButton = (
        <AuthorizationComponent
          roles={[Roles.GENERAL, Roles.ADMIN, Roles.FINANCIAL]}
          notFound={false}
        >
          <Popup
            header={`Mark
          irrecoverable`}
            content={`By marking this invoice irrecoverable, you indicate that the money owed from this invoice can not be collected.
          Either the invoice is no longer valid
          (i.e. it was created more than 5 years ago) or the responsible party indicated to not pay the invoice.
          Note that this is different from cancelling an invoice, in which the contracted products can still be invoiced on
          another invoice.`}
            mouseEnterDelay={500}
            wide
            trigger={(
              <Button
                floated="left"
                labelPosition="left"
                icon="close"
                basic
                onClick={() => {
                  this.setState({ irrecoverableModalOpen: true });
                }}
                content="Mark irrecoverable"
                disabled={!(allCompletedStatuses.includes(DocumentStatus.CREATED)
                || allCompletedStatuses.includes(DocumentStatus.SENT))}
              />
          )}
          />
        </AuthorizationComponent>
      );
    }

    let rightButton;
    if (canCancel) {
      rightButton = documentType === SingleEntities.Invoice ? (
        <AuthorizationComponent roles={[Roles.GENERAL, Roles.ADMIN]} notFound={false}>
          <Popup
            trigger={(
              <Button
                floated="right"
                labelPosition="left"
                icon="close"
                basic
                onClick={() => {
                  this.setState({
                    cancelModalOpen: true,
                  });
                }}
                content={`Cancel ${formatDocumentType(documentType).toLocaleLowerCase()}`}
                disabled={getToDoStatus(allCompletedStatuses[allCompletedStatuses.length - 1],
                  documentType).length === 0}
              />
            )}
            header="Cancel invoice"
            content="By cancelling an invoice, you indicate that the invoice or any of the products on this invoice will not be sent to the company.
            Please only cancel an invoice after consultation with the external affairs officer and the treasurer."
          />
        </AuthorizationComponent>
      ) : (
        <AuthorizationComponent roles={[Roles.GENERAL, Roles.ADMIN]} notFound={false}>
          <Popup
            trigger={(
              <Button
                floated="right"
                labelPosition="left"
                icon="close"
                basic
                onClick={() => {
                  this.setState({
                    cancelModalOpen: true,
                  });
                }}
                content={`Cancel ${formatDocumentType(documentType).toLocaleLowerCase()}`}
                disabled={getToDoStatus(allCompletedStatuses[allCompletedStatuses.length - 1],
                  documentType).length === 0}
              />
            )}
            header={`Cancel ${formatDocumentType(documentType).toLocaleLowerCase()}`}
            content={`By cancelling this ${formatDocumentType(documentType).toLocaleLowerCase()}, you indicate
             that the ${formatDocumentType(documentType).toLocaleLowerCase()} will not be delivered. Note that other products from the contract
             might still be delivered and invoiced. \n
             Only cancel a ${formatDocumentType(documentType).toLocaleLowerCase()} in consultation with the external affairs officer.`}
          />
        </AuthorizationComponent>
      );
    } else {
      rightButton = (
        <AuthorizationComponent roles={[Roles.GENERAL, Roles.ADMIN]} notFound={false}>
          <Popup
            content={cancelReason}
            mouseEnterDelay={500}
            wide
            trigger={(
              <div style={{ display: 'inline-block', float: 'right' }}>
                <Button
                  floated="right"
                  labelPosition="left"
                  icon="close"
                  basic
                  content={`Cancel ${formatDocumentType(documentType).toLocaleLowerCase()}`}
                  disabled
                  style={{ pointerEvents: 'auto !important' }}
                />
              </div>
          )}
          />
        </AuthorizationComponent>
      );
    }

    const topButtonsGrid = (!completedStatuses.includes(DocumentStatus.CANCELLED)) ? (
      <Grid columns={3}>
        <Grid.Row>
          <Grid.Column>
            {leftButton}
          </Grid.Column>
          <Grid.Column>
            <h3
              style={{ marginTop: '0.3em', textAlign: 'center' }}
            >
              {formatDocumentStatusTitle(
                allStatusActivities[allStatusActivities.length - 1],
                formatDocumentType(documentType),
              )}
            </h3>
          </Grid.Column>
          <Grid.Column>
            {rightButton}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    ) : (
      <h3 style={{ textAlign: 'center' }}>
        {formatDocumentStatusTitle(
          allStatusActivities[allStatusActivities.length - 1],
          formatDocumentType(documentType),
        )}
      </h3>
    );
    const topButtonsModals = (!completedStatuses.includes(DocumentStatus.CANCELLED)) ? (
      <>
        <DocumentStatusModal
          open={deferModalOpen}
          documentId={documentId}
          parentId={parentId}
          documentType={documentType}
          documentStatus={DocumentStatus.DEFERRED}
          close={this.closeDeferModal}
          resourceStatus={resourceStatus}
        />
        <DocumentStatusModal
          open={cancelModalOpen}
          documentId={documentId}
          parentId={parentId}
          documentType={documentType}
          documentStatus={DocumentStatus.CANCELLED}
          close={this.closeCancelModal}
          resourceStatus={resourceStatus}
        />
        <DocumentStatusModal
          open={irrecoverableModalOpen}
          documentId={documentId}
          parentId={parentId}
          documentType={documentType}
          documentStatus={DocumentStatus.IRRECOVERABLE}
          close={this.closeIrrecoverableModal}
          resourceStatus={resourceStatus}
        />
      </>
    ) : undefined;

    // define the variables for the document step
    const statusDoneList: boolean[] = [];
    const statusDisabledList: boolean[] = [];
    const statusClickableList: boolean[] = [];
    const statusDescriptionList: string[] = [];
    const statusIconsList: JSX.Element[] = [];

    for (let i = 0; i < allPossibleDocumentStatuses.length; i++) {
      const documentStatus = allPossibleDocumentStatuses[i];
      const nextDocumentStatus = getToDoStatus(lastActiveStatus, documentType);
      const documentStatusActivity = allStatusActivities.find((a) => a.subType === documentStatus);

      // push whether the status has been completed
      statusDoneList.push(allCompletedStatuses.includes(documentStatus));

      // push the description of the status if it has a status
      if (documentStatusActivity !== undefined) {
        statusDescriptionList.push(documentStatusActivity.description);
      } else {
        statusDescriptionList.push('');
      }

      // push whether the document status can be clicked
      if (nextDocumentStatus.includes(documentStatus)
        // FINISHED is set by delivering all products
        && documentStatus !== DocumentStatus.FINISHED) {
        statusClickableList.push(true);
      } else {
        statusClickableList.push(false);
      }

      // push the icon and whether the status has to be disabled.
      if (realLastStatus === DocumentStatus.DEFERRED) {
        statusIconsList.push(<Icon color="orange" name="stopwatch" />);
        statusDisabledList.push(true);
      } else if (realLastStatus === DocumentStatus.CANCELLED
        || realLastStatus === DocumentStatus.IRRECOVERABLE) {
        statusIconsList.push(<Icon color="red" name="close" />);
        statusDisabledList.push(true);
      } else {
        statusDisabledList.push(false);
        statusIconsList.push(<Icon />);
      }
    }

    return (
      <>
        {topButtonsGrid}
        <Step.Group
          widths={5}
          fluid
        >
          {allPossibleDocumentStatuses.map((currentStatus, i) => (
            <FinancialDocumentStep
              key={i.toString()}
              documentId={documentId}
              documentType={documentType}
              statusChecked={statusDoneList[i]}
              statusClickable={statusClickableList[i]}
              statusDescription={statusDescriptionList[i]}
              statusDisabled={statusDisabledList[i]}
              statusIcon={statusIconsList[i]}
              status={currentStatus}
              resourceStatus={resourceStatus}
              parentId={parentId}
              roles={roles}
            />
          ))}
        </Step.Group>
        {topButtonsModals}
      </>
    );
  }
}

const mapStateToProps = () => {
  return {
  };
};

const mapDispatchToProps = () => ({
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FinancialDocumentProgress));
