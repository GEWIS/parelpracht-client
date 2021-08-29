import React, { useEffect, useState } from 'react';
import { Button, Grid, Input } from 'semantic-ui-react';
import TimeAgo from 'javascript-time-ago';
import { useTranslation } from 'react-i18next';
import ResourceStatus from '../stores/resourceStatus';

interface Props {
  status: ResourceStatus;
  countFetched: number;
  countTotal: number;
  column: string;
  lastUpdated: Date;
  search: string;

  refresh: () => void;
  setSearch: (search: string) => void;

  bottomLine?: string;
}

function TableControls(props: Props) {
  // Make sure the component refreshes every minute to update "updated ..."
  const [, setTime] = useState(Date.now());
  useEffect(() => {
    const interval = setInterval(() => setTime(Date.now()), 60 * 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const timeAgo = new TimeAgo();
  const { t } = useTranslation();
  return (
    <Grid columns={2}>
      <Grid.Column style={{ paddingTop: 0, paddingBottom: '0.5em' }} verticalAlign="middle">
        <p>
          {`${t('pages.tables.header.items', { items: props.countFetched, total: props.countTotal })} \u00b7
            ${t('pages.tables.header.sorting', { column: props.column })} \u00b7
            ${t('pages.tables.header.update', { time: timeAgo.format(props.lastUpdated) })}`}
          {props.bottomLine !== undefined ? <br /> : undefined}
          {props.bottomLine}
        </p>
      </Grid.Column>
      <Grid.Column style={{ paddingTop: 0, paddingBottom: '0.5em' }} verticalAlign="middle">
        <Button
          icon="refresh"
          floated="right"
          onClick={props.refresh}
          loading={props.status === ResourceStatus.FETCHING}
          title={t('pages.tables.header.refresh')}
        />

        <Input
          style={{ float: 'right' }}
          icon="search"
          iconPosition="left"
          placeholder={t('pages.tables.header.search')}
          value={props.search}
          action={
            <Button icon="close" onClick={() => props.setSearch('')} title={t('pages.tables.header.clear')} />
          }
          onChange={(e) => props.setSearch(e.target.value)}
        />
      </Grid.Column>
    </Grid>
  );
}

TableControls.defaultProps = {
  bottomLine: undefined,
};

export default TableControls;
