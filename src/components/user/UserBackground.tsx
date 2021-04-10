import React from 'react';
import { Button, Icon } from 'semantic-ui-react';

interface Props {
  fileName: string;
  clickable: boolean;
}

function UserBackground(props: Props) {
  /**
   * Image is clickable means that it can be uploaded from there
   */
  if (props.clickable && props.fileName === '') {
    return (
      <Button
        icon
        labelPosition="left"
        floated="right"
        style={{ marginTop: '-0.5em' }}
        basic
      >
        <Icon name="plus" />
        Upload Background
      </Button>
    );
  }
  return (
    <div style={{
      width: '4rem',
      height: '4rem',
      backgroundImage: `url("/static/backgrounds/${props.fileName}")`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center center',
      cursor: props.clickable ? 'pointer' : '',
    }}
    />
  );
}

export default UserBackground;
