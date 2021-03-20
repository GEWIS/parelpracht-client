import React from 'react';
import { Modal } from 'semantic-ui-react';

function Credits() {
  return (
    <Modal
      trigger={(
        <span style={{ cursor: 'pointer' }}>
          Designed and built with
          {' '}
          <span role="img" aria-label="love">🍑</span>
          {' '}
          by the 39th board
        </span>
    )}
      closeIcon
    >
      <Modal.Header>About ParelPracht</Modal.Header>
      <Modal.Content>
        ParelPracht was built in the winter of 2020-2021 during the second lockdown of the corona
        crisis by the 39th board of GEWIS. Special thanks to everyone who helped out:
        <ul>
          <li>Roy Kakkenberg</li>
          <li>Koen de Nooij</li>
          <li>Jealy van den Aker</li>
          <li>Max Opperman</li>
          <li>Wouter van der Heijden</li>
          <li>Irne Verwijst</li>
        </ul>
      </Modal.Content>
    </Modal>
  );
}

export default Credits;
