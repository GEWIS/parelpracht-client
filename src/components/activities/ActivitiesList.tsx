import React from 'react';
import {
  Button, Feed, Icon, Loader,
} from 'semantic-ui-react';
import { WithTranslation, withTranslation } from 'react-i18next';
import ActivityComponent from './ActivityComponent';
import { GeneralActivity } from './GeneralActivity';
import { SingleEntities } from '../../stores/single/single';
import CreateCommentRow from './CreateCommentRow';
import ResourceStatus from '../../stores/resourceStatus';
import AuthorizationComponent from '../AuthorizationComponent';
import { Roles } from '../../clients/server.generated';
import { withRouter } from '../../WithRouter';

interface Props extends WithTranslation {
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
  static defaultProps = {
    parentId: undefined,
  };

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
      activities, componentId, componentType, resourceStatus, parentId, t,
    } = this.props;
    const { creating } = this.state;

    if (activities === undefined) {
      return (
        <Loader content="Loading" active />
      );
    }

    let activitiesComponent;
    if (activities.length === 0) {
      activitiesComponent = (
        <h4>
          {t('entities.product.noActivities')}
        </h4>
      );
    } else {
      activitiesComponent = (
        <Feed>
          {[...activities]
            .sort((a, b) => { return b.createdAt.getTime() - a.createdAt.getTime(); })
            .map((activity) => (
              <ActivityComponent
                key={activity.id}
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
            key={-1}
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
          {t('entity.activities')}
          <AuthorizationComponent
            roles={[Roles.GENERAL, Roles.ADMIN, Roles.FINANCIAL]}
            notFound={false}
          >
            <Button
              icon
              labelPosition="left"
              floated="right"
              style={{ marginTop: '-0.5em' }}
              basic
              onClick={() => this.setState({ creating: true })}
            >
              <Icon name="pencil" />
              {t('activities.button.writeComment')}
            </Button>
          </AuthorizationComponent>
        </h3>
        {createRow}
        {activitiesComponent}
      </>
    );
  }
}

export default withTranslation()(withRouter(ActivitiesList));
