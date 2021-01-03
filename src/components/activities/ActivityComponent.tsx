import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import {
  Button, Header, Icon, Segment,
} from 'semantic-ui-react';
import { connect } from 'react-redux';
import './Activity.scss';
import { RootState } from '../../stores/store';
import { getUserName } from '../../stores/user/selectors';
import { formatActivityType, formatActivityDate, formatStatus } from '../../helpers/activity';
import { GeneralActivity } from './GeneralActivity';

interface Props extends RouteComponentProps {
  activity: GeneralActivity;

  userName: string;
}

class ActivityComponent extends React.Component<Props> {
  public render() {
    const { activity, userName } = this.props;
    if (activity.type === 'STATUS') {
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
                {formatActivityType(activity.type)}
                {formatStatus(activity.subType)}
                <Header.Subheader>
                  {formatActivityDate(activity.createdAt, userName)}
                </Header.Subheader>
              </Header.Content>
            </Header>
          </Segment>
        </Segment.Group>
      );
    }
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

const mapStateToProps = (state: RootState, props: { activity: GeneralActivity }) => {
  return {
    userName: getUserName(state, props.activity.createdById),
  };
};

export default withRouter(connect(mapStateToProps)(ActivityComponent));
