import React from 'react';
import { connect } from 'react-redux';
import { Button, Icon, Step } from 'semantic-ui-react';
import { NavLink, RouteComponentProps, withRouter } from 'react-router-dom';
import { RootState } from '../../stores/store';
import { GeneralActivity } from './GeneralActivity';
import FinancialDocumentStep from './FinancialDocumentStep';
import {
  formatDocumentStatusTitle,
  getAllStatusActivities,
  getCompletedDocumentStatuses,
  getLastStatus,
} from '../../helpers/activity';

interface Props extends RouteComponentProps {
  documentId: number;
  activities: GeneralActivity[];
  documentType: string;
}

interface State {

}

class FinancialDocumentProgress extends React.Component<Props, State> {
  public constructor(props: Props) {
    super(props);
  }

  public render() {
    const { activities, documentType, documentId } = this.props;
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
              as={NavLink}
              to={`/${documentType.toLowerCase()}/${documentId}/status/cancelled`}
              labelPosition="left"
              icon="close"
              content="Cancel"
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

const mapStateToProps = (state: RootState) => {
  return {
  };
};

const mapDispatchToProps = () => ({
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FinancialDocumentProgress));
