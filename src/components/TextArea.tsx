import { useEffect, useRef } from 'react';
import { TextAreaProps } from 'semantic-ui-react/dist/commonjs/addons/TextArea/TextArea';
import { TextArea } from 'semantic-ui-react';

function ExtendableTextArea(props: TextAreaProps) {
  const textArea = useRef<HTMLTextAreaElement | null>(null);

  const setHeight = () => {
    if (!textArea.current || !textArea.current) return;
    textArea.current.style.height = 'auto';
    textArea.current.style.height = `${textArea.current.scrollHeight}px`;
  };

  useEffect(() => {
    setHeight();
  }, [textArea]);

  return (
    <TextArea
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      onChange={(event, x) => {
        setHeight();
        if (props.onChange) props.onChange(event, x);
      }}
      style={{
        overflowY: 'hidden',
        resize: 'none',
        ...props.style,
      }}
      ref={textArea}
    />
  );
}

export default ExtendableTextArea;
