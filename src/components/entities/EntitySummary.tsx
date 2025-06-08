import { ReactNode } from 'react';
import { Header, Icon, Loader, Placeholder, Segment, SemanticICONS } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import { SingleEntities } from '../../stores/single/single';
import './EntitySummary.scss';

interface Props {
  loading: boolean;
  icon: SemanticICONS;
  entity: SingleEntities;
  title?: string;

  rightHeader?: ReactNode;

  children?: ReactNode;
}

export function EntitySummary({ loading, icon, entity, title = '', rightHeader, children }: Props) {
  const { t } = useTranslation();

  if (loading) {
    return (
      <>
        <Header as="h1" attached="top" style={{ backgroundColor: 'rgba(238, 238, 238, 0.98)' }}>
          <Icon name={icon} />
          <Header.Content>
            <Header.Subheader>{t(`entity.${entity.toLowerCase()}`)}</Header.Subheader>
            <Loader active inline />
          </Header.Content>
        </Header>
        <Segment attached="bottom" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
          <Placeholder>
            <Placeholder.Line length="long" />
          </Placeholder>
        </Segment>
      </>
    );
  }

  return (
    <>
      <Header as="h1" attached="top" style={{ backgroundColor: 'rgba(238, 238, 238, 0.98)' }}>
        <div className="header-container">
          <div className="icon">
            <Icon name={icon} size="large" />
          </div>
          <div className="name">
            <Header.Content style={{ paddingLeft: '1.25rem' }}>
              <Header.Subheader>{t(`entity.${entity.toLowerCase()}`)}</Header.Subheader>
              {title}
            </Header.Content>
          </div>
          {rightHeader ? <div className="logo">{rightHeader}</div> : undefined}
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
        <div className="summary-container">{children}</div>
      </Segment>
    </>
  );
}
