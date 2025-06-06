import { Modal, Segment } from 'semantic-ui-react';
import { marked } from 'marked';
import {useEffect, useState} from "react";
import releaseNotes from '../changelog.md';

export const version = 'v1.5.0';

function VersionModal() {
  const [changeLog, setChangeLog] = useState('');

  useEffect(() => {
    const fillLog = async () => {
      const rawLog = await fetch(releaseNotes as string);
      const c = await marked(await rawLog.text());
      setChangeLog(c);
    }
    fillLog().catch(console.error);
  }, []);

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
      <Segment style={{ marginTop: '0' }} dangerouslySetInnerHTML={{ __html: changeLog }} />
    </Modal>
  );
}

export default VersionModal;
