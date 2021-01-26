import React from 'react';
import { connect } from 'react-redux';
import { Grid, Button, Step } from 'semantic-ui-react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { GeneralActivity } from './GeneralActivity';
import FinancialDocumentStep from './FinancialDocumentStep';
import {
  formatDocumentStatusTitle,
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
  activities: GeneralActivity[];
  documentType: SingleEntities;

  resourceStatus: ResourceStatus;
}

interface State {
  cancelModalOpen: boolean;
}

class FinancialDocumentProgress extends React.Component<Props, State> {
  public constructor(props: Props) {
    super(props);
    this.state = {
      cancelModalOpen: false,
    };
  }

  closeCancelModal = () => {
    this.setState({
      cancelModalOpen: false,
    });
  };

  public render() {
    const {
      activities, documentType, documentId, resourceStatus,
    } = this.props;
    const { cancelModalOpen } = this.state;
    const allDocumentStatuses = getAllDocumentStatuses(documentType);
    const allStatusActivities = getAllStatusActivities(activities);
    const lastStatusActivity = getLastStatus(allStatusActivities);
    let cancelledDocument: boolean = false;
    if (lastStatusActivity !== undefined) {
      cancelledDocument = allStatusActivities[allStatusActivities.length - 1].subType === 'CANCELLED';
    }

    if (!cancelledDocument) {
      return (
        <>
          <Grid columns={3}>
            <Grid.Row>
              <Grid.Column />
              <Grid.Column>
                <h3
                  style={{ marginBottom: '0.3em', marginTop: '0.2em' }}
                >
                  {formatDocumentStatusTitle(
                    allStatusActivities[allStatusActivities.length - 1],
                    documentType,
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
                  content={`Cancel ${documentType.toLowerCase()}`}
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
              />
            ))}
          </Step.Group>
          <DocumentStatusModal
            open={cancelModalOpen}
            documentId={documentId}
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
        <h3>
          {formatDocumentStatusTitle(
            allStatusActivities[allStatusActivities.length - 1],
            documentType,
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
