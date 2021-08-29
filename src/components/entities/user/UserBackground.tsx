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
    <img
      src={`/static/backgrounds/${props.fileName}`}
      style={{
        width: '100%',
        height: '100%',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
        cursor: props.clickable ? 'pointer' : '',
      }}
      alt="background preview"
    />
  );
}

export default UserBackground;
