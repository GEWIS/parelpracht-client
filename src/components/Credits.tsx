import React from 'react';
import { Modal } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';

function Credits() {
  const { t } = useTranslation();

  return (
    <Modal
      trigger={(
        <span style={{ cursor: 'pointer' }}>
          {t('footer.creators1')}
          {' '}
          <span role="img" aria-label="love">🍑</span>
          {' '}
          {t('footer.creators2')}
        </span>
    )}
      closeIcon
    >
      <Modal.Header>{t('footer.credits.header')}</Modal.Header>
      <Modal.Content>
        {t('footer.credits.description1')}
        <ul>
          <li>Roy Kakkenberg</li>
          <li>Koen de Nooij</li>
          <li>Jealy van den Aker</li>
          <li>Max Opperman</li>
          <li>Wouter van der Heijden</li>
          <li>Irne Verwijst</li>
        </ul>
        {t('footer.credits.description2')}
        <br />
        <br />
        {t('footer.credits.abc')}
      </Modal.Content>
    </Modal>
  );
}

export default Credits;
