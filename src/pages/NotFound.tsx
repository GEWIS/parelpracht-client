import React from 'react';
import {
  Container, Grid, Header, Icon, Segment, Image,
} from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';

function NotFound() {
  const { t } = useTranslation();
  return (
    <>
      <Segment style={{ backgroundColor: 'rgba(237, 237, 237, 0.98)' }} vertical basic>
        <Container style={{ paddingTop: '1em' }}>
          <Grid columns={2}>
            <Grid.Column>
              <Header as="h1">
                <Icon name="hand paper" />
                <Header.Content>
                  <h1>
                    {t('pages.notFound.404')}
                  </h1>
                </Header.Content>
              </Header>
            </Grid.Column>
          </Grid>
        </Container>
      </Segment>
      <Container style={{ paddingTop: '4em' }}>
        <Grid columns={2}>
          <Grid.Column textAlign="left" width="4">
            <Image src="/peach.png" fluid />
          </Grid.Column>
          <Grid.Column textAlign="left" verticalAlign="middle" width="12">
            <h1 style={{ fontSize: '70px' }}>
              {t('pages.notFound.header')}
              <br />
              {t('pages.notFound.subheader')}
            </h1>
          </Grid.Column>
        </Grid>
      </Container>
    </>
  );
}

export default NotFound;
