import React from 'react';
import { connect } from 'react-redux';
import {
  Button, Feed, Icon, Loader,
} from 'semantic-ui-react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Dispatch } from 'redux';
import { RootState } from '../../stores/store';
import ActivityComponent from './ActivityComponent';
import { GeneralActivity } from './GeneralActivity';
import { SingleEntities } from '../../stores/single/single';
import CreateCommentRow from './CreateCommentRow';
import ResourceStatus from '../../stores/resourceStatus';

interface Props extends RouteComponentProps {
  activities: GeneralActivity[];
  componentId: number;
  componentType: SingleEntities;
  // If the document is a ProductInstance, the parentId is the contract ID
  parentId?: number;

  resourceStatus: ResourceStatus;
}

interface State {
  creating: boolean;
}

class ActivitiesList extends React.Component<Props, State> {
  public constructor(props: Props) {
    super(props);
    this.state = {
      creating: false,
    };
  }

  cancelCreate = () => {
    this.setState({ creating: false });
  };

  public render() {
    const {
      activities, componentId, componentType, resourceStatus, parentId,
    } = this.props;
    const { creating } = this.state;

    if (activities === undefined) {
      return (
        <Loader content="Loading" active />
      );
    }

    let activitiesList;
    if (activities.length === 0) {
      activitiesList = (
        <h4>
          There are no activities logged yet.
        </h4>
      );
    } else {
      activitiesList = (
        <Feed>
          {activities
            .sort((a, b) => { return b.updatedAt.getTime() - a.updatedAt.getTime(); })
            .map((activity) => (
              <ActivityComponent
                activity={activity as GeneralActivity}
                componentId={componentId}
                componentType={componentType}
                parentId={parentId}
              />
            ))}
        </Feed>
      );
    }

    let createRow;

    if (creating) {
      createRow = (
        <>
          <CreateCommentRow
            create
            close={this.cancelCreate}
            componentId={componentId}
            componentType={componentType}
            resourceStatus={resourceStatus}
            parentId={parentId}
          />
        </>
      );
    }

    return (
      <>
        <h3>
          Activities
          <Button
            icon
            labelPosition="left"
            floated="right"
            style={{ marginTop: '-0.5em' }}
            basic
            onClick={() => this.setState({ creating: true })}
          >
            <Icon name="pencil" />
            Write comment
          </Button>
        </h3>
        {createRow}
        {activitiesList}
      </>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ActivitiesList));
