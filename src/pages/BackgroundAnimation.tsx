import React from 'react';
import './BackgroundAnimation.css';

interface Props {
  children: any;
}

function BackgroundAnimation({ children }: Props) {
  return (
    <>
      {children}
    </>
  );
}

export default BackgroundAnimation;
