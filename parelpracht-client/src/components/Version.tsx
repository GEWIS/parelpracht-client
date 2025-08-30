import { Modal, ModalContent, ModalHeader } from 'semantic-ui-react';
import { marked } from 'marked';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import releaseNotes from '../changelog.md';
import { getLanguage } from '../localization';

function VersionModal() {
  const { t } = useTranslation();
  const [changeLog, setChangeLog] = useState('');
  const [title, setTitle] = useState('Change log');

  const getVersion = () => {
    const { lastCommit, lastRelease } = __LAST_COMMIT_INFO;
    if (lastCommit.tags.length > 0) {
      return `${lastCommit.tags.join('-')}`;
    }
    return `${lastRelease.tags.join('-')}-dev-${lastCommit.shortHash}`;
  };

  useEffect(() => {
    const fillLog = async () => {
      const rawLog = await fetch(releaseNotes as string);
      let c = await marked(await rawLog.text());
      const rows = c.split('\n');

      // Extract the title from the HTML body
      if (rows[0].startsWith('<h1>')) {
        const endTagIndex = rows[0].indexOf('</h1>');
        setTitle(rows[0].substring('<h1>'.length, endTagIndex));
        rows.splice(0, 1);

        c = rows.join('\n');
      }

      setChangeLog(c);
    };
    fillLog().catch(console.error);
  }, []);

  return (
    <Modal trigger={<span style={{ cursor: 'pointer' }}>ParelPracht {getVersion()}</span>} closeIcon>
      <ModalHeader>{title}</ModalHeader>
      <ModalContent scrolling>
        <p>
          {t('changelog.description1')}{' '}
          <span style={{ fontWeight: 'bold' }}>{__LAST_COMMIT_INFO.lastRelease.tags.join('-')}</span>,{' '}
          {t('changelog.description2', {
            date: new Date(__LAST_COMMIT_INFO.lastRelease.date).toLocaleDateString(getLanguage(), {
              dateStyle: 'long',
            }),
          })}
        </p>
        <hr />
        <div style={{ marginTop: '0' }} dangerouslySetInnerHTML={{ __html: changeLog }} />
      </ModalContent>
    </Modal>
  );
}

export default VersionModal;
