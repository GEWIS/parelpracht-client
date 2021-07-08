import React from 'react';
import { Header, Image } from 'semantic-ui-react';

function ParelPrachtFullLogo() {
  return (
    <Header as="h1">
      <Image src="/ParelPracht-black.png" size="mini" style={{ marginBottom: '5.5px', marginRight: '-3px', paddingRight: '-4px' }} />
      <span style={{ marginBottom: '-1px', verticalAlign: 'bottom', fontFamily: 'Recursive' }}>arelPracht</span>
    </Header>
  );
}

export default ParelPrachtFullLogo;
