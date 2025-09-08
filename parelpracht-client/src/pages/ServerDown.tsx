import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { Container, Header } from "semantic-ui-react";
import { useTitle } from '../components/TitleContext';
import ParelPrachtFullLogo from "../components/ParelPrachtFullLogo";

const ServerDown: React.FC = () => {
  const { t } = useTranslation();
  const { setTitle } = useTitle();

  useEffect(() => {
    setTitle(t('pages.serverDown.title'));
  }, [setTitle, t]);

  return (
    <Container
      textAlign="center"
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >

      {/* <Header as="h1" color="red" style={{ fontSize: "6rem" }}> */}
      {/*   <Loader inline content={<ParelPrachtFullLogo />} size="large" /> */}
      {/*   500 */}
      {/* </Header> */}
      <Header as="h2" icon>
        <ParelPrachtFullLogo />
      </Header>
      <Header as="h2">{t('pages.serverDown.header')}</Header>
      <p>{t('pages.serverDown.subheader')}</p>
      <p> CBC het is STUK!!! </p>
    </Container>
  );
};

export default ServerDown;

