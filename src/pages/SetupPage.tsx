import { useTranslation } from 'react-i18next';
import { Navigate as Redirect } from 'react-router-dom';
import AlertContainer from '../components/alerts/AlertContainer';
import { Container, Image, Segment } from 'semantic-ui-react';
import CenterInPage from '../components/CenterInPage';
import ParelPrachtFullLogo from '../components/ParelPrachtFullLogo';
import React from 'react';
import SetupForm from '../components/auth/SetupForm';
import { useTitle } from '../components/TitleContext';

interface Props {
  setupDone: boolean;
}

function SetupPage({ setupDone }: Props) {
  const { t } = useTranslation();
  const { setTitle } = useTitle();

  React.useEffect(() => {
    setTitle(t('pages.setup'));
  });

  if (setupDone) {
    return <><Redirect to={'/login'}/></>;
  }

  return (
    <>
      <div className="bg"/>
      <div className="bg bg2"/>
      <div className="bg bg3"/>
      <AlertContainer internal/>
      <Container>
        <CenterInPage>
          <Segment>
            <Image src="./gewis-logo.png" size="small" centered />
            <ParelPrachtFullLogo />
            <SetupForm />
          </Segment>
        </CenterInPage>
      </Container>
    </>
  );


}

export default SetupPage;