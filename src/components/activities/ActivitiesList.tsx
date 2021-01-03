import React from 'react';
import { connect } from 'react-redux';
import { Loader } from 'semantic-ui-react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ProductActivity } from '../../clients/server.generated';
import { RootState } from '../../stores/store';
import ActivityComponent from './ActivityComponent';

interface Props extends RouteComponentProps {
  activities: ProductActivity[] | undefined;
}

interface State {

}

class ActivitiesList extends React.Component<Props, State> {
  public constructor(props: Props) {
    super(props);
  }

  public render() {
    const { activities } = this.props;

    if (activities === undefined) {
      return (
        <Loader content="Loading" active />
      );
    }

    if (activities.length === 0) {
      return (
        <>
          <h3>
            Activities
          </h3>
          <h4>
            No activities logged yet.
          </h4>
        </>
      );
    }

    return (
      <>
        <h3>
          Activities
        </h3>
        {activities.map((activity) => (
          <ActivityComponent activity={activity} />
        ))}
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ActivitiesList));
