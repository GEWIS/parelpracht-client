import { Modal, Segment } from 'semantic-ui-react';
import { marked } from 'marked';
import { useEffect, useState } from 'react';
import releaseNotes from '../changelog.md';

function VersionModal() {
  const [changeLog, setChangeLog] = useState('');

  const getVersion = () => {
    const { shortHash, lastTag, lastCommitTags } = __LAST_COMMIT_INFO;
    if (lastCommitTags && lastCommitTags.length > 0) {
      return lastCommitTags.join('-');
    }
    return `${lastTag}-dev-${shortHash}`;
  }

  useEffect(() => {
    const fillLog = async () => {
      const rawLog = await fetch(releaseNotes as string);
      const c = await marked(await rawLog.text());
      setChangeLog(c);
    };
    fillLog().catch(console.error);
  }, []);

  return (
    <Modal trigger={<span style={{ cursor: 'pointer' }}>ParelPracht {getVersion()}</span>} closeIcon>
      <Segment style={{ marginTop: '0' }} dangerouslySetInnerHTML={{ __html: changeLog }} />
    </Modal>
  );
}

export default VersionModal;
