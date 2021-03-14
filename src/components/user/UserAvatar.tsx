import React from 'react';
import { Icon } from 'semantic-ui-react';

interface Props {
  fileName: string;
  size: string;
  clickable: boolean;
  iconCss?: object;
  imageCss?: object;
}

function UserAvatar(props: Props) {
  if (props.fileName === '') {
    return <Icon name="user circle" style={props.iconCss} />;
  }

  return (
    <div style={{
      width: props.size,
      height: props.size,
      backgroundImage: `url("/static/logos/${props.fileName}")`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center center',
      borderRadius: '50%',
      border: '1px solid #D4D4D5',
      cursor: props.clickable ? 'pointer' : '',
      ...props.imageCss,
    }}
    />
  );
}

UserAvatar.defaultProps = {
  iconCss: {},
  imageCss: {},
};

export default UserAvatar;
