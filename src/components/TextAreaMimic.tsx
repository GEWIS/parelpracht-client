import React from 'react';
import './TextAreaMimic.scss';

interface Props {
  content: string | undefined;
}
function TextAreaMimic(props: Props) {
  return (
    <p className="textarea-mimic">
      {props.content?.split('\n').map((line) => {
        return (
          <React.Fragment key={line}>
            {line}
            {' '}
            <br />
          </React.Fragment>
        );
      })}
    </p>
  );
}

export default TextAreaMimic;
