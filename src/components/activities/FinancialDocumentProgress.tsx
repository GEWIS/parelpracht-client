import React from 'react';
import { connect } from 'react-redux';
import { Button, Icon, Step } from 'semantic-ui-react';
import { NavLink, RouteComponentProps, withRouter } from 'react-router-dom';
import { Dispatch } from 'redux';
import { RootState } from '../../stores/store';
import { GeneralActivity } from './GeneralActivity';
import FinancialDocumentStep from './FinancialDocumentStep';
import {
  formatDocumentStatusTitle,
  getAllStatusActivities,
  getCompletedDocumentStatuses,
  getLastStatus,
} from '../../helpers/activity';
import DocumentStatusModal from './DocumentStatusModal';
import { fetchSingle } from '../../stores/single/actionCreators';
import { SingleEntities } from '../../stores/single/single';

interface Props extends RouteComponentProps {
  documentId: number;
  activities: GeneralActivity[];
  documentType: SingleEntities;
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
    const { activities, documentType, documentId } = this.props;
    const { cancelModalOpen } = this.state;
    const allDocumentStatuses = getCompletedDocumentStatuses('ALL', documentType);
    const allStatusActivities = getAllStatusActivities(activities);
    const lastStatusActivity = getLastStatus(allStatusActivities);
    const cancelledDocument = allStatusActivities[allStatusActivities.length - 1].subType === 'CANCELLED';
    if (activities.length === 0) {
      return (
        <>
          <h3>
            Document Status
          </h3>
          <h4>
            No status known yet.
          </h4>
        </>
      );
    }

    if (!cancelledDocument) {
      return (
        <>
          <h3>
            {formatDocumentStatusTitle(
              allStatusActivities[allStatusActivities.length - 1],
              documentType,
            )}
            <Button
              floated="right"
              labelPosition="left"
              icon="close"
              onClick={() => {
                this.setState({
                  cancelModalOpen: true,
                });
              }}
              content={`Cancel ${documentType.toLowerCase()}`}
            />
            {/*  <Icon name="close" /> */}
            {/*  Cancel */}
            {/* </Button> */}
          </h3>
          <Step.Group stackable="tablet" widths={5} fluid>
            {allDocumentStatuses.map((currentStatus) => (
              <FinancialDocumentStep
                documentId={documentId}
                lastStatusActivity={lastStatusActivity}
                status={currentStatus}
                allStatusActivities={allStatusActivities}
                documentType={documentType}
                cancelled={cancelledDocument}
              />
            ))}
          </Step.Group>
          <DocumentStatusModal
            open={cancelModalOpen}
            documentId={documentId}
            documentType={documentType}
            documentStatus="CANCELLED"
            close={this.closeCancelModal}
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
              lastStatusActivity={lastStatusActivity}
              status={currentStatus}
              allStatusActivities={allStatusActivities}
              documentType={documentType}
              cancelled={cancelledDocument}
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
