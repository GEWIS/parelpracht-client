import React, { ReactNode } from 'react';
import {
  Header, Icon, Loader, Placeholder, Segment, SemanticICONS,
} from 'semantic-ui-react';
import { SingleEntities } from '../../stores/single/single';
import './EntitySummary.scss';
import { useTranslation } from 'react-i18next';

interface Props {
  loading: boolean;
  icon: SemanticICONS;
  entity: SingleEntities;
  title?: string;

  rightHeader?: ReactNode;

  children?: ReactNode;
}

export function EntitySummary(props: Props) {
  const { t } = useTranslation();

  if (props.loading) {
    return (
      <>
        <Header as="h1" attached="top" style={{ backgroundColor: 'rgba(238, 238, 238, 0.98)' }}>
          <Icon name={props.icon} />
          <Header.Content>
            <Header.Subheader>{t(`entity.${props.entity.toLowerCase()}`)}</Header.Subheader>
            <Loader active inline />
          </Header.Content>
        </Header>
        <Segment attached="bottom" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
          <Placeholder><Placeholder.Line length="long" /></Placeholder>
        </Segment>
      </>
    );
  }

  return (
    <>
      <Header as="h1" attached="top" style={{ backgroundColor: 'rgba(238, 238, 238, 0.98)' }}>
        <div className="header-container">
          <div className="icon">
            <Icon name={props.icon} size="large" />
          </div>
          <div className="name">
            <Header.Content style={{ paddingLeft: '1.25rem' }}>
              <Header.Subheader>{t(`entity.${props.entity.toLowerCase()}`)}</Header.Subheader>
              {props.title}
            </Header.Content>
          </div>
          { props.rightHeader ? (
            <div className="logo">
              {props.rightHeader}
            </div>
          ) : undefined }

        </div>
        {/* <Grid> */}
        {/*  <Grid.Row columns="2"> */}
        {/*    <Grid.Column> */}
        {/*      <Grid columns="equal"> */}
        {/*        <Grid.Column width="1"> */}
        {/*          <Icon name={props.icon} size="large" style={{ padding: '0.5rem' }} /> */}
        {/*        </Grid.Column> */}
        {/*        <Grid.Column> */}
        {/*          <Header.Content style={{ paddingLeft: '1.25rem' }}> */}
        {/*            <Header.Subheader>{formatEntity(props.entity)}</Header.Subheader> */}
        {/*            {props.title} */}
        {/*          </Header.Content> */}
        {/*        </Grid.Column> */}
        {/*      </Grid> */}
        {/*    </Grid.Column> */}
        {/*    { props.rightHeader ? ( */}
        {/*      <Grid.Column> */}
        {/*        {props.rightHeader} */}
        {/*      </Grid.Column> */}
        {/*    ) : undefined } */}
        {/*  </Grid.Row> */}
        {/* </Grid> */}
      </Header>
      <Segment attached="bottom" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
        <div className="summary-container">
          {props.children}
        </div>
      </Segment>
    </>
  );
}

EntitySummary.defaultProps = {
  title: '',
  rightHeader: undefined,
  children: undefined,
};
