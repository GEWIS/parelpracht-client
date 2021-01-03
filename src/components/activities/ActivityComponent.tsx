import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import {
  Button, Header, Icon, Segment,
} from 'semantic-ui-react';
import { connect } from 'react-redux';
import { ActivityType, ProductActivity, User } from '../../clients/server.generated';
import './Activity.scss';
import { RootState } from '../../stores/store';
import { getUserName } from '../../stores/user/selectors';
import { formatActivityType, formatActivityDate } from '../../helpers/activity';

interface Props extends RouteComponentProps {
  activity: ProductActivity;

  userName: string;
}

class ActivityComponent extends React.Component<Props> {
  public render() {
    const { activity, userName } = this.props;
    return (
      <Segment.Group
        horizontal
        className="activity-component"
        style={{ margin: 0, marginTop: '0.2em' }}
      >
        <Segment
          as={Button}
          textAlign="left"
        >
          <Header>
            <Icon name="list alternate outline" size="large" />
            <Header.Content>
              {activity.description}
              <Header.Subheader>
                {formatActivityType(activity.type)}
              </Header.Subheader>
              <Header.Subheader>
                {formatActivityDate(activity.createdAt, userName)}
              </Header.Subheader>
            </Header.Content>
          </Header>
        </Segment>
      </Segment.Group>
    );
  }
}

const mapStateToProps = (state: RootState, props: { activity: ProductActivity }) => {
  return {
    userName: getUserName(state, props.activity.createdById),
  };
};

export default withRouter(connect(mapStateToProps)(ActivityComponent));
