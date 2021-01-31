import React from 'react';
import { connect } from 'react-redux';
import { Button, Grid, Step } from 'semantic-ui-react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { GeneralActivity } from './GeneralActivity';
import FinancialDocumentStep from './FinancialDocumentStep';
import {
  formatDocumentStatusTitle, formatDocumentType,
  getAllDocumentStatuses,
  getAllStatusActivities,
  getLastStatus,
} from '../../helpers/activity';
import DocumentStatusModal from './DocumentStatusModal';
import { SingleEntities } from '../../stores/single/single';
import { DocumentStatus } from './DocumentStatus';
import ResourceStatus from '../../stores/resourceStatus';

interface Props extends RouteComponentProps {
  documentId: number;
  // If the document is a ProductInstance, the parentId is the contract ID
  parentId?: number;
  activities: GeneralActivity[];
  documentType: SingleEntities;

  resourceStatus: ResourceStatus;
}

interface State {
  deferModalOpen: boolean;
  cancelModalOpen: boolean;
}

class FinancialDocumentProgress extends React.Component<Props, State> {
  public constructor(props: Props) {
    super(props);
    this.state = {
      deferModalOpen: false,
      cancelModalOpen: false,
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

  public render() {
    const {
      activities, documentType, documentId, resourceStatus, parentId,
    } = this.props;
    const { cancelModalOpen, deferModalOpen } = this.state;
    const allDocumentStatuses = getAllDocumentStatuses(documentType);
    const allStatusActivities = getAllStatusActivities(activities);
    const lastStatusActivity = getLastStatus(allStatusActivities);
    let cancelledDocument: boolean = false;
    if (lastStatusActivity !== undefined) {
      cancelledDocument = allStatusActivities[allStatusActivities.length - 1].subType === 'CANCELLED';
    }

    let deferButton;
    if (documentType === SingleEntities.ProductInstance && lastStatusActivity?.subType !== 'DEFERRED') {
      deferButton = (
        <Button
          floated="left"
          labelPosition="left"
          icon="close"
          basic
          onClick={() => {
            this.setState({
              deferModalOpen: true,
            });
          }}
          content={`Defer ${formatDocumentType(documentType)}`}
        />
      );
    }

    if (!cancelledDocument) {
      return (
        <>
          <Grid columns={3}>
            <Grid.Row>
              <Grid.Column>
                {deferButton}
              </Grid.Column>
              <Grid.Column>
                <h3
                  style={{ marginBottom: '0.3em', marginTop: '0.2em', textAlign: 'center' }}
                >
                  {formatDocumentStatusTitle(
                    allStatusActivities[allStatusActivities.length - 1],
                    formatDocumentType(documentType),
                  )}
                </h3>
              </Grid.Column>
              <Grid.Column>
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
                  content={`Cancel ${formatDocumentType(documentType)}`}
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>

          <Step.Group
            stackable="tablet"
            widths={5}
            fluid
            style={{ marginTop: '0.5em' }}
          >
            {allDocumentStatuses.map((currentStatus) => (
              <FinancialDocumentStep
                documentId={documentId}
                documentType={documentType}
                lastStatusActivity={lastStatusActivity}
                allStatusActivities={allStatusActivities}
                status={currentStatus}
                cancelled={cancelledDocument}
                resourceStatus={resourceStatus}
                parentId={parentId}
              />
            ))}
          </Step.Group>
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
        </>
      );
    }
    return (
      <>
        <h3 style={{ textAlign: 'center' }}>
          {formatDocumentStatusTitle(
            allStatusActivities[allStatusActivities.length - 1],
            formatDocumentType(documentType),
          )}
        </h3>
        <Step.Group stackable="tablet" widths={5} fluid>
          {allDocumentStatuses.map((currentStatus) => (
            <FinancialDocumentStep
              documentId={documentId}
              documentType={documentType}
              lastStatusActivity={lastStatusActivity}
              allStatusActivities={allStatusActivities}
              status={currentStatus}
              cancelled={cancelledDocument}
              resourceStatus={resourceStatus}
              parentId={parentId}
            />
          ))}
        </Step.Group>
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
