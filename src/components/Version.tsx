import React from 'react';
import { Modal, Segment } from 'semantic-ui-react';
import marked from 'marked';
import releaseNotes from '../changelog.md';

export const version = 'v1.2.0';

interface Props {}
interface State {
  changelog: string;
}

class VersionModal extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      changelog: '',
    };
  }

  async componentDidMount() {
    const rawLog = await fetch(releaseNotes);
    const changelog = await marked(await rawLog.text());
    this.setState({
      changelog,
    });
  }

  render() {
    return (
      <Modal
        trigger={(
          <span style={{ cursor: 'pointer' }}>
            ParelPracht
            {' '}
            {version}
          </span>
        )}
        closeIcon
      >
        <Segment style={{ marginTop: '0' }} dangerouslySetInnerHTML={{ __html: this.state.changelog }} />
      </Modal>
    );
  }
}

export default VersionModal;
