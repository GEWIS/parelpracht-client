import React from 'react';

interface Props {
  fileName: string;
  clickable: boolean;
}

function UserBackground(props: Props) {
  /**
   * Image is clickable means that it can be uploaded from there
   */
  if (props.fileName === '') {
    return null;
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
