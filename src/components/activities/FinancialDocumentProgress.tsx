import React from 'react';
import { connect } from 'react-redux';
import {
  Button, Grid, Icon, Popup, Step,
} from 'semantic-ui-react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { withTranslation, WithTranslation } from 'react-i18next';
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
import { getLanguage } from '../../localization';

interface Props extends RouteComponentProps, WithTranslation {
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
      canCancel, cancelReason, t,
    } = this.props;
    const language = getLanguage();

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
            header={t('activities.status.defer', { entity: formatDocumentType(documentType).toLowerCase() })}
            content={t('activities.status.deferDescription', { entity: formatDocumentType(documentType).toLowerCase() })}
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
                content={t('activities.status.defer', { entity: formatDocumentType(documentType).toLowerCase() })}
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
            header={t('activities.status.irrecoverable')}
            content={t('activities.status.irrecoverableDescription')}
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
                content={t('activities.status.irrecoverable')}
                disabled={!(realLastStatus.includes(DocumentStatus.CREATED)
                || realLastStatus.includes(DocumentStatus.SENT))}
              />
          )}
          />
        </AuthorizationComponent>
      );
    }

    let rightButton;
    if (canCancel) {
      rightButton = (
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
                content={t('activities.status.cancel', { entity: formatDocumentType(documentType).toLocaleLowerCase() })}
                disabled={getToDoStatus(allCompletedStatuses[allCompletedStatuses.length - 1],
                  documentType).length === 0}
              />
            )}
            header={t('activities.status.cancel', { entity: formatDocumentType(documentType).toLocaleLowerCase() })}
            content={() => {
              switch (documentType) {
                case SingleEntities.Contract: return t('activities.status.cancelContractDescription');
                case SingleEntities.Invoice: return t('activities.status.cancelInvoiceDescription');
                case SingleEntities.ProductInstance: return t('activities.status.cancelProductInstanceDescription');
                default: return '';
              }
            }}
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
                  content={t('activities.status.cancel', { entity: formatDocumentType(documentType).toLocaleLowerCase() })}
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
                documentType,
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
          documentType,
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
        statusDescriptionList.push(language === 'nl-NL' ? documentStatusActivity.descriptionDutch : documentStatusActivity.descriptionEnglish);
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

export default withTranslation()(withRouter(connect(mapStateToProps,
  mapDispatchToProps)(FinancialDocumentProgress)));
