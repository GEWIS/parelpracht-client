import React from 'react';
import { connect } from 'react-redux';
import { Step } from 'semantic-ui-react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { RootState } from '../../stores/store';
import { GeneralActivity } from './GeneralActivity';
import FinancialDocumentStep from './FinancialDocumentStep';
import {
  formatDocumentStatusTitle,
  getAllStatusActivities,
  getCompletedContractStatuses,
  getLastStatus,
} from '../../helpers/activity';

interface Props extends RouteComponentProps {
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
    const { activities, documentType } = this.props;
    const allContractStatuses = getCompletedContractStatuses('ALL');
    const allStatusActivities = getAllStatusActivities(activities);
    const lastStatusActivity = getLastStatus(allStatusActivities);
    const canceledDocument = allStatusActivities[allStatusActivities.length - 1].subType === 'CANCELLED';
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

    return (
      <>
        <h3>
          {formatDocumentStatusTitle(canceledDocument, documentType)}
        </h3>
        <Step.Group ordered stackable="tablet" widths={5} fluid>
          {allContractStatuses.map((currentStatus) => (
            <FinancialDocumentStep
              lastStatusActivity={lastStatusActivity}
              status={currentStatus}
              allStatusActivities={allStatusActivities}
              documentType={documentType}
              cancelled={canceledDocument}
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
