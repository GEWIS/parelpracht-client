import { Icon } from 'semantic-ui-react';

interface Props {
  fileName: string;
  size: string;
  clickable: boolean;
  iconCss?: object;
  imageCss?: object;
}

function UserAvatar({ fileName, size, clickable, iconCss = {}, imageCss = {} }: Props) {
  if (fileName === '') {
    return <Icon name="user circle" style={iconCss} />;
  }

  return (
    <div
      style={{
        width: size,
        height: size,
        backgroundImage: `url("/static/logos/${fileName}")`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
        borderRadius: '50%',
        border: '1px solid #D4D4D5',
        cursor: clickable ? 'pointer' : '',
        ...imageCss,
      }}
    />
  );
}

export default UserAvatar;
