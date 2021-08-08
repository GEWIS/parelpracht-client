import React from 'react';
import { TextAreaProps } from 'semantic-ui-react/dist/commonjs/addons/TextArea/TextArea';
import { TextArea } from 'semantic-ui-react';

class ExtendableTextArea extends React.Component<TextAreaProps> {
  private readonly textArea: React.RefObject<TextArea>;

  constructor(props: TextAreaProps) {
    super(props);

    this.textArea = React.createRef();
  }

  componentDidMount() {
    this.setHeight();
  }

  setHeight = () => {
    // @ts-ignore Typescript lies because this element does exist!
    if (!this.textArea.current && !this.textArea.current.ref.current) return;
    // @ts-ignore
    const { current } = this.textArea.current.ref;
    current.style.height = 'auto';
    current.style.height = `${current.scrollHeight}px`;
  };

  render() {
    return (
      <TextArea
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...this.props}
        onChange={(event, x) => {
          this.setHeight();
          if (this.props.onChange) this.props.onChange(event, x);
        }}
        style={{
          overflowY: 'hidden',
          resize: 'none',
          ...this.props.style,
        }}
        ref={this.textArea}
      />
    );
  }
}

export default ExtendableTextArea;
