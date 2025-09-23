import './BackgroundAnimation.css';
import { PropsWithChildren } from 'react';

type Props = PropsWithChildren;

function BackgroundAnimation({ children }: Props) {
  return <>{children}</>;
}

export default BackgroundAnimation;
